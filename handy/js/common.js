env = "";
current = "hhtTop";
scanModeApp = "BCD";
form = $("form." + current);
error_focus = "a";
confirmKeyCode = null;
gblConfirmOk = false;
gblCurrentDateTime = null;
current_focus = null;

var btScanLib_X = document.getElementById("btScanLib");
var btSysLib_X = document.getElementById("btSysLib");
var btFileLib_X = document.getElementById("btFileLib");
var btCommLib_X = document.getElementById("btCommLib");

// 読み込み可能バーコードの設定
var objSetScanProp = new Bt.LibDef.ScanProperty("");
objSetScanProp.prop = Bt.LibDef.BT_SCAN_ENABLE_ALL;
ret = Bt.ScanLib.Setting.btScanSetProperty(Bt.LibDef.BT_SCAN_PROP_ENABLE_SYMBOLS, objSetScanProp);

/** 端末シリアル番号の取得 */
var SERIAL_NO = GetHandySerialNo();

/** 端末名の取得 */
var HANDY_NAME = GetHandyName();

/** オペレーターCD */
var OPERATOR_CODE = "";

/** オペレーター名 */
var OPERATOR_NAME = "";

/** オペレーター種別 */
var OPERATOR_TYPE = "";

// スキャンモードの初期値設定
changeScanMode();

// コード読み込み有効
//var ret = Bt.ScanLib.Control.btScanDisable();
var ret = Bt.ScanLib.Control.btScanEnable();

/** 検品送信ヘッダー **/
var hht003_header = "";

/** 検品送信明細 **/
var hht003_mesai = [];

var iCnt = 0;

$(function () {

	env = location.search.split("&")[1];
	$("input.serialNo").val(SERIAL_NO);
	$("input[type=text]").focus(function () {
		btSetKeyCharacter($(this).data("input"));
	});

	$("select").keydown(function (e) {
		if ($(".processing:visible").length == 0 && _ajax == false) {
			switch (e.keyCode) {
				case 13:
					e.preventDefault();
					index = form.find("select,input[type=text]:not(.readonly),input[type=button]").index(this);
					form.find("select,input[type=text]:not(.readonly),input[type=button]").eq(index + 1).focus();
					break;

				case 38:
					index = form.find("select,input[type=text]:not(.readonly),input[type=button]").index(this);
					$(this).closest("div.screen").scrollTop(0);
					break;

				default:
					break;
			}
		} else {
			e.preventDefault();
		}
	});

	$("input[type=text]").keydown(function (e) {
		if ($("div.processing:visible").length == 0 && _ajax == false) {
			switch (e.keyCode) {
				case 13:
				case 40:
					e.preventDefault();
					index = form.find("select,input[type=text]:not(.readonly),input[type=button]").index(this);
					form.find("select,input[type=text]:not(.readonly),input[type=button]").eq(index + 1).focus();
					break;

				case 38:
					e.preventDefault();
					index = form.find("select,input[type=text]:not(.readonly),input[type=button]").index(this);
					form.find("select,input[type=text]:not(.readonly),input[type=button]").eq(index - 1).focus();
					break;

				default:
					break;
			}
		} else {
			e.preventDefault();
		}
	});

	$("input[type=button]").keydown(function (e) {
		if ($("div.processing:visible").length == 0 && _ajax == false) {
			switch (e.keyCode) {
				case 13:
					e.preventDefault();
					$(this).click();
				case 40:
					index = form.find("select,input[type=text]:not(.readonly),input[type=button]").index(this);
					form.find("select,input[type=text]:not(.readonly),input[type=button]").eq(index + 1).focus();
					break;

				case 38:
					index = form.find("select,input[type=text]:not(.readonly),input[type=button]").index(this);
					form.find("select,input[type=text]:not(.readonly),input[type=button]").eq(index - 1).focus();
					break;

				default:
					break;
			}
		} else {
			e.preventDefault();
		}
	});
});

_ajax = false;
/**
 * AJAX METHOD
 * - Send XMLHttpRequest
 * @param {String} _url The url path
 * @param {String} _method GET or POST
 * @param {boolean} _async Use asynchronous TRUE or FALSE
 * @param {*} _param The body data being sent
 * @param {*} _callback The function to execute on success
 */
