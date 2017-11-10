const request = require('request');
const requestSync = require('sync-request');
const config = require('./config');

module.exports = {
    getAuthToken: getAuthToken,
    getUserInfo: getUserInfo
};

function getAuthToken(code) {
    const res = requestSync('GET', `${config.url.oAuth.getToken}?appid=${config.appInfo.appid}&secret=${config.appInfo.appsecret}&code=${code}&grant_type=authorization_code`);
    const body = JSON.parse(res.getBody());
    if(res.statusCode === 200){
        return body;
    }
    return '';
}

function getUserInfo(code) {
    const authInfo = getAuthToken(code);
    const res = requestSync('GET', `${config.url.oAuth.userInfo}?access_token=${authInfo.access_token}&openid=${authInfo.openid}&lang=zh_CN`);
    const body = JSON.parse(res.getBody());
    if(res.statusCode === 200){
        return body;
    }
    return '';
}