<?php
include_once("../common/config.php");
header("Access-Control-Allow-Origin: *");
try {
    $stno = "";
    /**
     * CURRENT DATE TIME
     */
    $dt = date("Y/m/d H:i");

    /**
     * CHECK IF IP IS ALLOWED
     */
    switch ($_SERVER['REMOTE_ADDR']) {
        case ST_1311_IP:
            $stno = "1311";
            break;
        case ST_1312_IP:
            $stno = "1312";
            break;
        case ST_1321_IP:
            $stno = "1321";
            break;
        case ST_1322_IP:
            $stno = "1322";
            break;
        case ST_1331_IP:
            $stno = "1331";
            break;
        case ST_2311_IP:
            $stno = "2311";
            break;
        default:
            throw new Exception("許可されているIPアドレスではありません。");
            break;
    };

    /**
     * CHECK IF ENDJ02 FILE EXIST
     */
    $output = null;
    $status = null;
    $cmd = sprintf(
        "net use * /delete /y & net use %s /user:%s %s & type %s",
        FILE_PATH,
        FOLDER_USER,
        FOLDER_PASS,
        FILE_PATH . END_FILE_NAME
    );
    exec($cmd, $output, $status);
    if ($status != 1) {
        //IF FIRST CALL THEN DELETE FILE
        if (isset($_REQUEST["call_cnt"]) && $_REQUEST["call_cnt"] == 0) {
            $cmd = sprintf(
                "net use * /delete /y & net use %s /user:%s %s & del %s",
                FILE_PATH,
                FOLDER_USER,
                FOLDER_PASS,
                FILE_PATH . END_FILE_NAME
            );
            exec($cmd);
        } else {
            //OTHERWISE END PROGRAM
            echo json_encode(array("end" => "true"), JSON_UNESCAPED_UNICODE);
            return;
        };
    };

    //ORACLE CONNECTION
    $dbh = new PDO(DB_CON_STR, DB_USER, DB_PASS);
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    /**
     * FIND CURRENT OPERATION DATA
     * - TYPE
     * - PRODUCT CODE
     * - QTY
     */
    //$dbh->beginTransaction();

    $sql = "SELECT 
                    SIJISYOSAI as unit_type
                    ,SAGYOKBN as display_type
                    ,HINMEI as product_cd
                    ,NYUSYUSU as qty
                    FROM SAGYO_DATA
                    WHERE STNO = :stno
                    AND (
                        (SAGYOKBN in (1,2,5,11,17) AND hjyotaiflg = '1')
                    OR (SAGYOKBN >= 20 AND SAGYOKBN <= 29 AND hjyotaiflg in ('3','5'))
                    )
                    ORDER BY schno,hansokey";

    $param = array();
    $param["stno"] = $stno;

    $sth = $dbh->prepare($sql);
    $sth->execute($param);
    $list = $sth->fetchAll();

    //IF NO DATA RETURN TEXT FILE CONTENTS
    if (count($list) < 1) {
        $cmd = sprintf(
            "net use * /delete /y & net use %s /user:%s %s & type %s > %s",
            FILE_PATH,
            FOLDER_USER,
            FOLDER_PASS,
            FILE_PATH . MSG_FILE_NAME,
            TEMP_PATH . $stno . "_temp_msg.txt"
        );
        exec($cmd);
        $msg = file_get_contents(TEMP_PATH . $stno . '_temp_msg.txt');
        $msg = mb_convert_encoding($msg, "UTF-8", "CP932");
        echo json_encode(array("msg" => $msg, "stno" => $stno, "date" => $dt), JSON_UNESCAPED_UNICODE);
        return;
    };

    /**
     * FIND PRODUCT NAME FROM FILE
     */

    //GET FILE CONTENTS
    // - PUT INTO ARRAY
    $rows = file(PRODUCT_FILE_PATH . PRODUCT_FILE_NAME);

    //LOOP THROUGH FILE ROWS AND SEARCH FOR PRODUCT
    foreach ($rows as $val) {
        // $row = explode("，", $val);
        // if ($row[2] == $list[0]["PRODUCT_CD"]) {
        //     $product_nm = mb_strcut($row[3], 0, 17);
        //     $sub_nm = mb_strcut($row[3], 17);
        //     break;
        // }
        if(mb_strcut($val, 0, 7) == $list[0]["PRODUCT_CD"]){
            $product_nm = mb_strcut($val, 7, 16);
            $sub_nm = mb_strcut($val, 23, 16);
            break;
        };
    };

    //SET & RETURN RESULT ARRAY
    $res = array();
    $res["stno"] = $stno;
    $res["unit_type"] = $list[0]["UNIT_TYPE"];
    $res["display_type"] = $list[0]["DISPLAY_TYPE"];
    $res["qty"] = $list[0]["QTY"];
    $res["product_code"] = $list[0]["PRODUCT_CD"];
    $res["product_name"] = (!isset($product_nm)) ? "" : mb_convert_encoding($product_nm, "UTF-8", "CP932");
    $res["sub_name"] = (!isset($sub_nm)) ? "" : mb_convert_encoding($sub_nm, "UTF-8", "CP932");
    $res["date"] = $dt;

    echo json_encode($res, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    echo json_encode(array("error" => $e->getMessage(), "stno" => $stno, "date" => $dt), JSON_UNESCAPED_UNICODE);
}