function ajax(_url, _method, _async, _param, _callback) {
	_ajax = true;
	$.ajax({
		type: _method,
		url: _url + "&" + env + "&r=" + Math.random(),
		dataType: 'json',
		data: _param,
		async: _async,
		timeout: 15000,
		success: function (data) {
			if(!data.result){
				displayAlert("<div>・予期しないエラーが発生しました。<br>エラー：" + data.response + "</div>");
				$(".processing").hide();
				_ajax = false;
				return;
			}
			_callback(data.response);
			_ajax = false;
		},
		error: function (xhr, textStatus, errorThrown) {
			displayAlert("<div>・通信エラーが発生しました。ネットワーク接続状況を確認してください。<br>エラーコード：" + xhr.status + "</div>");
			$(".processing").hide();
			_ajax = false;
			return;
		}
	});

}



function displayAlert(message, title, focus) {
	if (title === undefined) {
		title = "エラー";
	}
	if (focus === undefined) {
		focus = null;
	}
	$("div.processing").hide();
	$("div.alert h1").html(title);
	$("div.alert div.message").html(message);
	$("div.alert").show();
	$("div.alert").focus();
	error_focus = focus == null ? null : focus;
	if (title == "エラー") {
		btVibrator();
		btBuzzerError();
	}
}

function displayConfirm(message) {
	$("div.processing").hide();
	$("div.confirm div.message").html(message);
	$("div.confirm").show();
	$("div.confirm").focus();
}

function changeScreen(code) {

	if (OPERATOR_TYPE == 1) {
		if (code == "hhtMenu") {
			code = "hhtTop";
		};
		if (code == "hht002_1") {
			$("form.hht002_1 .type-chk").hide();
			$("form.hht002_1 input.station").val(6);
			$("form.hht002_1 input.station").addClass("notclear");
		};
	}else{
		if (code == "hht002_1") {
			$("form.hht002_1 .type-chk").show();
			$("form.hht002_1 input.station").removeClass("notclear");
		};
	}

	$("div.processing").hide();
	$(".screen").hide();
	current = code;
	form = $("form." + current);
	$("." + current).show();
	form.find("select,input[type=text],input[type=button]").eq(0).focus();
}

function clearScreen(){
	form.find("select:not(.notclear),input[type=text]:not(.notclear)").val("");
	form.find("span.label-value-narrow:not(.notclear),span.label-value-narrow2:not(.notclear),span.label-value:not(.notclear)").html("");
	form.find("span.label").html("");
}

/********************************************************************************
 * 機能 ：端末の各種パラメーターを取得します。

 * API  ：btGetHandyParameter
 ********************************************************************************/

function GetHandySerialNo() {
	try {
		var idSet;
		var ret;

		// シリアル番号取得
		idSet = Bt.LibDef.BT_SYS_PRM_SERIALNO;
		var objSerialNo = new Bt.LibDef.SysHandyParam("")
		ret = Bt.SysLib.Terminal.btGetHandyParameter(idSet, objSerialNo);
		return objSerialNo.value;
	}
	catch (e) {
		displayAlert("<div>・端末情報取得時に予期しないエラーが発生しました。<br><br>" + e.message + "</div>");
	}

	return;
}

/********************************************************************************
 * 機能 ：端末の各種パラメーターを取得します。

 * API  ：btGetHandyParameter
 ********************************************************************************/

function GetHandyName() {
	try {
		var idSet;
		var ret;

		// 端末名取得
		idSet = Bt.LibDef.BT_SYS_PRM_HTNAME;
		var objSerialNo = new Bt.LibDef.SysHandyParam("")
		ret = Bt.SysLib.Terminal.btGetHandyParameter(idSet, objSerialNo);
		return objSerialNo.value;
	}
	catch (e) {
		displayAlert("<div>・端末情報取得時に予期しないエラーが発生しました。<br><br>" + e.message + "</div>");
	}

	return;
}

/********************************************************************************
 * 機能 ：スキャンイベントを処理します。

 * API  ：未使用
 ********************************************************************************/
function ScanEventReceive(wParam) {
	try {

		// スキャン状態を検査
		if (wParam == Bt.LibDef.WP_SCN_SUCCESS) {
			if ($("div.processing:visible").length > 0 || _ajax == true) {
				return;
			}
			current_focus = $("input[type=text]:focus");
			$("div.processing").show();
			$("div.processing").focus();
			ScanDataKobetu();
		}
	} catch (e) {
		displayAlert("<div>・スキャン時に予期しないエラーが発生しました。<br><br>" + e.message + "</div>");
	}
	return;
}

/********************************************************************************
 * 機能 ：読み取りコードを個別に取得します。

 * API  ：btScanGetResultCount, btScanGetDataSize, btScanGetData, btScanGetOCRData
 ********************************************************************************/
