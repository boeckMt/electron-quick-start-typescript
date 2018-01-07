import * as path from "path";
var Hexo = require('hexo');

export class HexoApi {
    hexo: any;
    constructor(configpath:string) {
        this.hexo = new Hexo(path.dirname(configpath), {  //path.join(__dirname,'../../hexo-theme-test/')
            config: path.basename(configpath), ///path.join(__dirname, '../../hexo-theme-test/_config-de.yml'),
            debug: true,
            silent: false //	Enable silent mode. Don’t display any messages in the terminal.	false
        })
    }

    init(callback:Function){
        return this.hexo.init().then(() => {
            callback(this.hexo)
            return this.hexo;
        }); 
    }
}