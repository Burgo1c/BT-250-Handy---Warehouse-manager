<?php
// configファイル読み込み
include("../common/config.php");

// メッセージ用配列定義
$msg_info = array();
$msg_error = array();

// 品名マスタファイル保存フォルダ
$save_dir = dirname(__FILE__)."/".PRODUCT_FILE_PATH."/";
$file_src = null;
if(isset($_REQUEST["mode"])){
	// 画面から取込の場合は指定したファイルを対象にする。
	if($_REQUEST["mode"]=="execute"){
		$file_src = $_FILES["importFile"];

	// スケジュール取込の場合は所定のフォルダから取得したファイルを対象にする。
	}else if($_REQUEST["mode"]=="schedule"){
		// ネットワーク共有フォルダから所定ファイル名のファイルを一時フォルダにコピーする。
		$cmd = sprintf("net use * /delete /y & net use %s /user:%s %s & robocopy /R:1 /W:10 %s %s %s"
						,PRODUCT_IMPORT_FILE_PATH
						,PRODUCT_IMPORT_USER
						,PRODUCT_IMPORT_PASS
						,PRODUCT_IMPORT_FILE_PATH
						,$save_dir."Temp"
						,PRODUCT_IMPORT_FILE_NAME);
		exec($cmd);

		// コピーしたファイルリストを降順にソートし、先頭のファイルを対象にする。(以外のファイルは削除)
		$serch_path = $save_dir."Temp/".PRODUCT_IMPORT_FILE_NAME;
		$file_list = glob($serch_path);
		rsort($file_list);
		if(count($file_list)>0){
			foreach($file_list as $file_name ){
				if($file_src == null){
					$file_src = array("tmp_name"=>"text/plain","name"=>basename($file_name),"tmp_name"=>$file_name);
				}else{
					unlink($file_name);
				}
			}
		}
	}
	if(!isset($file_src) || $file_src["name"]==""){
		$msg_error[] = "ファイルを選択してください。";
	}else{
		//if(mime_content_type($file_src["tmp_name"])!="text/csv"){
		//	$msg_error[] = "ファイルの形式が不正です。";
		//}else{
			if(($fp = fopen($file_src["tmp_name"], "r")) !== false) {
				while (($row = fgets($fp, 1000)) !== false) {
					if(strlen($row) != 41){
						$msg_error[] = "ファイルにレコード長が不正な行があります。";
						break;
					}
				}
				fclose($fp);
				if(count($msg_error)==0){
					copy($file_src["tmp_name"], $save_dir."Backup/".date("YmdHis")."_".$file_src["name"]);
					$result = rename($file_src["tmp_name"], $save_dir.PRODUCT_FILE_NAME);
					if($result){
						$msg_info[] = "ファイルの取り込みが完了しました。";
					}else{
						$msg_error[] = "ファイルの取り込みに失敗しました。";
					}
				}
			}else{
				$msg_error[] = "アップロードファイルの読み込みに失敗しました。";
			}
		//}
	}
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>サイネージ管理システム</title>
<link rel="icon" type="image/x-icon" href="/img/favicon.ico?v1.2" />
<script src="./js/jquery.min.js?v1.2"></script>
<style type="text/css">
*{
	font-size:15px;
	font-family: "メイリオ";
}
h1{
	font-size:20px;
	font-weight:bold;
	display:inline-block;
	width:99%;
	background:#999;
	color:#fff;
	margin:0;
	margin-bottom:10px;
	padding:5px 0.5%;
}
div#body{
	margin-top:10px;
}
table{
	width:100%;
	border:1px solid #bbb;
	border-collapse:collapse;
}
th{
	font-weight:normal;
	font-size:15px;
	background:#ddd;
	padding:3px 5px;
	width:150px;
}
td{
	font-weight:normal;
	font-size:15px;
	padding:5px 5px;
}
input[type=button]{
	width:150px;
	padding:5px;
	margin-top:10px;
}
div#msg div.info{
	padding:3px 5px;
	background:lightgreen;
}
div#msg div.error{
	padding:3px 5px;
	background:pink;
}
</style>
<script>
$(function(){
	$("input#execute").click(function(){
		if(confirm("品名マスタファイルの取り込みを実行します。よろしいですか？")){
			$(this).closest("form").submit();
		}
	});
});
</script>
</head>
<body>
	<h1>サイネージ用品名マスタファイル取込</h1>
	<div id="msg">
		<?php
		if(count($msg_error)>0){
			foreach($msg_error as $msg){
				echo "<div class='error'>".$msg."</div>";
			}
		}
		if(count($msg_info)>0){
			foreach($msg_info as $msg){
				echo "<div class='info'>".$msg."</div>";
			}
		}
		?>
	</div>
	<div id="body">
		<form method="post" enctype="multipart/form-data">
			<input type="hidden" value="execute" name="mode">
			<table class="">
				<tr>
					<th class="">品名マスタファイル</th>
					<td><input type="file" name="importFile"></td>
				</tr>
			</table>
			<input type="button" value="実　行" id="execute">
		</form>
	</div>
</body>
</html>