function ScanDataKobetu() {
	try {
		var resultCount = Bt.ScanLib.Control.btScanGetResultCount();

		barcodeString = new Array(resultCount);
		ocrFlg = false;

		// コード読み取りされた場合
		for (var count = 0; count < resultCount; count++) {
			var codeLen = Bt.ScanLib.Control.btScanGetDataSize(count);
			var objCodeData = new Bt.LibDef.ScanDataCodeData("");
			var objReportGet = new Bt.LibDef.BT_SCAN_REPORT("");
			var objQrReportGet = new Bt.LibDef.BT_SCAN_QR_REPORT("");
			var ret = Bt.ScanLib.Control.btScanGetData(0, objCodeData, objReportGet, objQrReportGet);
			if (objReportGet.codetype == Bt.LibDef.BT_SCAN_CODE_OCR) {
				ocrFlg = true;
				var objOcr = new Bt.LibDef.BT_SCAN_OCR_REPORT("");
				Bt.ScanLib.Control.btScanGetOCRData(objOcr);
				barcodeString[count] = objOcr.SourceData;
			} else {
			 	barcodeString[count] = objCodeData.codedata;
			}
		}
		if (ocrFlg) {
		 	form.find("input[type=text]:focus").val(barcodeString[0]);
		} else {
			barcodeValue = barcodeString.join("");
			//if (current == "hhtTop") {
				//$("div.processing").hide();
				//$("div.alert").hide();
				// $("input.user_id").val(barcodeValue);
				// evt = $.Event("keyup");
				// evt.keyCode = 13;
				// $(document).trigger(evt);

			if (current == "hht001_1") {
				if (barcodeValue.split(",").length != 10 || barcodeValue.search(/[^0-9\,]/)>=0 || barcodeValue.split(",")[0]!="10") {
					displayAlert("<div>・受渡票ＱＲコードをスキャンしてください。</div>");
					return;
				}

				var scanData = barcodeValue.split(",");
				var url = API_ENDPOINT + API_GET + HANDY_NAME + "H121" + scanData[1];
				ajax(url, "GET", true, "", function (data) {
					if (data == "" || data.length == 0) {
						displayAlert("<div>・受渡票ＱＲコードの商品コードはマスタに存在しません。</div>");
						return;
					};

					data = data.split("\t");
					var product_name = data[0].replace(/\s+$/, "");
					product_name += product_name=="" ? "　" : "";
					var sub_name = data[1].replace(/\s+$/, "");
					sub_name += sub_name=="" ? "　" : "";

					form.find("span.product_code").html(scanData[1]);
					form.find("span.product_name").html(product_name.replace(" ", ""));
					form.find("span.sub_name").html(sub_name.replace(" ", ""));
					form.find("input.qr").val(barcodeValue);

					$("div.processing").hide();
					$("div.alert").hide();
					form.find("select,input[type=text],input[type=button]").eq(0).focus();
				});
				
			} else if (current == "hht002_1") {
				if (barcodeValue.split(",").length != 10 || barcodeValue.search(/[^0-9\,]/)>=0 || barcodeValue.split(",")[0]!="10") {
					displayAlert("<div>・受渡票ＱＲコードをスキャンしてください。</div>");
					return;
				};

				var scanData = barcodeValue.split(",");
				var url = API_ENDPOINT + API_GET + HANDY_NAME + "H121" + scanData[1];
				ajax(url, "GET", true, "", function (data) {
					if (data == "" || data.length == 0) {
						displayAlert("<div>・受渡票ＱＲコードの商品コードはマスタに存在しません。</div>");
						return;
					};

					data = data.split("\t");
					var product_name = data[0].replace(/\s+$/, "");
					product_name += product_name=="" ? "　" : "";
					var sub_name = data[1].replace(/\s+$/, "");
					sub_name += sub_name=="" ? "　" : "";

					var iru_su = scanData[4] - 0;
					if (iru_su == 0 || iru_su == null) {
						iru_su = 1;
					}

//					var qty = Number(scanData[3]) % iru_su;
//					if (qty != 0) {
//						qty = "";
//					} else {
//						qty = Number(scanData[3]);
//					};

					form.find("span.product_code").html(scanData[1]);
					form.find("span.product_name").html(product_name.replace(/\s+$/, ""));
					form.find("span.sub_name").html(sub_name.replace(/\s+$/, ""))
//					form.find("input.quantity").val((scanData[3] - 0) / (scanData[4] - 0));
					form.find("input.quantity").val((scanData[8] - 0) / (scanData[4] - 0));
					form.find("input.qr").val(barcodeValue);
					form.find("input.iru_su").val(iru_su);
					form.find("input.station").focus();

					$("div.processing").hide();
					$("div.alert").hide();
				});

			} else if (current == "hht003_1") {
				if (barcodeValue.search(/^[0-9]{7}[0-9A-Z][0-9]{18}\.[0-9]{21}QREND$/)<0) {
					displayAlert("<div>・ピッキングリストＱＲコードをスキャンしてください。</div>");
					return;
				};

				var scanData = splitPickQr(barcodeValue);

				var url = API_ENDPOINT + API_GET + HANDY_NAME + "H011" + scanData[0] + scanData[1] + scanData[5];

				ajax(url, "GET", true, "", function (data) {
//data="OK000001あいうえおかきくけこ       ";
					data = data.replace(/\s+$/, "");
					var status = (data + "  ").substr(0, 2);
					if (data == "91") {
						displayAlert("<div>・出庫完了済みです。</div>");
						return;
					}else if (data == "" || data.length == 0 || status != "OK") {
						displayAlert("<div>・検品状況が取得できませんでした。</div>");
						return;
					};

					var complete_qty = data.substr(2, 6) - 0;
					var product_name = data.substr(8, 16);

					var qty = scanData[3] - 0;
					var remain_qty = qty - complete_qty;

					if (remain_qty == 0) {
						displayAlert("<div>・該当のピッキングリストは検品完了しています。</div>");
						changeScreen("hht003_1");
						return;
					}

					iCnt = 0;
					hht003_mesai = [];

					form.find("span.product_code").html(scanData[2]);
					form.find("span.product_name").html(product_name);
					form.find("span.kenpin_quantity").html(addComma(remain_qty));
					form.find("span.total_quantity").html(addComma(qty));
					form.find("input.qr").val(barcodeValue);
					form.find("input.complete_qty").val(complete_qty);

					hht003_header = HANDY_NAME + "H013" + OPERATOR_CODE + scanData[0] + scanData[1] + scanData[5];

					$("div.processing").hide();
					$("div.alert").hide();
				});

			} else if (current == "hht003_2") {
				if ((barcodeValue.split(",").length != 10 || barcodeValue.search(/[^0-9\,]/)>=0 || barcodeValue.split(",")[0]!="10") && barcodeValue.search(/^STN-[0-9]{4}$/)<0) {
					displayAlert("<div>・受渡票ＱＲコード、もしくはステーションバーコードをスキャンしてください。</div>");
					return;
				}
				if (barcodeValue.search(/^STN-[0-9]{4}$/)>=0) {
					form.find("input.station").val(barcodeValue.replace("STN-",""));
					form.find("input.product_cd").focus();
				}else{
					var scanData = barcodeValue.split(",");
					form.find("input.product_cd").val(scanData[1]);
					form.find("input[name=lot_no]").val(scanData[2]);
				}

				$("div.processing").hide();
				$("div.alert").hide();
				
			} else if (current == "hht004_1") {
				if (barcodeValue.search(/^A[0-9]{7}[0-9A-Z][0-9]{8}$/)<0) {
					displayAlert("<div>・出荷検品用バーコードをスキャンしてください。</div>");
					return;
				};
				var scanData = splitKenpinBarcode(barcodeValue);

				var url = API_ENDPOINT + API_GET + HANDY_NAME + "H015" + OPERATOR_CODE + scanData[1] + scanData[2] + scanData[3];
				ajax(url, "GET", true, "", function (data) {
					if (data == "" || data != "OK") {
						displayAlert("<div>・出庫完了処理ができませんでした。</div>");
						return;
					};
					btBuzzer();

					$("div.processing").hide();
					$("div.alert").hide();
				});
				
			} else if (current == "hht005_1") {
				if (barcodeValue.search(/^B[0-9]{7}[0-9]{4}$/)<0 && barcodeValue.search(/^A[0-9]{13}$/)<0) {
					displayAlert("<div>・荷合せ用バーコードをスキャンしてください。</div>");
					return;
				};
				var scanData = splitKenpinBarcode(barcodeValue);

				var url = API_ENDPOINT + API_GET + HANDY_NAME + "H081" + scanData[1];
				ajax(url, "GET", true, "", function (data) {
					if (data == "OK") {
						btBuzzer();
						$("div.processing").hide();
						$("div.alert").hide();
						return;
					};
					var msg = "";
					switch (data) {
						case "91":
							msg = "荷合せデータ未作成！！";
							break;
						case "92":
							msg = "荷合せ積込検品済！！";
							break;
						case "93":
							msg = "出庫チェックデータなし！！";
							break;
						case "94":
							msg = "同一現場にて出庫検品未完了あり！！";
							break;
						case "NG":
						default:
							msg = "サーバーでエラーが発生しました。";
							break;
					}
					displayAlert("<div>・" + msg + "</div>");
				});
				
			} else if (current == "hht006_1" || current == "hht007_1") {
				if (barcodeValue.split(",").length != 10 || barcodeValue.search(/[^0-9\,]/)>=0 || barcodeValue.split(",")[0]!="10") {
					displayAlert("<div>・受渡票ＱＲコードをスキャンしてください。</div>");
					return;
				};

				var scanData = barcodeValue.split(",");

				var url = API_ENDPOINT + API_GET + HANDY_NAME + "H111" + ("0000000" + scanData[1]).slice(-7) + ("000000000" + scanData[5]).slice(-9) + ("0" + scanData[6]).slice(-1) + ("00" + scanData[7]).slice(-2);

				ajax(url, "GET", true, "", function (data) {
					if (data == "" || data.length < 20) {
						displayAlert("<div>・受渡票ＱＲコードの商品コードはマスタに存在しません。</div>");
						return;
					};

					data = data.split("\t");
					var area = data[0];
					var product_name = data[1].replace(/\s+$/, "");
					product_name += product_name=="" ? "　" : "";
					var sub_name = data[2].replace(/\s+$/, "");
					sub_name += sub_name=="" ? "　" : "";

					// 取得したエリアの存在チェック
					url = API_ENDPOINT + API_GET + HANDY_NAME + "H112" + ("000" + area).slice(-3);
					ajax(url, "GET", true, "", function (data) {
						data = data.replace(/\s+$/, "");
						if (data == "" || data.length == 0) {
							displayAlert("<div>・該当の移動元エリアはマスタに存在しません。</div>","エラー",form.find("input.location_before"));
							return;
						}
						form.find("input[name=location_before]").val(form.find("input.location_before").val());

						form.find("span.product_code").html(scanData[1]);
						form.find("span.product_name").html(product_name.replace(" ", ""));
						form.find("span.sub_name").html(sub_name.replace(" ", ""))
						form.find("input.quantity").val(scanData[8]);
						form.find("input.location_before").val(area)
						form.find("input.qr").val(barcodeValue);

						if (current == "hht007_1") {
							form.find("input.location_after").val("102");
						}

						$("div.processing").hide();
						$("div.alert").hide();
						form.find("select,input[type=text],input[type=button]").eq(0).focus();
					});
				});

			} else if (current == "hht008_1") {
				if (barcodeValue.search(/^B[0-9]{7}[0-9]{4}$/)<0 && barcodeValue.search(/^A[0-9]{13}$/)<0) {
					displayAlert("<div>・荷合せ用バーコードをスキャンしてください。</div>");
					return;
				};

				var scanData = splitKenpinBarcode(barcodeValue);
        
				form.find("span.arrangement_no").html(scanData[1]);
				form.find("input[name=arrangement_no]").val(scanData[1]);

				$("div.processing").hide();
				$("div.alert").hide();
				form.find("select,input[type=text]:visible,input[type=button]").eq(0).focus();

			}else {
				displayAlert("<div>・本画面でのスキャンは無効です。</div>");
				btBuzzerError();
				return;
				$("div.processing").hide();
				current_focus.focus();
				form.find("input[type=text]:focus").val(barcodeValue);
				if (form.find("input[type=text]:focus").length > 0) {
					if (form.find("input[type=text]:focus").data("getname") == true) {
						form.find("input[type=text]:focus").change();
					}
					index = form.find("input[type=text]").index(form.find("input[type=text]:focus"));
					form.find("input[type=text]").eq(index + 1).focus();
				}
			}
		}
	} catch (e) {
		$("div.processing").hide();
		displayAlert("<div>・スキャン時に予期しないエラーが発生しました。<br><br>" + e.message + "</div>");
	}

	return;
}

