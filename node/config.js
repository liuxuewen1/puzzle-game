const sha1 = require('sha1');

const appConfig = {
    token: 'liuxuewentestwechattoken',
    appid: 'wxcd81ae19eafa1201',
    encodingAESKey: 'encodinAESKey',
    appsecret: '0b468f7cffb00b8ed2fccd145f372837',
    checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};
module.exports = {
    appInfo: appConfig,
    url: {
        token: 'token?grant_type=client_credential&appid='+appConfig.appid+'&secret='+appConfig.appsecret,
        kefu: {
            add: 'https://api.weixin.qq.com/customservice/kfaccount/update?access_token=',
            getAll: 'customservice/getkflist?access_token=',
            reply: 'message/custom/send?access_token='
        },
        user: {
            info: 'https://api.weixin.qq.com/cgi-bin/user/info?lang=zh_CN&'
        },
        menu: {
            create: 'menu/create?access_token=',
            del: 'menu/delete?access_token='
        },
        template: {
            'setIndustry': 'template/api_set_industry?access_token=',
            'getIndustry': 'template/get_industry?access_token=',
            'add': 'template/api_add_template?access_token=',
            'getAll': 'template/get_all_private_template?access_token=',
            'send': 'message/template/send?access_token='
        },
        oAuth: {
            'getToken': 'https://api.weixin.qq.com/sns/oauth2/access_token',
            'userInfo': 'https://api.weixin.qq.com/sns/userinfo'
        },
        ticket: 'ticket/getticket?type=jsapi&'
    },
    WECHATURL: 'https://api.weixin.qq.com/cgi-bin/',
    TOKENADDRESS: __dirname + '/wx-cache/token.txt',
    TICKETADDRESS: __dirname + '/wx-cache/ticket.txt',
    BINDUSERADDRESS: __dirname + '/wx-cache/binduser.txt',
    bindLogin: 'https://m.huli.com/#/login?backurl=myaccount&openid=',
    bindRegist: 'https://m.huli.com/#/register?backurl=myaccount&openid=',
    message: {
        getText: (opts) => {
            return `<xml>
                        <ToUserName><![CDATA[${opts.to}]]></ToUserName>
                        <FromUserName><![CDATA[${opts.from}]]></FromUserName>
                        <CreateTime>${createTime()}</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content><![CDATA[${opts.content}]]></Content>
                        <MsgId>${opts.msgid}</MsgId>
                    </xml>`;
        },
        getCustomerService: (opts) => {
            return `<xml>
                        <ToUserName><![CDATA[${opts.to}]]></ToUserName>
                        <FromUserName><![CDATA[${opts.from}]]></FromUserName>
                        <CreateTime>${createTime()}</CreateTime>
                        <MsgType><![CDATA[transfer_customer_service]]></MsgType>
                    </xml>`;
        },
        getNews: (opts) => {
            let articles = [];
            for(let i = 0; i < opts.articles.length; i++){
                let item = opts.articles[i];
                articles.push(`
                    <item>
                        <Title><![CDATA[${item.title}]]></Title> 
                        <Description><![CDATA[${item.description}]]></Description>
                        <PicUrl><![CDATA[${item.picurl}]]></PicUrl>
                        <Url><![CDATA[${item.url}]]></Url>
                    </item>
                `)
            }
            return `<xml>
                        <ToUserName><![CDATA[${opts.to}]]></ToUserName>
                        <FromUserName><![CDATA[${opts.from}]]></FromUserName>
                        <CreateTime>${createTime()}</CreateTime>
                        <MsgType><![CDATA[news]]></MsgType>
                        <ArticleCount>${articles.length}</ArticleCount>
                        <Articles>
                            ${articles.join('')}
                        </Articles>
                    </xml>`
        },
        getUrl: (opts) => {
            console.log(opts, 44)
            return `<xml>
                        <ToUserName><![CDATA[${opts.to}]]></ToUserName>
                        <FromUserName><![CDATA[${opts.from}]]></FromUserName>
                        <CreateTime>${createTime()}</CreateTime>
                        <MsgType><![CDATA[link]]></MsgType>
                        <Title><![CDATA[${opts.title}]]></Title>
                        <Description><![CDATA[${opts.desc}]]></Description>
                        <Url><![CDATA[${opts.url}]]></Url>
                        <MsgId>${opts.msgid}</MsgId>
                    </xml>`
        }
    },
    wxMenu: {
        "button": [{
            "type": "view",
            "name": "九宫格活动",
            "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcd81ae19eafa1201&redirect_uri=https%3A%2F%2Fliuxuewensyd.localtunnel.me%2Fhuli%2Fninegame&response_type=code&scope=snsapi_userinfo&state=222#wechat_redirect"
        },
        {
            "name": "huli测试", 
            "sub_button": [
                {
                    "type": "view", 
                    "name": "我的资产", 
                    "url": "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcd81ae19eafa1201&redirect_uri=http%3A%2F%2Fcb125871.ngrok.io%2Fapi%2Fmy_money&response_type=code&scope=snsapi_base&state=my_money#wechat_redirect"
                },{
                    "type": "click", 
                    "name": "绑定链接", 
                    "key": "wx_bind"
                }
            ]
        },
        {
            "name": "其他服务", 
            "sub_button": [
                {
                    "type": "click", 
                    "name": "常见问题", 
                    "key": "common_problem"
                }
            ]
        }]
    },
    checkSignature: (req) => {
        const signature = req.query.signature;
        const timestamp = req.query.timestamp;
        const nonce = req.query.nonce;
        const str = [appConfig.token, timestamp, nonce].sort().join('');
        const sha1_str = sha1(str);

        if(sha1_str === signature){
            return true;
        }else {
            return false;
        }
    },
    createNonceStr: () => {
      return Math.random().toString(36).substr(2, 15);
    },
    createTimestamp: () => {
      return parseInt(new Date().getTime() / 1000, 0) + '';
    },
    createSignature: (noncestr, jsapi_ticket, timestamp, url) => {
        console.log(noncestr, jsapi_ticket, timestamp, url)
        const _sortObj = {
            jsapi_ticket,
            noncestr,
            timestamp,
            url
        };
        const str = (() => {
            let _res = [];
            for(var key in _sortObj){
                _res.push(`${key}=${_sortObj[key]}`);
            }
            return _res.join('&');
        })();

        return sha1(str);
    },
    getDateTime: (timestamp) => {
        let oDate = new Date(timestamp);
        return `${oDate.getFullYear()}-${oDate.getMonth()+1}-${oDate.getDate()} ${oDate.getHours()}:${oDate.getMinutes()}:${oDate.getSeconds()}`;
    }
};

function createTime(){
    return parseInt(new Date().getTime()/1000);
}