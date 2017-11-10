const config = require('./config');
const text = require('./auto-text');
const news = require('./auto-news');
const kefu = require('./kefu');

module.exports = (json, res) => {
    console.log('[reply-wechat]' + json)
    let params = {
        to: json.FromUserName,
        from: json.ToUserName
    };
    switch(json.MsgType){
        case "text":
            let _content = '';
            //检查是否是请求图文消息
            _content = news[json.Content];
            if(_content){
                // 发送图文消息
                res.send(config.message.getNews(Object.assign(params, {
                    articles: _content
                })));
            }else{
                // 发送普通消息
                _content = text[json.Content] || text['default'];
                res.send(config.message.getText(Object.assign(params, {
                    content: _content,
                    msgid: json.MsgId
                })));
            }
            
            break;
        case "event":
            switch(json.Event){
                case "CLICK":
                    clickByEventKey(res, json, params);
                    break;
                case "subscribe":
                    res.send(config.message.getText(Object.assign(params, {
                        content: text.subscribe,
                        msgid: json.MsgId
                    })));
                    setTimeout(() => {
                        kefu.replyKefu({
                            openid: json.FromUserName,
                            msgtype: 'text',
                            content: '关注成功啦！！哟哟哟'
                        });
                    }, 1000);
                    break;
            }
            break;

    }
}


function clickByEventKey(res, json, params){
    switch(json.EventKey){
        case 'common_problem':
            let _qa = text.qa_index;
            res.send(config.message.getText(Object.assign(params, {
                content: _qa,
                msgid: json.MsgId
            })));
            break;
        case 'wx_bind':
            const login_url = config.bindLogin + json.FromUserName;
            const regist_url = config.bindRegist + json.FromUserName;
            console.log(login_url, regist_url);
            res.send(config.message.getText(Object.assign(params, {
                content: text.bindtext.replace('login_url', login_url).replace('regist_url', regist_url),
                msgid: json.MsgId
            })));
            break;
    }
}