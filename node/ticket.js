const express = require('express');
const request = require('request');
const requestSync = require('sync-request');
const fs = require('fs');
const config = require('./config');
const token = require('./token');

const WECHATURL = config.WECHATURL;
const TICKETADDRESS = config.TICKETADDRESS;
const url = config.url;

module.exports = {
    getTicket: getTicket
};

function getTicket(){

    const ticketText = fs.readFileSync(TICKETADDRESS, 'utf8');
    if(ticketText){
        const ticketJson = JSON.parse(ticketText);
        if(!ticketJson.ticketJson || ticketJson.timestamp + ticketJson.expires_in * 1000 <= new Date().getTime()){
            return getTicketToWechat();
        }else{
            return ticketJson.ticket;
        }
    }else{
        return getTicketToWechat();
    }

}

function getTicketToWechat(){
    
    const accessToken = token.getToken();
    const res = requestSync('GET', WECHATURL + url.ticket + 'access_token=' + accessToken);
    if(res.statusCode === 200){
        const ticketJson = JSON.parse(res.getBody());
        ticketJson.timestamp = new Date().getTime() - 1000 * 100;
        ticketJson.datetime = config.getDateTime(ticketJson.timestamp);
        fs.writeFileSync(TICKETADDRESS, JSON.stringify(ticketJson));
        return ticketJson.ticket;
    }
    return '';

}
