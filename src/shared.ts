/*
export interface MainGlobal extends NodeJS.Global {
  appstore:any;
}
declare var global:MainGlobal;
global.appstore = new Store();
*/

const Store = require('electron-store');
export const APPSTORE = new Store();