/********************************************************************************
 * 機能 ：ブザーの動作および停止を制御します。

 * API  ：btBuzzer
 ********************************************************************************/

function btBuzzer() {
	try {
		var on = Bt.LibDef.BT_ON;
		var objBuzzer = new Bt.LibDef.BT_BUZZER_PARAM("");

		// 「500msオン、500msオフ」を3回繰り返す設定
		objBuzzer.on = 50;     // 鳴動時間[ms] （1～5000）
		objBuzzer.off = 50;    // 停止時間[ms] （0～5000）
		objBuzzer.count = 3;    // 鳴動回数[回] （0～100）
		objBuzzer.tone = 16;    // 音階 (1（低）～16（高）)
		objBuzzer.volume = 3;   // ブザー音量 (1（小）～3（大）)

		// btBuzzer 鳴動
		var ret = Bt.SysLib.Device.btBuzzer(on, objBuzzer);
	}
	catch (e) {
		displayAlert("error:" + e);
	}

	return;
}

function btBuzzerError() {
	try {
		var on = Bt.LibDef.BT_ON;
		var objBuzzer = new Bt.LibDef.BT_BUZZER_PARAM("");

		// 「500msオン、500msオフ」を3回繰り返す設定
		objBuzzer.on = 100;     // 鳴動時間[ms] （1～5000）
		objBuzzer.off = 100;    // 停止時間[ms] （0～5000）
		objBuzzer.count = 2;    // 鳴動回数[回] （0～100）
		objBuzzer.tone = 1;    // 音階 (1（低）～16（高）)
		objBuzzer.volume = 3;   // ブザー音量 (1（小）～3（大）)

		// btBuzzer 鳴動
		var ret = Bt.SysLib.Device.btBuzzer(on, objBuzzer);
	}
	catch (e) {
		displayAlert("error:" + e);
	}

	return;
}

