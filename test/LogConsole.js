var configLogLevel = 'debug';
class LogConsole{

    static checkLevle(_level) {
        let level = ['trace','debug','info','warn','error','fatal'];
        let configIndex = 0;
        for(let i=0;i<level.length;i++){
            if(configLogLevel == level[i]) {
                configIndex = i;
                break;
            }
        }

        let levelIndex = 0;
        for(let i=0;i<level.length;i++){
            if(_level == level[i]) {
                levelIndex = i;
                break;
            }
        }

        if(levelIndex >= configIndex) {
            return true;
        }
        return false;
    }

    static output(_level, ...args) {
        if(!LogConsole.checkLevle(_level)) {
            return;
        }
        console.log('['+_level+'] ', args);

    }
    static trace(...args) {
        LogConsole.output('trace',args);
    }
    static debug(...args) {
        LogConsole.output('debug',args);
    }
    static info(...args) {
        LogConsole.output('info',args);
    }
    static warn(...args) {
        LogConsole.output('warn',args);
    }
    static error(...args) {
        LogConsole.output('error',args);
    }
    static fatal(...args) {
        LogConsole.output('fatal',args);
    }

}
module.exports = LogConsole;
