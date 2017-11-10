const config = require('./config'); 
const token = require('./token'); 
const request = require('request'); 

const WECHATURL = config.WECHATURL;
const TOKENADDRESS = config.TOKENADDRESS;
const url = config.url;

module.exports = {
    add: add,
    getAll: getAll,
    replyKefu: replyKefu
};

/**
 * 增加客服方法
 * @author liuxuewen
 * @date   2017-08-04
 * @param  {[type]}   user [description]
 */
function add(req, res, user){
    const accessToken = token.getToken();
    const reqData = {
         "kf_account" : user.account,
         "nickname" : user.nickname,
         "password" : user.password || 123456,
    };
    request.post({
        url: url.kefu.add + accessToken,
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json'
        },
        body: reqData
    }, (err, response, body) => {
        res.send({
            errorCode: response.statusCode,
            data: body
        })
    })
}

/**
 * 获取所有客服信息
 * @author liuxuewen
 * @date   2017-08-04
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {[type]}   user [description]
 */
function getAll(req, res, user){
    const accessToken = token.getToken();
    request.post({
        url: WECHATURL + url.kefu.getAll + accessToken,
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json'
        }
    }, (err, response, body) => {
        res.send({
            errorCode: response.statusCode,
            data: body
        })
    })
}

// 客服回复消息方法
function replyKefu(user){
    const accessToken = token.getToken();
    var reqData = {
        "touser": user.openid,
        "msgtype": user.msgtype,
        "text":
        {
             "content": user.content
        }
    };
    request.post({ 
        url: WECHATURL + url.kefu.reply + accessToken, 
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: reqData
    }, (err, res, body) => {
        console.log(body);
        if(res.statusCode === 200){

        }
    })
    
}
