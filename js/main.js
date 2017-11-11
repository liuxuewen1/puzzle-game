$(function(){

        var objData = {
            1: {
                otime: 8,
                time: 8
            },
            2: {
                otime: 6,
                time: 6
            },
            3: {
                otime: 5,
                time: 5
            }
        };
        var isAll = false;
        var t = 3;
        var timer = null;
        var level = 1;
        var cur = null;
        $(".level-time").html(objData[level].otime+'S');
        function addClick(){
            $(".box-img a").on('click', function(){
                if(cur){
                    if(cur !== $(this)){
                        var curCls = cur.attr('class');
                        var reg = /\bpos\d\b/;
                        var arrCls = reg.exec(curCls);
                        curCls = arrCls && arrCls[0];

                        var thisCls = $(this).attr('class');
                        var reg2 = /\bpos\d\b/;
                        var arrCls2 = reg2.exec(thisCls);
                        thisCls = arrCls2 && arrCls2[0];

                        cur.removeClass('pos1 pos2 pos3 pos4').addClass(thisCls || "");
                        $(this).removeClass('pos1 pos2 pos3 pos4').addClass(curCls || "");
                    }
                    cur = null;
                    $(".box-img a").removeClass('active');
                    if(checkRight()){
                        /*setTimeout(function(){
                            showSuccPopup();
                        }, 150)*/
                        showSuccPopup();
                    }
                }else{
                    cur = $(this);
                    cur.addClass('active');
                }
            })
        }

        function checkRight(){
            var $arr = $(".box-img a");
            var len = 0;
            for(var i = 0; i < $arr.length; i++){

                if($arr.eq(i).hasClass('pos' + $arr.eq(i).attr('active'))){
                    len++;
                }
            }
            if(len !== 0 && len === $arr.length){
                return true;
            }
            return false;
        }

        showCDDesc();
        setCDown();

        function setCDown(){
            setTimeout(function(){
                t--;
                if(t === 0){
                    $(".desc").css('visibility', 'hidden');
                    randomGame();
                    addClick();
                    timer = setInterval(function(){
                        objData[level].time--;
                        $(".level-time").html(objData[level].time+'S');
                        if(objData[level].time === 0){
                            //倒计时结束
                            clearInterval(timer);
                            showFailPopup();
                            $(".box-img a").off('click');
                        }
                    }, 1000);
                }else{
                    showCDDesc();
                    setCDown();
                }
            }, 1000)
        }

        function showCDDesc(){
            $(".desc").css('visibility', 'visible')
            $("#time").html(t);
        }

        function randomGame(){
            var arr = [1, 2, 3, 4];
            var arr2 = [1, 2, 3, 4].sort(function(a, b){
                return Math.random() - 0.5;
            });
            if(arr[0] == arr2[0] && arr[1] == arr2[1] && arr[2] == arr2[2] && arr[3] == arr2[3]){
                arr2[3] = arr[0];
                arr2[1] = arr[2];
                arr2[0] = arr[3];
                arr2[2] = arr[1]
            }
            var $a = $(".box-img a");
            for(var i = 0; i < $a.length; i++){
                $a.eq(i).removeClass('pos1 pos2 pos3 pos4').addClass('pos' + arr2[i]);
            }
        }
        function getRandom(m, n){
            return parseInt(Math.random() * (n - m + 1)) + m;
        }

        //显示弹窗
        function showPopup(popupCls){
            // $("#popup-mask").show();
            $("." + popupCls).show();
        }
        //hide弹窗
        function hidePopup(popupCls){
            t = 3;
            cur = null;
            clearInterval(timer);
            $(".box-img a").off('click').removeClass('img1 img2 img3').addClass('img'+level);
            // $("#popup-mask").hide();
            $("." + popupCls).hide();
            $(".level-time").html(objData[level].otime+'S');
            showCDDesc();
            setCDown();
            initGame();
            $(".level-title").html('第'+level+'关')
        }
        //fail弹窗
        function showFailPopup(){
            if(level === 1){
                $(".popup-error .lottery").hide();
                $(".popup-error .again").removeClass('right').addClass('center');
            }else{
                $(".popup-error .lottery").show();
                $(".popup-error .again").removeClass('center').addClass('right');
            }
            showPopup('popup-error');
        }
        //succ弹窗
        function showSuccPopup(){
            clearInterval(timer);
            if(level === 3){
                $(".popup-succ .go").hide();
                $(".popup-succ-all").show();
                isAll = true;
            }else{
                isAll = false;
                showPopup('popup-succ');
                $(".popup-succ .popup-btn").show();
            }
        }
        //popup-succ 继续挑战
        $(".popup-succ .go").on('click', function(){
            level++;
            hidePopup('popup-succ');
        })
        //win 继续挑战
        $(".win .center").on('click', function(){
            if($(this).hasClass('go')){
                if(level === 3){
                    level = isAll? 1 : 3;
                }else{
                    level += 1;
                }
            }else{
                if(level === 3){
                    level = isAll? 1 : 3;
                }
            }
            objData[level].time = objData[level].otime;
            hidePopup('win');
            $(".popup-succ-all").hide();
            isAll = false;
        })
        //再玩一次
        $(".popup-error .again").on('click', function(){
            objData[level].time = objData[level].otime;
            hidePopup('popup-error');
        })
        function initGame(){
            var $arr = $(".box-img a");
            $arr.removeClass('img1 img2 img3').addClass('img'+level);
            for(var i = 0; i < $arr.length; i++){
                $arr.eq(i).removeClass('pos1 pos2 pos3 pos4').addClass('pos' + $arr.eq(i).attr('active'));
            }
        }

        //马上抽奖
        $(".lottery").on('click', function(){
            if($(".popup-error").css('display') !== 'none'){
                gameLottery(level-1);
                $(".win .center").removeClass('go').addClass('again');
            }else{
                $(".win .center").removeClass('again').addClass('go');
                
                gameLottery();
            }
        })
        
        function gameLottery(optLevel){
            optLevel = optLevel || level;
            // var lottery = getRandom(1,3);
            var lottery = [0,70,200,500];
            var objMoney = {
                "1": 70,
                "2": 200,
                "3": 500
            }
            if(level === 3){
                $('.win .center').removeClass('go').addClass('again');
            }else{
                $('.win .center').removeClass('again').addClass('go');
            }
            $("#lotteryimg").attr('src', 'img/win'+optLevel+'.jpeg');
            $("#winmoney").html('恭喜您获得<br>'+lottery[optLevel]+'电子代金券一张');
            $(".win").show();
            $(".popup-succ").hide();
            $(".popup-error").hide();
            $(".popup-succ .lottery").hide();
            $(".popup-succ-all").hide();
            // $("#popup-mask").show();
        }


    })