/********************************************************************************
 * 機能 ：バイブレーターの動作および停止を制御します。

 * API  ：btVibrator
 ********************************************************************************/

function btVibrator() {
	try {
		var on = Bt.LibDef.BT_ON;
		var objVibrator = new Bt.LibDef.BT_VIBRATOR_PARAM("");

		// 「500msオン、500msオフ」を3回繰り返す設定
		objVibrator.on = 300;   // 鳴動時間[ms] （1～5000）
		//		objVibrator.off = 500;  // 停止時間[ms] （0～5000）
		objVibrator.count = 1;  // 鳴動回数[回] （0～100）

		// btVibrator 鳴動catch
		var ret = Bt.SysLib.Device.btVibrator(on, objVibrator);
	}
	catch (e) {
		displayAlert("error:" + e);
	}

	return;
}


/********************************************************************************
 * 機能 ：キー入力モードを設定／取得します。

 * API  ：btSetKeyCharacter, btGetKeyCharacter
 ********************************************************************************/

function btSetKeyCharacter(setMode) {
	try {
		// 設定
		ret = Bt.SysLib.Display.btSetKeyCharacter(setMode);
	}
	catch (e) {
		displayAlert("error:" + e.message);
	}

	return;
}

function setScanMode(mode) {
	var objSetOcrScanProp = new Bt.LibDef.ScanProperty("");
	if (mode == "BCD") {
		objSetOcrScanProp.prop = Bt.LibDef.BT_SCAN_OCR_DISABLE;
	} else {
		objSetOcrScanProp.prop = Bt.LibDef.BT_SCAN_OCR_ENABLE_ONLY;
	}
	ret = Bt.ScanLib.Setting.btScanSetProperty(Bt.LibDef.BT_SCAN_PROP_OCR_ENABLE_COMBI, objSetOcrScanProp);
}


