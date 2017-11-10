const fs = require('fs');
const config = require('./config');

module.exports = {
    getUser: getUser,
    setUser: setUser
};

function getUser(){
    let user = fs.readFileSync(config.BINDUSERADDRESS, 'utf8');
    try{
        user = JSON.parse(user);
        return user;
    } catch(ex) {
        return {};
    }
}

function setUser(openid, uid){
    console.log(openid, uid);
    let user = getUser();
    user[openid] = uid;
    fs.writeFileSync(config.BINDUSERADDRESS, JSON.stringify(user));
    return 'succ';
}