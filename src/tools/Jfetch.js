/**
 * Created by jiajia on 2018/10/6.
 */

let https = require('https');
let logger = require('../tools/log');

/*
* @method:
*
* @params: {object} {
*
* 不是必须的，根据每个api不同
* url: 访问的url
* appid: 微信的appid
* secret: 微信的secret
* openid: 关注公众号用户的openid
* code: 从微信获取的鉴权code
* wxticket: 从微信获取的ticket
* wxtoken: 从微信获取的token,需要缓存2h
* }
*
* @return {function} generator https的get方法
* */

let Jfetch = {
    httpsget: httpsget(params),
};

function* httpsget(params) {
    let promise = new Promise((resolve, reject) => {
        let req = https.get(params.url, (res) => {
            res.on('data', (data) => {
                let result = JSON.parse(data.toString('utf8'));
                logger.sys.info(`url:${params.url}\r\n data: ${result}`);
                resolve(result);
            });
        });
        req.on('error', (err) => {
            console.log(err, 'errerrerrerrerrerr');
            logger.sys.error(`url:${params.url}\r\n error:${err}`);
            reject(err.message);
        });
    });

    return yield promise.then((data) => {
        return data;
    }).catch((e) => {
        logger.sys.error(e.stack);
        return e;
    });
}

module.exports = Jfetch;