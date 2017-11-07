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
        var t = 3;
        var timer = null;
        var level = 1;
        var cur = null;
        $(".cdown span").html(objData[level].otime);
        function addClick(){
            $(".box-img a").on('click', function(){
                if(cur){
                    if(cur !== $(this)){
                        var curCls = cur.attr('class');
                        cur.attr('class', $(this).attr('class'));
                        $(this).attr('class', curCls);
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
                if('pos' + $arr.eq(i).attr('active') === $arr.eq(i).attr('class')){
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
                        $(".cdown span").html(objData[level].time);
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
            $(".desc").css('visibility', 'visible').html('您还有'+t+'秒记住原图');
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
                $a.eq(i).attr('class', 'pos' + arr2[i]);
            }
        }
        function getRandom(m, n){
            return parseInt(Math.random() * (n - m + 1)) + m;
        }

        //显示弹窗
        function showPopup(popupCls){
            $("#popup-mask").show();
            $("." + popupCls).show();
        }
        //hide弹窗
        function hidePopup(popupCls){
            t = 3;
            cur = null;
            clearInterval(timer);
            $(".box-img a").off('click');
            $("#popup-mask").hide();
            $("." + popupCls).hide();
            $(".cdown span").html(objData[level].otime);
            showCDDesc();
            setCDown();
            initGame();
            $(".header h2").html('第'+level+'关')
        }
        //fail弹窗
        function showFailPopup(){
            showPopup('popup-error');
        }
        //succ弹窗
        function showSuccPopup(){
            clearInterval(timer);
            if(level === 3){
                $(".go").hide();
                $(".popup-succ .title").html('恭喜！<br>顺利完成所有拼图')
            }
            showPopup('popup-succ');
        }
        //继续挑战
        $(".go").on('click', function(){
            level++;
            hidePopup('popup-succ');
        })
        //再玩一次
        $(".again").on('click', function(){
            objData[level].time = objData[level].otime;
            hidePopup('popup-error');
        })
        //马上抽奖
        $(".lottery").on('click', function(){
            //
        })
        function initGame(){
            var $arr = $(".box-img a");
            for(var i = 0; i < $arr.length; i++){
                $arr.eq(i).attr('class', 'pos' + $arr.eq(i).attr('active'));
            }
        }

    })