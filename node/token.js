const express = require('express');
const request = require('request');
const requestSync = require('sync-request');
const fs = require('fs');
const config = require('./config');

const WECHATURL = config.WECHATURL;
const TOKENADDRESS = config.TOKENADDRESS;
const url = config.url;

module.exports = {
    getToken: getToken
};

function getToken(){

    const tokenText = fs.readFileSync(TOKENADDRESS, 'utf8');
    if(tokenText){
        const tokenJson = JSON.parse(tokenText);
        if(tokenJson.timestamp + tokenJson.expires_in * 1000 <= new Date().getTime()){
            return getTokenToWechat();
        }else{
            return tokenJson.access_token;
        }
    }else{
        return getTokenToWechat();
    }

}

function getTokenToWechat(){

    const res = requestSync('GET', WECHATURL + url.token);
    if(res.statusCode === 200){
        const tokenJson = JSON.parse(res.getBody());
        tokenJson.timestamp = new Date().getTime() - 1000 * 100;
        tokenJson.datetime = config.getDateTime(tokenJson.timestamp);
        fs.writeFileSync(TOKENADDRESS, JSON.stringify(tokenJson));
        return tokenJson.access_token;
    }
    return '';

}
