const fs = require('fs');
const request = require('request');
const requestSync = require('sync-request');
const oauth = require('../oauth');
const common = require('./common');

exports.threeParty = (req, res) => {
    const code = req.query.code;
    // const state = req.query.state;
    const userInfo = oauth.getUserInfo(code);

    const oAuthErrorUrl = 'https://weixin.souyidai.com/threeparty/game.html';
    /*if (err) {
      console.trace(err);
      res.redirect(oAuthErrorUrl);
      return;
    }*/
    
    console.log('[oauth threeparty]: state:%s openid:%s ', req.query.state, userInfo.openid);

    // let userUrl = 'http://api.e.souyidai.com/activity/code/wechatuser';
    let userUrl = 'https://weixin.souyidai.com/threeparty/wechatuser';
    let state = req.query.state.split('|'),
        inviteOpenid = state[1] == 'wx'? '' : state[1],
        oAuthUrl = oAuthUrlConfig(state[0], userInfo);

    if(state[1] == 'wx'){
      // 插入已从公众号进入接口
      common.request('https://weixin.souyidai.com/threeparty/clickinfo', {
        openid: userInfo.openid,
        mobile: '',
        type: '2',
        result: '1',
        remark: 'threeparty'
      })
      .then((results) => {
        console.log(`[oauth threeparty] results:${results}`);
        addUser();
      });
    }else{
      addUser();
    }
    
    function addUser(){
      request.get({ 
          url: userUrl + '?userjson='+encodeURIComponent(JSON.stringify(userInfo)),
          encoding: 'utf8',
          gzip: true
      }, (err, response, body) => {
          switch(state[0]){
            case 'threeparty1':
            case 'threeparty2':
                oAuthUrl += userInfo.openid;
                break;
            case 'threeparty3':
                oAuthUrl += userInfo.openid + '&inviteopenid=' + inviteOpenid;
                break;
          }
          try{
              body = JSON.parse(body);
              if(body.errcode){
                  res.redirect(oAuthErrorUrl);
                  return;
              }
              if(response.statusCode === 200  &&  body.errorCode == 0){
                  res.redirect(oAuthUrl);
              }else{
                  res.redirect(oAuthErrorUrl);
              }
          }catch(ex){
              res.send({
                  errorMessage: 'error'
              })
          }
      });
    }
    
}

const oAuthUrlConfig = (state, oAuthInfo) => {
  const t = Math.random();
  const urlList = {
    'account_sub': 'https://weixin.souyidai.com/page/account?type=sub&openid=',
    'account_serve': 'https://weixin.souyidai.com/page/account?type=serve&openid=',
    'account_regist': 'https://weixin.souyidai.com/m/regist?type=serve&openid=',
    'invest': 'https://m.souyidai.com/invest?client=wap&from=wechatmenu&name=invest001',
    'recharge': 'https://m.souyidai.com/account/recharge?client=wap&from=wechatmenu&name=invest005',
    'usercenter': 'https://m.souyidai.com/account',
    'index': 'https://weixin.souyidai.com/m',
    'my_money': 'https://weixin.souyidai.com/m/my_money',
    'my_invest': 'https://weixin.souyidai.com/m/my_invest',
    'safe_center': 'https://weixin.souyidai.com/m/safe_center',
    'regist_result': 'https://weixin.souyidai.com/m/regist_result',
    'shake': 'https://weixin.souyidai.com/event/index_wechat',
    'christmas': 'https://weixin.souyidai.com/christmas',
    'christmas_help': 'https://weixin.souyidai.com/christmas?is_help=1&friend_uid=',
    'invite': 'https://weixin.souyidai.com/m/invite',
    'billion': 'https://weixin.souyidai.com/10billion/#!/invite',
    'billion_help': 'https://weixin.souyidai.com/10billion/#!/invite/help/',
    'billion_guide': 'https://weixin.souyidai.com/10billion/#!/invite/guide?hashid=',
    'light': 'https://weixin.souyidai.com/10billion/app/views/shareMillion.html',
    'euro2016': 'https://events.souyidai.com/static/euro2016/',
    'annual2017': 'https://weixin.souyidai.com/annual2017/?openid=',
    'my_money_new': 'http://m.huli.com/#/myaccount?t=' + t + '&openid=',
    'ninegame': 'https://events.huli.com/static/redpacket/main.html?openid=',
    'hulilogin': 'https://m.huli.com/#/login?t=' + t + '&openid=',
    'huliregist': 'https://m.huli.com/#/home?t=' + t + '&openid=',
    'huliinvite': 'https://m.huli.com/#/invite/ownerReward?t=' + t + '&openid=',
    'hulicompany': 'https://m.huli.com/#/companyIntro?t=' + t,
    'huliinvest': 'https://m.huli.com/#/invest?t=' + t,
    'threeparty1': 'https://weixin.souyidai.com/threeparty/index.html?openid=',
    'threeparty2': 'https://weixin.souyidai.com/threeparty/task.html?openid=',
    'threeparty3': 'https://weixin.souyidai.com/threeparty/task.html?openid='
  };
  if (/account/.test(state)) {
    return urlList[state] + oAuthInfo.openid;
  }
  if (/christmas_help/.test(state)) {
    const friendUid = state.replace('christmas_help_', '');
    return urlList['christmas_help'] + friendUid;
  }
  if (/billion_help/.test(state)) {
    const hashid = state.replace('billion_help_', '');
    return urlList['billion_help'] + hashid;
  }
  if (/billion_guide/.test(state)) {
    const hashid = state.replace('billion_guide_', '');
    return urlList['billion_guide'] + hashid;
  }
  if (/annual2017/.test(state)) {
    return urlList['annual2017'] + oAuthInfo.openid;
  }
  return urlList[state];
};

const oAuthErrorUrlConfig = (state) => {
  const errorUrl = {
    'ninegame': 'https://events.huli.com/static/redpacket/'
  }

  return errorUrl[state];
}
