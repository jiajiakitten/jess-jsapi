/**
 * Created by jiajia on 2018/10/6.
 */

const crypto = require('crypto');
let logger = require('./tools/log');
let Jfetch = require('./tools/Jfetch');

function * getAccessToken(params) {
    let {appid, secret} = params;
    let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`;
    console.log(Jfetch.httpsget, 'Jfetch');
    let accessToken = yield Jfetch.httpsget({
        url
    });
    logger.info('url:accessToken:', accessToken);
    console.log( accessToken, 'accessToken');
    if (accessToken.errcode) return accessToken;
    accessToken = accessToken.access_token;
    return accessToken;
}

function * getTicket(params) {
    let {accessToken} = params;
    let url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
    let wxticket = yield Jfetch.httpsget({
        url
    });
    logger.info('url:wxticket:', accessToken);
    if (wxticket.errcode === 0) {
        return wxticket.ticket;
    } else if (wxticket.errcode === 40001) {
        let newToken = yield getAccessToken();
        return yield * getTicket(newToken);
    } else {
        logger.error('wxticket:', accessToken);
        return '';
    }
}
function * getSignature(params) {
    let {wxticket, url, appid} = params;
    let noncestr = Math.random().toString(36).substr(2, 15);
    let ts = parseInt(new Date().getTime() / 1000) + '';
    let str = 'jsapi_ticket=' + wxticket + '&noncestr=' + noncestr + '&timestamp=' + ts + '&url=' + url;
    let shaObj = crypto.createHash('sha1');
    shaObj.update(str);
    let data = {
        appid: appid,
        timestamp: ts,
        noncestr: noncestr,
        signature: shaObj.digest('hex'),
        url: url
    };
    return data;
}
// 获取网页授权token
function * getWXOpenid(params) {
    let {code, appid, secret} = params;
    let url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${appid}&secret=${secret}&code=${code}&grant_type=authorization_code`;
    let openid = yield Jfetch.httpsget({
        url
    });
    logger.info('url:openid:', openid);
    if (openid.errcode) {
        return '';
    } else {
        return openid.openid;
    }
}
// 获取用户是否关注
function * getFollow(params) {
    let {token, openid} = params;
    let url = `https://api.weixin.qq.com/cgi-bin/user/info?access_token=${token}&openid=${openid}&lang=zh_CN`;
    console.log(url, 'getWXUserinfo');
    let userinfo = yield Jfetch.httpsget({
        url
    });
    logger.info('url:userinfo:', info.api);
    let subinfo = {};
    if (userinfo.errcode && userinfo.errcode === 40001) {
        let newToken = yield getAccessToken();
        return yield * getFollow(newToken, openid);
    } else {
        if (userinfo.subscribe === 1) {
            subinfo = {
                subscribe: userinfo.subscribe,
                openid: userinfo.openid,
                nickname: userinfo.nickname
            };
        } else {
            subinfo = {
                subscribe: userinfo.subscribe,
                openid: userinfo.openid
            };
        }
        console.log('subinfo', subinfo);
        return subinfo;
    }
}

module.exports = {
    getSignature, getTicket, getAccessToken, getWXOpenid, getFollow
};
