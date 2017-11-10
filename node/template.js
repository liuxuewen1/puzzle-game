const fs = require('fs');
const request = require('request');
const config = require('./config');
const token = require('./token');

module.exports = {
    setIndustry: setIndustryFn,
    getIndustry: getIndustryFn,
    addIndustry: addIndustryFn,
    getAll: getAll,
    sendTemplate: sendTemplate
};

/**
 * 设置行业属性方法（每月可修改行业1次）
 * @author liuxuewen
 * @date   2017-07-31
 */
function setIndustryFn(){
    fs.readFile(config.TOKENADDRESS, (err, data) => {

        if(!err){
            let _token = JSON.parse(data).access_token;
            let reqData = {
                access_token: _token,
                industry_id1: 1,
                industry_id2: 41   
            };
            request.post({ 
                url: config.WECHATURL + config.url.template.setIndustry + _token, 
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: reqData
            }, (err, res, body) => {
                console.log(body);
            })
        }

    });
}
/**
 * 获取当前公众号的行业属性
 * @author liuxuewen
 * @date   2017-07-31
 * @return {[type]}   [description]
 */
function getIndustryFn(){
    fs.readFile(config.TOKENADDRESS, (err, data) => {

        if(!err){
            let _token = JSON.parse(data).access_token;
            let reqData = {
                access_token: _token
            };
            request.post({ 
                url: config.WECHATURL + config.url.template.getIndustry + _token, 
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: reqData
            }, (err, res, body) => {
                console.log(body);
            })
        }

    });
}

/**
 * 增加模版
 * @author liuxuewen
 * @date   2017-08-01
 * @return {[type]}   [description]
 */
function addIndustryFn(){
    const accessToken = token.getToken();
    let reqData = {
        template_id_short: 'Bv2lf05kcBQKFVcRtXT07erREDSROL5-WZWs3bwWDkM'
    };
    request.post({ 
        url: config.WECHATURL + config.url.template.add + accessToken, 
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: reqData
    }, (err, res, body) => {
        console.log(body);
    })
}

/**
 * 获取所有模版信息接口
 * @author liuxuewen
 * @date   2017-08-01
 * @return {[type]}   [description]
 */
function getAll(req, res){

    const accessToken = token.getToken();
    let reqData = {
        access_token: accessToken
    };
    request.post({ 
        url: config.WECHATURL + config.url.template.getAll + accessToken, 
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: reqData
    }, (err, response, body) => {
        if(response.statusCode == 200 && typeof body.template_list == 'object'){
            res.send({
                errorCode: 0,
                data: body.template_list
            })
        }
    })
}

/*sendTemplate({
    openid: 'ovp0KwZP3ESBuT1wwE0CMqCO34o8',
    tempid: '8fm1usQFyfB79EiFuAN0OydlY9unfdlpRCpNqPwestA'
})*/

/**
 * 发送模版
 * @author liuxuewen
 * @date   2017-08-03
 * @param  {[type]}   opts [description]
 * @return {[type]}        [description]
 */
function sendTemplate(req, res, opts){
    const accessToken = token.getToken();
    let reqData = {
       "touser": opts.openid,
       "template_id": opts.tempid,
       "url": "http://m.huli.com",
       "data":{
            "project": {
               "value":"SYD123！",
               "color":"#173177"
            },
            "getmoney":{
               "value":"100,000",
               "color":"#173177"
            },
            "banlce": {
               "value":"39.8元",
               "color":"#173177"
            }
        }
    };
    request.post({ 
        url: config.WECHATURL + config.url.template.send + accessToken, 
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: reqData
    }, (err, response, body) => {
        res.send({
            errorCode: 0,
            message: '发送成功'
        });
    })
}