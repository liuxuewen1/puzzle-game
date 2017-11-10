const fs = require('fs');
const express = require('express');
const router = express.Router();
const request = require('request');
const requestSync = require('sync-request');
const config = require('./config');
const menu = require('./menu');
const template = require('./template');
const ticket = require('./ticket');
const kefu = require('./kefu');
const token = require('./token');
const binduser = require('./binduser');
const oauth = require('./oauth');

module.exports = router;

router.get('/setMenu', (req, res) => {
    menu.setMenu(req, res);
});

router.get('/template/getAll', (req, res) => {
    template.getAll(req, res);
});

router.get('/template/send', (req, res) => {
    template.sendTemplate(req, res, {
        openid: req.query.openid,
        tempid: req.query.tempid
    });
});

router.get('/kefu/add', (req, res) => {
    kefu.add(req, res, {
        account: req.query.account,
        nickname: req.query.nickname
    });
});

router.get('/kefu/getAll', (req, res) => {
    kefu.getAll(req, res);
});

// /api/user/getinfo?openid=ovp0KwStLvKZma0YdAnT_3kx2-XU
router.get('/user/getinfo', (req, res) => {
    const accessToken = token.getToken();
    request.get({
        url: config.url.user.info + 'access_token=' + accessToken + '&openid=' + req.query.openid,
        method: 'GET',
        json: true
    }, (err, response, data) => {
        res.send({
            errorCode: 0,
            message: data
        });
    })
})

router.get('/jssdk', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // 微信 JS 接口签名校验工具地址
    // https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=jsapisign
    const _ticket = ticket.getTicket();
    const _timestamp = config.createTimestamp();
    const _nonceStr = config.createNonceStr();
    const _jsApiList = ["checkJsApi","onMenuShareTimeline","onMenuShareAppMessage","closeWindow","chooseImage","previewImage","uploadImage","downloadImage"];
    const _result = {
        errorCode: 0,
        result: {
            debug: true,
            appId: config.appInfo.appid, // 必填，公众号的唯一标识
            timestamp: _timestamp, // 必填，生成签名的时间戳
            nonceStr: _nonceStr, // 必填，生成签名的随机串
            signature: config.createSignature(_nonceStr, _ticket, _timestamp, req.query.url), // 必填，签名，见附录1
            jsApiList: _jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }
    };
    console.log(_result);
    res.send(_result);
})

router.get('/my_money', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // const code = req.query.code;
    // const state = req.query.state;
    // const userInfo = oauth.getUserInfo(code);
    // const openid = userInfo.openid;
    const openid = 'ovp0KwStLvKZma0YdAnT_3kx2-XU';
    const bindUser = binduser.getUser();
    console.log(bindUser, bindUser[openid], 333)
    let resData = {};
    if(bindUser[openid]){
        resData = {"data":{"currentBalanceHuli":"6,851.50","currentBalanceP2P":"4,008,307.09","amount":"52,275.74","redeemingBalanceXjg":"0.00","blockedBalanceP2P":"396,862.00","currentCapital":"4,727,421.59","willGainInterest":1379282,"amountHuli":"7,851.50","amountXjg":"0.00","willGainInterestDesc":"如果所有回款中的项目持有到期，预计会获得的所有利息（包含小金罐待结算的收益）。若发生项目转让、借款人提前还款、借款人逾期、借款人坏账、担保方代偿、担保方清偿或小金罐申请转出等情况，预期收益可能会有所改变。","blockedBalanceHuli":"1,000.00","willGainPrincipalForP2P":"314,401.00","allGainAmountDesc":"包括理财资产的所有已回款收益（项目利息和加息、项目转出时的正负结息、购买转让项目的正负结息）、网贷资产的所有已回款收益（项目利息和加息、逾期罚息、提前还款违约金、项目转出时的正负结息、购买转让项目的正负结息 ）、小金罐的所有已回款收益，以及已起息项目中的红包收益、已到账的返现收益。","amountP2P":"4,719,570.09","willGainPrincipalForHuli":"0.00","blockedBalanceXjg":"0.00","willGainPrincipalForXjg":"0.00","allGainAmount":3848292},"errorCode":0};
        res.send(resData);
    }else{
        // res.redirect('' + openid);
        res.send({errorCode: 1});
    }
})

router.post('/bindwx', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    const result = binduser.setUser(req.body.openid, req.body.uid);
    res.send({
        errorCode: result === 'succ'? 0 : 1
    });
})

router.get('/info', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    let data = oauth.getUserInfo(code);

    res.send({
        errorCode: 111,
        data: data
    });
});

router.get('/info2', (req, res) => {
    const code = req.query.code;
    const state = req.query.state;
    let data = oauth.getUserInfo(code);

    res.redirect('http://196c28f9.ngrok.io/index2.html?openid=' + 'oRwNOt5VGPGlU9oqj2FsA2ha8pe0');
});


// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcd81ae19eafa1201&redirect_uri=http%3A%2F%2Fc9603eef.ngrok.io%2Findex.html&response_type=code&scope=snsapi_base&state=123#wechat_redirect
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcd81ae19eafa1201&redirect_uri=http%3A%2F%2Fc9603eef.ngrok.io%2Fapi%2Finfo&response_type=code&scope=snsapi_userinfo&state=111#wechat_redirect
// 
// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcd81ae19eafa1201&redirect_uri=http%3A%2F%2F196c28f9.ngrok.io%2Fapi%2Finfo&response_type=code&scope=snsapi_base&state=222#wechat_redirect

