import { app, BrowserWindow, Menu, dialog, Notification } from "electron";
import * as path from "path";
import * as url from "url";

//---------------------------
import * as shared from './shared';
import './menu';
import { MainHelpers } from "./helpers";
const helpers = new MainHelpers();
import { HexoApi } from "./hexo";


let mainWindow: Electron.BrowserWindow;


/**
 * Starts electron
 * check if config for hexo is set
 * set directory of hexo site
 * 
 * check multi language config
 * 
 * set config file for each language
 * start hexo-server for each language //parallel or worker????
 * create Naviagtion to show Webseite and Admin-Page or go back with https://electronjs.org/docs/api/web-contents#contentsgoback
 * create redirection to language specific-port for show site 
 * 
 * 
 */


export class MainProcess {


  


  constructor() {

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on("ready", () => {
      this.createWindow();
    });

    // Quit when all windows are closed.
    app.on("window-all-closed", () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    app.on("activate", () => {
      // On OS X it"s common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) {
        this.createWindow();
      }
    });

    // In this file you can include the rest of your app"s specific main process
    // code. You can also put them in separate files and require them here.
    const { ipcMain } = require('electron')
    ipcMain.on('asynchronous-message', (event: any, arg: any) => {
      console.log(arg)  // prints "ping"
      event.sender.send('asynchronous-reply', 'pong')
    })


  }

  showOpenDialogForConfig() {

  }

  getConfig(): { filepath: string } | false {
    var hexoconfig = shared.APPSTORE.get('hexoconfig')
    if (hexoconfig) {
      return hexoconfig;
    } else {
      return false;
    }
  }

  checkUrlBase(url: string) {

  }

  startHexo() {
    var port_de = 3000, port_en = 3000;

    var config = helpers.getConfig();

    if (config != false) {

      var configfiles = helpers.checkMultiConfigs(config.filePath);

      //TODO generate mullti sites not working!!!!!!!

      /*
      helpers.syncLoop(configfiles.length, (loop) => {
        let i = loop.iteration();
        let configfile = configfiles[i];

        var _hexo = new HexoApi(configfile).init((hexo: any) => {

          hexo.call('clean', { config: configfile }).then(() => {
            hexo.call('generate', { config: configfile }).then(() => {

              var note = new Notification({
                title: 'Hexo Generate Site ',
                body: 'Hexo is generating your Site and watch for changes'
              })
              note.show()

              console.log(_hexo)
              hexo.exit();
              loop.next();
            }).catch((err: any) => {
              return hexo.exit(err);
            });
            hexo.exit();

          }).catch((err: any) => {
            return hexo.exit(err);
          });

        })


      }, () => {
        console.log('done');
      });
      */



      configfiles.forEach((configfile) => {
        console.log('---------------' + configfile)
        let _hexo = new HexoApi(configfile).init((hexo: any) => {

          hexo.call('generate', { config: configfile }).then(() => {

            var note = new Notification({
              title: 'Hexo Generate Site ',
              body: 'Hexo is generating your Site and watch for changes'
            })
            note.show()


            return hexo.exit();
          }).catch((err: any) => {
            return hexo.exit(err);
          });



        })
      })


      /*
            let _hexo = new HexoApi(config.filePath).init((hexo: any) => {
      
            
              hexo.call('server', { port: port_de }).then(() => {
      
                var note = new Notification({
                  title: 'Hexo Server',
                  body: 'view Site on http://localhost:' + port_de
                })
                note.show()
      
                return hexo.exit();
              }).catch((err: any) => {
                return hexo.exit(err);
              });
           
      
            });
            */

    } else {
      console.log(config)
    }

  }

  createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
      height: 600,
      width: 800
    });

    //shared.APPSTORE.delete('hexoconfig');

    var hexoconf = this.getConfig();
    if (hexoconf) {
      this.startHexo();
    } else {
      helpers.showDialog(mainWindow, (value: number) => {
        if (value == 0) {
          let properties: any = ['multiSelections', 'createDirectory', 'openFile'];
          dialog.showOpenDialog(mainWindow, { properties: properties }, (filePaths: string[]) => {

            helpers.setConfig({
              filePath: filePaths[0]
            })

            this.startHexo();
          });
        }
      })
    }


    // and load the index.html of the app.
    //mainWindow.loadURL('http://localhost:3000');

    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, "../index.html"),
      protocol: "file:",
      slashes: true,
    }));

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      mainWindow = null;
    });
  }
}

const _MAIN = new MainProcess();
