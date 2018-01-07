import { dialog, Notification } from "electron";
import * as shared from './shared';
import * as path from "path";
import * as fs from "fs";

export class MainHelpers {

    constructor() {

    }

    showNotification() {
        var note = new Notification({
            title: 'Test Notification',
            body: 'This is the Body of my Notification'
        })
        note.show()
    }

    showDialog(win: Electron.BrowserWindow, cb: Function) {
        dialog.showMessageBox(win, {
            buttons: ['Ok'],
            type: 'question',
            title: 'Hexo Config',
            message: 'Pleas set the config file for Hexo (_config.yml)'
        }, (value) => {
            if (!cb)
                return;
            cb(value);
        })
    }

    checkMultiConfigs(filePath: string): Array<string> {
        var confdir = path.dirname(filePath)
        var files = fs.readdirSync(confdir);
        var conffiles = files.filter((file) => {
            return file.match(/(_config-)[a-z]{2}(.yml)/g);
        });

        conffiles = conffiles.map((file) => {
            return path.join(confdir, file);
        })

        return conffiles;
    }

    getContent(dirpath:string) {
        var config = this.getConfig();
        if (config) {
            let confdir = path.join(path.dirname(config.filePath),dirpath)
            let files = fs.readdirSync(confdir);
            return files;
        }
    }

    setConfig(config: { filePath: string }) {
        var hexoconfig = shared.APPSTORE.get('hexoconfig')
        //store.delete('unicorn');
        shared.APPSTORE.set('hexoconfig', config);
    }

    clearConfig() {
        shared.APPSTORE.delete('hexoconfig');
    }

    getConfig(): { filePath: string } | false {
        var hexoconfig = shared.APPSTORE.get('hexoconfig')
        if (hexoconfig) {
            return hexoconfig;
        } else {
            return false;
        }
    }

    syncLoop(iterations, process, exit) {
        var index = 0,
            done = false,
            shouldExit = false;
        var loop = {
            next: function () {
                if (done) {
                    if (shouldExit && exit) {
                        return exit(); // Exit if we're done
                    }
                }
                // If we're not finished
                if (index < iterations) {
                    index++; // Increment our index
                    process(loop); // Run our process, pass in the loop
                    // Otherwise we're done
                } else {
                    done = true; // Make sure we say we're done
                    if (exit) exit(); // Call the callback on exit
                }
            },
            iteration: function () {
                return index - 1; // Return the loop number we're on
            },
            break: function (end) {
                done = true; // End the loop
                shouldExit = end; // Passing end as true means we still call the exit callback
            }
        };
        loop.next();
        return loop;
    }
}