function changeScanMode() {
	setScanMode(scanModeApp);
	if (scanModeApp == "BCD") {
		scanModeApp = "OCR";
	} else {
		scanModeApp = "BCD";
	}
	$(".btn-f3").html("F3:" + scanModeApp);
}

function clear(target) {
	form.find(target).val("");
	form.find(target).eq(0).focus();
}

function isValid() {
	error_focus = null;
	msg = [];
	form.find("input[type=text],select").each(function () {
		msg = isRequire(msg, $(this));
		msg = isDateFormat(msg, $(this));
		msg = isAlphaNumeric(msg, $(this));
		msg = isNumeric(msg, $(this));
		msg = isNumeric61(msg, $(this));
		msg = isNumeric132(msg, $(this));
		msg = isNumericMoreThanZero(msg, $(this));
	});
	if (msg.length > 0) displayAlert("<div>・" + msg.join("</div><div>・") + "</div>", "エラー", error_focus);
	return (msg.length > 0);
}

function isRequire(msg, target) {
	if (target.data("require") == true) {
		if (target.val() == null || target.val() == "") {
			msg.push("「" + target.prev("h2").html() + "」は必ず入力してください。");
			error_focus = error_focus == null ? target : error_focus;
		}
	}
	return msg;
}

function isAlphaNumeric(msg, target) {
	if (target.data("format") == "alphaNumeric") {
		if (target.val() != "" && target.val() != null && !target.val().match(/^[A-Za-z0-9]*$/)) {
			msg.push("「" + target.prev("h2").html() + "」は半角英数で入力してください。");
			error_focus = error_focus == null ? target : error_focus;
		}
	}
	return msg;
}

