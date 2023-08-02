<?php
try {
    if($_REQUEST["Env"]=="Test") {
		include_once("../common/configTest.php");
	}else if($_REQUEST["Env"]=="Prod"){
		include_once("../common/configProd.php");
	}else if($_REQUEST["Env"]=="Dev"){
		include_once("../common/configDev.php");
	}
	
    /**
     * DISPLAY HANDY SCREEN CONTENT
     */
    if (isset($_REQUEST["Type"])) {
        echo @file_get_contents("hhtServiceOnline.tpl");
        return;
    }

    /**
     * FOR HANDY
     * - GET API content using php
     * - IE7 cannot get data from different server
     * - IE7 cannot use CORS
     */

    if (!isset($_REQUEST["d"]) || $_REQUEST["d"] == "") {
        echo "";
        return;
    };

        // 下 UNCOMMENT FOR REAL API 下 ????
    //header('Content-type: text/plain; Charset=Shift_JIS');

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => API_ENDPOINT . $_REQUEST["d"] . "&r=" . date("YmdHis"),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_NONE,
        CURLOPT_CUSTOMREQUEST => (!isset($_REQUEST["method"]) || $_REQUEST["method"] == "") ? "GET" : $_REQUEST["method"],
        CURLOPT_HTTPHEADER => array(
            "Content-type: text/plain;",
        ),
    ));
    
    $response = curl_exec($curl);
    if(strpos($response,"unable to connect")!==false){
	    throw new Exception($response);
    }
    
    $err = curl_error($curl);
    
    if(substr($_REQUEST["d"],4,4)=="H121"){
    	if(trim($response," ")==""){
    		$response = "";
    	}else{
    		$response = mb_strcut($response,0,12,"cp932")."\t".mb_strcut($response,12,10,"cp932");
    	}
    }else if(substr($_REQUEST["d"],4,4)=="H111"){
    	if(trim($response," ")==""){
    		$response = "";
    	}else{
    		$response = mb_strcut($response,0,3,"cp932")."\t".mb_strcut($response,3,12,"cp932")."\t".mb_strcut($response,15,10,"cp932");
    	}
    }
    echo json_encode(array("result"=>strlen($err)==0,"response"=>mb_convert_encoding($response, "UTF-8", "CP932")));

} catch (Exception $e) {
    echo json_encode(array("result"=>false,$e->getMessage()));
}
