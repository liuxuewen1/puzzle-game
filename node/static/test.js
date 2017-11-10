

// 测试config.createSignature方法
const config = require('../config');
let arr = ['noncestr', 'jsapi_ticket', 'timestamp', 'url'];

let noncestr='Wm3WZYTPz0wzccnW'
let jsapi_ticket='sM4AOVdWfPE4DxkXGEs8VMCPGGVi4C3VM0P37wVUCFvkVAy_90u5h9nbSlYy3-Sl-HhTdfl2fzFy1AOcHKP7qg'
let timestamp=1414587457
let url='http://mp.weixin.qq.com?params=value'
console.log(config.createSignature(noncestr, jsapi_ticket, timestamp, url));