function isNumericMoreThanZero(msg, target) {
	if (target.data("format") == "numericMoreThanZero") {
		if (target.val() != "" && target.val() != null && (!target.val().match(/^[0-9]*$/) || target.val().match(/^[0]*$/))) {
			msg.push("「" + target.prev("h2").html() + "」は１以上の数値で入力してください。");
			error_focus = error_focus == null ? target : error_focus;
		}
	}
	return msg;
}

function isNumeric(msg, target) {
	if (target.data("format") == "numeric") {
		if (target.val() != "" && target.val() != null && !target.val().match(/^[0-9]*$/)) {
			msg.push("「" + target.prev("h2").html() + "」は半角数字で入力してください。");
			error_focus = error_focus == null ? target : error_focus;
		}
	}
	return msg;
}

function isNumeric61(msg, target) {
	if (target.data("format") == "numeric61") {
		if (target.val() != "" && target.val() != null && !target.val().match(/^([0-9]{0,6}|0)(\.[0-9]{1})?$/)) {
			msg.push("「" + target.prev("h2").html() + "」は整数部6桁以内、小数部1桁以内の数値を入力してください。");
			error_focus = error_focus == null ? target : error_focus;
		}
	}
	return msg;
}

function isNumeric132(msg, target) {
	if (target.data("format") == "numeric132") {
		if (target.val() != "" && target.val() != null && !target.val().match(/^([0-9]{0,13}|0)(\.[0-9]{1,2})?$/)) {
			msg.push("「" + target.prev("h2").html() + "」は整数部13桁以内、小数部2桁以内の数値を入力してください。");
			error_focus = error_focus == null ? target : error_focus;
		}
	}
	return msg;
}

function isDateFormat(msg, target) {
	if (target.data("format") == "date") {
		if (target.val() != "" && target.val() != null) {
			if (!target.val().match(/^[0-9]{8}$/)) {
				msg.push("「" + target.prev("h2").html() + "」はyyyyMMdd形式で入力してください。");
				error_focus = error_focus == null ? target : error_focus;
			} else {
				var y = target.val().substr(0, 4);
				var m = target.val().substr(4, 2) - 1;
				var d = target.val().substr(6, 2) == "00" ? "01" : target.val().substr(6, 2);
				var date = new Date(y, m, d);
				if (date.getFullYear() != y || date.getMonth() != m || date.getDate() != d) {
					msg.push("「" + target.prev("h2").html() + "」はyyyyMMdd形式で入力してください。");
					error_focus = error_focus == null ? target : error_focus;
				}
			}
		}
	}
	return msg;
}

function getDateString(val, _y, _m, _d) {
	if (val != "" && val != null) {
		val = val.replace(/\//g, '').replace(/\-/g, '');
		if (!val.match(/^[0-9]{6}$/) && !val.match(/^[0-9]{8}$/)) {
			return "";
		} else {
			year_pref = val.length == 6 ? "20" : val.substr(0, 2);
			val = val.slice(-6);
			var y = year_pref + val.substr(0, 2);
			var m = val.substr(2, 2) - 1;
			var d = val.substr(4, 2) == "00" ? "01" : val.substr(4, 2);
			var date = new Date(y, m, d);
			if (date.getFullYear() != y || date.getMonth() != m || date.getDate() != d) {
				return "";
			} else {
				date.setYear(date.getFullYear() + _y);
				date.setMonth(date.getMonth() + _m);
				date.setDate(date.getDate() + _d);
				if (val.substr(4, 2) == "00") {
					return ("0000" + date.getFullYear()).slice(-4) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + "99";
				} else {
					return ("0000" + date.getFullYear()).slice(-4) + "/" + ("00" + (date.getMonth() + 1)).slice(-2) + "/" + ("00" + date.getDate()).slice(-2);
				}
			}
		}
	} else {
		return "";
	}
}

function KeyEventCommon(e) {

	if ($("div.alert:visible").length > 0) {
		if (e.keyCode != 153 && e.keyCode != 152) {
			$("div.alert").hide();
			if (error_focus != null) {
				error_focus.focus();
			} else {
				if (form.find("input[type=text]:focus,select:focus,input[type=button]:focus").length == 0) {
					setflg = 0;
					form.find("select,input[type=button],input[type=text]:not(.readonly)").each(function () {
						if ($(this).val() == "" && setflg == 0) {
							$(this).focus();
							setflg = 1;
						}
					});
					if (setflg == 0) {
						form.find("select,input[type=button],input[type=text]:not(.readonly)").eq(0).focus();
					}
				}
			}
			e.preventDefault();
		}
	}
	else {
		switch (e.keyCode) {
			case 13:
			case 40:
			case 38:
				if (form.find("input[type=text]:focus,select:focus,input[type=button]:focus").length == 0) {
					setflg = 0;
					form.find("select,input[type=button],input[type=text]:not(.readonly)").each(function () {
						if ($(this).val() == "" && setflg == 0) {
							$(this).focus();
							setflg = 1;
						}
					});
					if (setflg == 0) {
						form.find("select,input[type=button],input[type=text]:not(.readonly)").eq(0).focus();
					}
					e.preventDefault();
				}
				break;

			default:
				break;
		}
	}
}

function getCurrentDateTime() {
	var now = new Date();
	return now.getFullYear() + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + ("0" + now.getDate()).slice(-2) + " " + ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);
}

