/**
 * Created by jiajia on 2018/10/6.
 */
let log4js = require('log4js');
log4js.configure({
    appenders: {
        info: {
            type: 'dateFile',
            filename: 'log/info',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            category: 'info',
        },
        error: {
            type: 'dateFile',
            filename: 'log/error',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true,
            category: 'fatal'
        }
    },
    replaceConsole: true,
    categories: {
        default: { appenders: [ 'info' ], level: 'info' },
        task: { appenders: [ 'error' ], level: 'info' }
    },
    levels: {
        info: 'ALL',
        fatal: 'ALL'
    }
});
let logFatal = log4js.getLogger('fatal');
let logInfo = log4js.getLogger('info');

module.exports = {
    info: logInfo,
    error: logFatal
};