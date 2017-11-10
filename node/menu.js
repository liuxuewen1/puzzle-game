const config = require('./config');
const token = require('./token');
const requestSync = require('sync-request');
const url = config.url;

module.exports = {
    setMenu: setMenu
}

function setMenu(req, res){
    const accessToken = token.getToken();
    const resDel = deleteMenu(accessToken);
    const resDel_body = JSON.parse(resDel.getBody());
    if(resDel.statusCode != 200 || resDel_body.errcode != 0){
        res.send({
            errorCode: 1,
            message: '删除菜单失败, error:' + resDel_body.errmsg
        });
        return;
    }
    const resCreate = createMenu(accessToken);
    const resCreate_body = JSON.parse(resCreate.getBody());
    if(resCreate.statusCode != 200 || resCreate_body.errcode != 0){
        res.send({
            errorCode: 1,
            message: `创建菜单失败, errcode:${resCreate_body.errcode}, error:${resCreate_body.errmsg}`
        })
        return;
    }
    res.send({
        errorCode: 0,
        message: '创建菜单成功'
    });
}

function deleteMenu(token){
    const resDel = requestSync('POST', config.WECHATURL + config.url.menu.del + token, {
        headers: {
            "content-type": "application/json",
        },
        json: true
    });
    return resDel;
}
function createMenu(token){
    const reqData = config.wxMenu;
    const resCreate = requestSync('POST', config.WECHATURL + config.url.menu.create + token, {
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(reqData)
    });
    return resCreate;
}