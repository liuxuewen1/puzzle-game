const express = require('express');
const bodyParser = require('body-parser');
const xmlToJson = require('xml2json');
const getRawBody = require('raw-body');
const token = require('./token');
const menu = require('./menu');
const config = require('./config');
const replyWechat = require('./reply-wechat');

var app = express()

const appConfig = config.appInfo;
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    // console.log(req.path, req.method, req.query ,req.body);
    
    if(req.path === '/'){
        // 微信签名校验
        if(!config.checkSignature(req)){
            res.send({
                errorCode: 1,
                message: '校验失败'
            });
            return;
        }
        // 接口配置校验
        if(req.method === 'GET'){
            res.send(req.query.echostr);
            return;
        }
        
        //获取并设置最新token
        token.getToken();
        
        getRawBody(req, {
            length: req.headers['content-length'],
            limit: '1mb',
            encoding: 'utf-8'
        }, function (err, string) {
            let conJson = JSON.parse(xmlToJson.toJson(string));
            replyWechat(conJson.xml, res);
        })

    }else{
        next(); 
    }
    
});

app.use('/api', require('./router'));
app.use('/huli', require('./huli_router'));
app.use(express.static('static'));

app.listen(8081)
