var winston = require('winston'); //파일에 로그만들기
var winstonDaily = require('winston-daily-rotate-file') // 다른파일에 로그 자동으로 만들기
var moment = require('moment');

function timeStampFormat(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

var logger = new (winston.Logger)({
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            filename: './log/server',
            datePattern: '_yyyy-MM-dd.log',
            colorize:false,
            maxsize:50000000,
            maxFiles:1000,
            level:'info',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
            
        }),
        new (winston.transports.Console)({
            name:'debug-console',
            colorize:true,
            level:'debug',
            showLevel:true,
            json:false,
            timestamp:timeStampFormat
        })
    ]
});

logger.debug('디버깅 메시지');
logger.error('에러 메시지');