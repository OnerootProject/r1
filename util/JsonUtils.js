
var Log = require('./LogConsole');

class JsonUtils{
    /*
     * string to json object
     */
    static parse(value) {
        try {
            return JSON.parse(value);
        } catch (e) {
            Log.error(e.message, __filename);
            return null;
        }
    }

    /*
     * string to json object
     * and format: change string numbers to numbers
     */
    static parseFormat(value) {
        let result = JsonUtils.forceNumber(JsonUtils.parse(value));
        // Log.debug(result, __filename);
        return result;
    }

    /*
     * json object to string
     */
    static stringify(value, replacer=null, space=null) {
        try {
            return JSON.stringify(value, replacer, space);
        } catch (e) {
            Log.error(e.message,__filename);
            return '';
        }
    }

    static forceNumber(value) {
        if(value == null || value == undefined) {
            return value;
        }
        for(let k in value) {
            if(typeof(value[k]) == 'object') {
                value[k] = JsonUtils.forceNumber(value[k]);
            } else if(typeof(value[k]) == 'string' && JsonUtils.checkNumber(value[k])) {
                value[k] = Number(value[k]);
            } else if(typeof(value[k]) == 'string' && value[k]!=null && value[k]!=undefined) {
                value[k] = value[k].trim();
            }
        }
        // Log.debug(value, __filename+':forceNumber');
        return value;
    }

    static checkNumber(value) {
        var reg = /^[0-9]+.?[0-9]*$/;
        if (reg.test(value)) {
            return true;
        }
        return false;
    }

    static merge(json1, json2) {
        if(!json1 || json2) {
            return json1;
        }
        for(let k in json2) {
            json1[k] =json2[k];
        }
        return json1;
    }

}

module.exports = JsonUtils
