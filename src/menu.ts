import { app, Menu, dialog, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";

import * as shared from './shared';
import { MainHelpers } from "./helpers";
const helpers = new MainHelpers();

const serveStatic = require('node-static');

var extWindow;

const template = [
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'toggledevtools' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'hexo',
        type: 'submenu',
        submenu: [
            {
                label: 'view Website',
                click(menuItem: any, currentWindow: Electron.BrowserWindow, event: Event) {
                    extWindow = new BrowserWindow({
                        webPreferences: {
                            nodeIntegration: false
                            //preload: path.resolve(path.join(__dirname, '/preload.js'))
                        } //requre is not working but jquery
                    })
                    //extWindow.maximize();
                    extWindow.loadURL('http://localhost:3000/de');
                    currentWindow.close();

                    //redirect on inpage navigation to other port
                    /*
                    extWindow.webContents.on('will-navigate', (event, url) => {
                        console.log(event, url)
                        event.preventDefault()


                        var _url = url.replace('3000/en', '3001/en')
                        console.log(_url)
                        extWindow.loadURL(_url);
                    })
                    */
                }
            },
            {
                label: 'Admin',
                click(menuItem: any, currentWindow: Electron.BrowserWindow, event: Event) {
                    /*
                    extWindow = new BrowserWindow({

                        webPreferences: {
                            nodeIntegration: false
                            //preload: path.resolve(path.join(__dirname, '/preload.js'))
                        } //requre is not working but jquery
                    })
                    //extWindow.maximize();
                    extWindow.loadURL('http://localhost:3000/de/admin/');
                    currentWindow.close();
                    */
                    extWindow = new BrowserWindow({

                        webPreferences: {
                            nodeIntegration: true
                            //preload: path.resolve(path.join(__dirname, '/preload.js'))
                        } //requre is not working but jquery
                    })
                    extWindow.loadURL(url.format({
                        pathname: path.join(__dirname, "../index.html"),
                        protocol: "file:",
                        slashes: true,
                    }));
                    currentWindow.close();
                }
            },
            {
                label: 'Set Hexo Config',
                accelerator: 'Control+O',
                click(menuItem: any, currentWindow: any, event: Event) {
                    var properties: any = ['multiSelections', 'createDirectory', 'openFile'];
                    dialog.showOpenDialog(currentWindow, { properties: properties }, (filePaths: string[]) => {
                        console.log(filePaths[0]);

                        shared.APPSTORE.set('hexoconfig', {
                            filePath: filePaths[0]
                        });
                    });



                }
            },
            {
                label: 'Start Server',
                click(menuItem: any, currentWindow: any, event: Event) {
                    //from hexo server
                    var config = helpers.getConfig();
                    if (config) {
                        console.log(config.filePath);

                        var _root = path.join(path.dirname(config.filePath), 'public/');

                        var fileServer = new serveStatic.Server(_root);

                        require('http').createServer(function (request, response) {
                            request.addListener('end', function () {
                                fileServer.serve(request, response);
                            }).resume();

                            extWindow = new BrowserWindow({
                                webPreferences: {
                                    nodeIntegration: false
                                }
                            })
                            //extWindow.maximize();
                            extWindow.loadURL('http://localhost:3000/de/');
                            currentWindow.close();

                        }).listen(3000);
                    }



                }
            }
        ]
    },
    {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                accelerator: 'Control+O',
                click: (menuItem: any, currentWindow: any, event: Event) => {

                    /*
                    var properties: any = ['multiSelections', 'createDirectory', 'openFile'];


                    dialog.showOpenDialog(currentWindow, { properties: properties }, (filePaths: string[]) => {
                        console.log(filePaths[0])
                        let _hexo = new HexoApi(filePaths[0]).init((hexo: any) => {
                            hexo.call('server', { port: 3000 }).then(() => {
                                return hexo.exit();
                            }).catch((err: any) => {
                                return hexo.exit(err);
                            });
                        });


                    });
                    */
                }
            },
            {
                label: 'Quit',
                accelerator: 'Control+Q',
                click: () => { app.quit(); }
            },
        ]
    },
    {
        role: 'window',
        submenu: [
            { role: 'minimize' },
            { role: 'close' },
            { role: 'quit' }
        ]
    }
]

const menu = Menu.buildFromTemplate(<any>template)
Menu.setApplicationMenu(menu)