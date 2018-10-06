/**
 * Created by jiajia on 2018/10/6.
 */
"use strict";
const {getSignature, getWXOpenid, getFollow, getAccessToken, getTicket} = require('./base.js');
let logger = require('./tools/log');

function wxInfo(url, appid, secret) {
    let sigurl = decodeURIComponent(url);
    let newAccess = yield getAccessToken(appid, secret);
    logger.info('url:data:', newAccess);
    let wxticket = '';
    if (newAccess) {
        wxticket = yield getTicket(newAccess);
    }
    console.log(wxticket, 'wxticketwxticketwxticketwxticketwxticket');
    let signdata = {};
    if (wxticket) {
        signdata = yield getSignature(wxticket, sigurl);
        console.log(signdata, 'signdatasigndatasigndatasigndatasigndata');
    }
    return signdata;
}

function wxToken(appid, secret) {
    let newAccess = yield getAccessToken(appid, secret);
    logger.info('url:data:', newAccess);
    return newAccess;
}

function isFollow(url, code, appid, secret) {
    let newAccess = yield getAccessToken(appid, secret);
    logger.info('url:data:', newAccess);
    let openid = yield getWXOpenid(code);
    let subscribe = {};
    if (openid && newAccess) {
        subscribe = yield getFollow(newAccess, openid);
    }
    return subscribe;
}


function openId(code) {
    let openid = yield getWXOpenid(code);
    return openid;
}

function userInfo(url, openid, appid, secret) {
    let newAccess = yield getAccessToken(appid, secret);
    logger.info('url:data:', newAccess);
    let subscribe = {};
    if (newAccess) {
        subscribe = yield getFollow(newAccess, openid);
    }
    return subscribe;
}

const wxApi = {
    wxInfo,
    wxToken,
    isFollow,
    openId,
    userInfo
};

module.exports = wxApi;