const fs = require('fs');
const join = require('path').join;
var Log = require('./LogConsole');

class FileUtils{
    static findSync(startPath) {
        let result=[];
        function finder(path) {
            let files=fs.readdirSync(path);
            files.forEach((val,index) => {
                let fPath=join(path,val);
                let stats=fs.statSync(fPath);
                if(stats.isDirectory()) finder(fPath);
                if(stats.isFile()) result.push(fPath);
            });

        }
        finder(startPath);
        return result;
    }

    static findDir1Sync(startPath) {
        let result=[];
        function finder(path) {
            let files=fs.readdirSync(path);
            files.forEach((val,index) => {
                let fPath=join(path,val);
                let stats=fs.statSync(fPath);
                if(stats.isDirectory()) result.push(fPath);
            });

        }
        finder(startPath);
        return result;
    }

    static existsSync(filename) {
        return fs.existsSync(filename);
    }

    static mkdirSync(path, mode='0755') {
        try {
            fs.mkdirSync(path,mode, function(err){
                if(err) {
                    Log.error(err, __filename);
                }
            });

            Log.trace('mkdir Success, '+ path);
        } catch (e) {
            Log.error(e, __filename);
        }
    }

    static writeFileSync(filename, content) {
        try {
            fs.writeFileSync(filename,content, {flag:"w"}, function(err){
                if(err) {
                    Log.error(err, __filename);
                }
            });

            Log.trace('Write Success, '+ filename);
        } catch (e) {
            Log.error(e, __filename);
        }
    }

    static appendFileSync(filename, content) {
        try {
            fs.appendFileSync(filename,content, function(err){
                if(err) {
                    Log.error(err, __filename);
                }
            });

            Log.trace('appendFile Success, '+ filename);
        } catch (e) {
            Log.error(e, __filename);
        }
    }


    static readFileSync(filename, encoding='utf-8') {
        if(!FileUtils.existsSync(filename)) {
            return "";
        }
        try {
            return fs.readFileSync(filename, encoding);
        } catch (e) {
            Log.error(e.message, __filename);
            return "";
        }
    }

    static statSync(filename) {
        if(!FileUtils.existsSync(filename)) {
            return null;
        }
        try {
            return fs.statSync(filename);
        } catch (e) {
            Log.error(e.message, __filename);
            return null;
        }
    }

    static unlinkSync(filename) {
        try {
            return fs.unlinkSync(filename);
        } catch (e) {
            Log.error(e.message, __filename);
            return null;
        }
    }

}

module.exports = FileUtils
