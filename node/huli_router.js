const fs = require('fs');
const express = require('express');
const router = express.Router();
const request = require('request');
const requestSync = require('sync-request');
const oauth = require('./oauth');

module.exports = router;

router.get('/ninegame', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    const userInfo = oauth.getUserInfo(code);
    const openid = userInfo.openid;
    console.log(`[api/ninegame] openid, ${openid}, userInfo: ${JSON.stringify(userInfo)}`);
    request.get({ 
        url: 'http://api.e.souyidai.com/activity/code/wechatuser?userjson='+encodeURIComponent(JSON.stringify(userInfo)),
        encoding: 'utf8',
        gzip: true
    }, (err, response, body) => {
        console.log(body, typeof body);
        try{
            body = JSON.parse(body);
            if(body.errcode){
                res.redirect('https://events.huli.com/static/redpacket/main.html');
                return;
            }
            if(response.statusCode === 200  &&  body.errorCode == 0){
                res.redirect('https://events.huli.com/static/redpacket/main.html?openid=' + openid);
            }else{
                res.redirect('https://events.huli.com/static/redpacket/main.html');
                res.send({
                    errorMessage: 'error'
                })
            }
        }catch(ex){
            res.send({
                errorMessage: 'error'
            })
        }
    });
});
