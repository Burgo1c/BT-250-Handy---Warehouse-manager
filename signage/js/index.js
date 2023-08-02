$(document).ready(() => {
    //SET MESSAGE FLOW SPEED
    $("body").get(0).style.setProperty("--time", `${MSG_SPEED}s`);

    getInfo();
    /**
     * JS TIME LOOP TO READ LINE IN FILE
     */
    info = setInterval(getInfo, SIGNAGE_RELOAD_TIME);
});

// CACHE OBJECTS
$stationNo = $(".station_no");
$date = $(".date");
$productCd = $(".product_cd");
$productNm = $(".product_nm");
$subNm = $(".sub_nm");
$qty = $(".qty");
$nyukoContainer = $("#nyuko_container");
$shukoContainer1 = $("#shuko_container_1");
$shukoContainer2 = $("#shuko_container_2");
$msgContainer1 = $("#msg_container_1");
$msgContainer2 = $("#msg_container_2");
$msg = $(".msg");
$middleContainer = $(".middle_container");

/**
 * CALL COUNT
 * - if 0 delete ENDJ02 FILE
 */
var CALL_CNT = 0;

/**
 * AJAX INFO INTERVAL
 */
var info;

/**
 * MESSAGE BLOCK INTERVAL
 */
var msgInterval;

/**
 * MESSAGE BLOCK RUNNING CHECK
 * - if true message block is displayed
 */
var msgRunning = false;

/**
 * DISPLAY MESSAGE
 */
var msg = "メッセージ表示";

/**
 * AJAX RUNNING BOOLEAN
 */
var AJAX = false;

/**
 * FUNCTION TO GET AND DISPLAY 入庫・出庫データ
 */
function getInfo() {
    if (AJAX) return;
    AJAX = true;
    $.ajax({
        url: `pcService.php?call_cnt=${CALL_CNT}`,
        type: "GET",
        async: true,
        dataType: 'json'
    }).done((data) => {
        CALL_CNT++;
        //END FILE CHECK
        if (data.end != undefined) {
            stopAllInterval();
            return true;
        };

        //STATION NUMBER
        $stationNo.html(data.stno);

        //DATE
        $date.html(data.date);

        //ERROR CHECK
        if (data.error != undefined) {
            msg = data.error;
            if (msgRunning) return true;
            msgRunning = true;
            startMsgInterval();
            return true;
        };

        //NO DATA => SHOW MESSAGE
        if (data.msg != undefined) {
            if (msgRunning) return true;
            msg = data.msg;
            msgRunning = true;
            startMsgInterval();
            return true;
        } else {
            stopMsgInterval();
            msgRunning = false;
        };

        //DISPLAY INFO
        $productCd.html(data.product_code);
        $productNm.html(data.product_name);
        $subNm.html(data.sub_name);
        $qty.html(Number(data.qty).toLocaleString());

        //入庫
        if (Number.parseInt(data.display_type) < 20) {
            if ($nyukoContainer.is(":visible")) return true;

            $shukoContainer1.hide();
            $shukoContainer2.hide();
            $msgContainer1.hide();
            $msgContainer2.hide();
            $middleContainer.hide();

            $("body").removeClass("body_black body_blue body_dark_blue").addClass('body_yellow');
            $nyukoContainer.show();
            return true;
        };

        //出庫
        if (Number.parseInt(data.display_type) >= 20) {
            if (data.unit_type == "1") {
                if ($shukoContainer2.is(":visible")) return true;

                $nyukoContainer.hide();
                $shukoContainer1.hide();
                $msgContainer1.hide();
                $msgContainer2.hide();
                $middleContainer.hide();

                $("body").removeClass("body_black body_yellow body_blue").addClass('body_dark_blue');
                $shukoContainer2.show();
                return true;
            };
            if ($shukoContainer1.is(":visible")) return true;

            $nyukoContainer.hide();
            $shukoContainer2.hide();
            $msgContainer1.hide();
            $msgContainer2.hide();
            $middleContainer.hide();

            $("body").removeClass("body_black body_yellow body_dark_blue").addClass('body_blue');
            $shukoContainer1.show();
            return true;
        };
    }).fail((XMLHttpRequest, textStatus, errorThrown) => {
        console.log(`エラーが発生しました。\n${XMLHttpRequest.responseText}`);
    }).always(() => {
        AJAX = false;
    })
};

function msgBlockDisp() {
    $shukoContainer1.hide();
    $shukoContainer2.hide();
    $nyukoContainer.hide()
    $("body").removeClass("body_yellow body_blue body_dark_blue").addClass('body_black');
    $middleContainer.show();
    if ($msgContainer1.is(":visible")) {
        $msgContainer1.hide();
        $msgContainer2.show();
    } else {
        $msgContainer2.hide();
        $msgContainer1.show();
    };
};

function startMsgInterval() {
    $msg.html(msg);
    msgBlockDisp()
    msgInterval = setInterval(msgBlockDisp, SIGNAGE_MSG_DISP_TIME);
};
function stopMsgInterval() {
    clearInterval(msgInterval);
}

function stopInfo() {
    clearInterval(info);
};

function stopAllInterval() {
    stopInfo();
    stopMsgInterval();
    $("body").removeClass("body_yellow body_blue body_dark_blue").addClass('body_black');
    $(".container, .middle_container").fadeOut();
    return;
}