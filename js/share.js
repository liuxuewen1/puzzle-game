$({

    // 分享相关代码
    var shareData = {
        title: 'pierre cardin 70th 时光荣耀 拼图赢好礼！',
        description: '三幅皮尔.卡丹女装拼图，拼出2017秋冬最闪耀，赢500元电子代金券！',
        url: 'http://www.nihaoyo.com/',
        imageUrl: 'http://www.nihaoyo.com/img/share.png'
    };
    var shareCommon = {
        title: shareData.title,
        link: shareData.url,
        imgUrl: shareData.imageUrl
    };
    var wx_shareData_friend = shareCommon;
    var wx_shareData_circle = {
        title: shareData.title,
        link: shareData.url,
        imgUrl: shareData.imageUrl,
        desc: shareData.description,
        type: 'link'
    };
    
    var wxShare = function(){
        $.ajax({
            url: 'https://liuxuewensyd.localtunnel.me/serve/jssign?url='+ encodeURIComponent(window.location.href.split('#')[0]),
            type:'get',
            dataType: 'json',
            data:{debug: true},
            async:true,
            success:function(data){
                if(data.errorCode===0){
                    wx.config(data.result);
                    //微信分享注入
                    wx.ready(function(){
                        // 分享给好友
                        wx.onMenuShareTimeline(wx_shareData_friend);
                        // 朋友圈
                        wx.onMenuShareAppMessage(wx_shareData_circle);
                    });
                }
            }
        })
    };
    wxShare();
})