function getCurrentDate() {
	var now = new Date();
	return now.getFullYear() + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + ("0" + now.getDate()).slice(-2);
}

function addComma(num) {
	num = num - 0;
	return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}

function getTotalPage(rows, rows_per_page) {
	return (rows - rows % rows_per_page) / rows_per_page + (rows % rows_per_page > 0 ? 1 : 0);
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]"
}


/********************************************************************************
 * 機能 ：指定時間（ミリ秒）待機
 * API  ：未使用
 ********************************************************************************/

function Sleep(timeout) {
	try {
		var srcMillisec = (new Date()).getTime();

		for (; ;) {
			var nowMillisec = (new Date()).getTime();

			if ((nowMillisec - srcMillisec) > timeout) {
				break;
			}
		}
	}
	catch (e) {
		displayAlert("error:" + e);
	}

	return;
}

/**
 * CREATE ARRAY FROM PICKING QR CODE
 * - split qr code
 * @param {*} qr 
 * @returns ARRAY[ バッチNo.、場所区分、商品コード、数量、重量、SEQNo.、SEQ、発注No.、発注行 ]
 */
function splitPickQr(qr) {
	return [
		qr.substr(0, 7),
		qr.substr(7, 1),
		qr.substr(8, 7),
		qr.substr(15, 6),
		qr.substr(21, 7),
		qr.substr(28, 6),
		qr.substr(34, 4),
		qr.substr(38, 9),
		qr.substr(47, 1)
	];
};

/**
 * CREATE ARRAY FROM kenpin barcode / 出庫検品用バーコード
 * - split barcode
 * @param {*} code 
 * @returns ARRAY[ コード種別、バッチNo.、場所区分、連番、明細件数 ]
 */
function splitKenpinBarcode(code) {
	return [
		code.substr(0, 1),
		code.substr(1, 7),
		code.substr(8, 1),
		code.substr(9, 4),
		code.substr(13, 4)
	]
}

/**
 * KENPIN FUNCTION
 */
function fnc_hht003(position) {
	if(hht003_mesai.length == 0){
		changeScreen("hht003_1");
		return;
	};
//alert(form.find("input.quantity").val());
	var urlHead = API_ENDPOINT + API_GET + hht003_header + ("0000000" + ((form.find("input[name=complete_qty]").val() - 0) + ((form.find("input.quantity").size()>0 ? form.find("input.quantity").val() : 0) - 0))).slice(-7);
	var urlBody = "";

	for (var i = position; i < hht003_mesai.length; i++) {
		urlBody = urlBody + hht003_mesai[i];

		if (i != 0 && ((i+1) % 40) == 0){
			if((i + 1) < hht003_mesai.length) {
				//データ送信
				ajax(urlHead + "0" + urlBody, "POST", true, "", function (data) {
					if (data == "" || data != "OK") {
						displayAlert("<div>・ＣＳ出荷検品処理ができませんでした。</div>");
						return;
					}
					fnc_hht003(i+1);
					return;
				});
				return;
			}else{
				//データ送信
				ajax(urlHead + form.find("input[name=kenpin_kbn]").val() + urlBody, "POST", true, "", function (data) {
					if (data == "" || data != "OK") {
						displayAlert("<div>・ＣＳ出荷検品処理ができませんでした。</div>");
						return;
					}
					iCnt = 0;
					hht003_mesai = [];
					btBuzzer();
					changeScreen("hht003_1");
					clearScreen();
					return;
				});
				return;
			}
		}
	};
	//データ送信
	ajax(urlHead + form.find("input[name=kenpin_kbn]").val() + urlBody, "POST", true, "", function (data) {
		if (data == "" || data != "OK") {
			displayAlert("<div>・ＣＳ出荷検品処理ができませんでした。</div>");
			return;
		}
		iCnt = 0;
		hht003_mesai = [];
		btBuzzer();
		changeScreen("hht003_1");
		clearScreen();
	});
}