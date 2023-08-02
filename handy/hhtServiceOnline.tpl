<!DOCTYPE html>
<html lang="ja">

<head>
  <meta charset="utf-8" />
  <title>入出庫管理システム</title>
  <script src="js/jquery.min.js"></script>
  <link rel="stylesheet" type="text/css" href="css/common.css" />
  <script>
    _ajax = false;
    $(function () {
      $(document).keyup(function (e) {
        if ($("div.processing:visible").length > 0 || _ajax == true) {
          e.preventDefault();
          return;
        }

        KeyEventCommon(e);

        // 確認メッセージが表示されている場合はEnterの場合のみ処理を進める。
        if ($("div.confirm:visible").length > 0) {
          if (e.keyCode != 153 && e.keyCode != 152) {
            $(".confirm:visible").hide();
            if (e.keyCode == 13) {
              gblConfirmOk = true;
              evt = $.Event('keyup');
              evt.keyCode = confirmKeyCode;  // F1
              $(document).trigger(evt);
              e.preventDefault();
              return;
            } else {
              gblConfirmOk = false;
              e.preventDefault();
              return;
            }
          }
        }

        switch (current) {

          // ログイン画面
          case "hhtTop":
            switch (e.keyCode) {
              // 終了
              case 112:
                window.open('', '_self').close();
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // メニュー画面に遷移
              case 115:
                $("div.processing").show();
                $("div.processing").focus();
                if (isValid()) return;
                var operator_cd = ("000000" + form.find("input.operator_code").val()).slice(-6);

                var url = API_ENDPOINT + API_GET + HANDY_NAME + "MENU" + operator_cd;

                ajax(url, "GET", true, "", function (data) {
                  if (data == "NG" || data.length < 9) {
                    displayAlert("<div>・該当のオペレーターＣＤは登録されていません。</div>");
                    return;
                  };

                  OPERATOR_CODE = operator_cd;
                  OPERATOR_NAME = data.slice(0, data.length-1).replace(/\s+$/, "");
                  OPERATOR_TYPE = data.slice(-1);
                  $("span.operator_name").html(OPERATOR_NAME);

                  if (OPERATOR_TYPE == 0) {
                    changeScreen("hhtMenu");
                    $("form.hht002_1 .station_disp").removeClass("disnon");
                    $("form.hht002_1 .hht002_info").html("受渡票のＱＲコードをスキャンし、入庫ステーションを選択してください。");
                    return;
                  }
                  $("form.hht002_1 .station_disp").addClass("disnon");
                  $("form.hht002_1 .hht002_info").html("受渡票のＱＲコードをスキャンしてください。");
                  changeScreen("hht002_1");
                  clearScreen();
                });

                break;
            }
            break;

          // メニュー画面
          case "hhtMenu":
            switch (e.keyCode) {
              case 97:
              case 98:
              case 99:
              case 100:
              case 101:
              case 102:
              case 103:
              case 104:
                changeScreen("hht00" + (e.keyCode - 96) + "_1");
                clearScreen();
                break;

              // トップ画面に遷移
              case 112:
                OPERATOR_TYPE = "";
                changeScreen("hhtTop");
                clearScreen();
                break;
            }
            break;

          // 仕入入荷入力
          case "hht001_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 確認画面に遷移
              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (form.find("span.product_code").html() == "") {
                  displayAlert("<div>・受渡票のＱＲコードをスキャンしてください。</div>");
                  return;
                };

                if (isValid()) return;

                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H122" + ("000" + form.find("input.area").val()).slice(-3);

                ajax(url, "GET", true, "", function (data) {
                  var res = data.replace(/\s+$/, "");
                  if (res == "" || res.length == 0) {
                    displayAlert("<div>・入力された入荷先エリアはマスタに存在しません。</div>","エラー",form.find("input.area"));
                    return;
                  };

                  var qr = form.find("input.qr").val().split(",");

                  //VIEW
                  $("form.hht001_2 span.product_code").html(form.find("span.product_code").html());
                  $("form.hht001_2 span.product_name").html(form.find("span.product_name").html());
                  $("form.hht001_2 span.sub_name").html(form.find("span.sub_name").html());
                  $("form.hht001_2 span.quantity").html(addComma(form.find("input.quantity").val()));
                  $("form.hht001_2 span.area").html(form.find("input.area").val() + " " + res);

                  //API VALUES
                  $("form.hht001_2 input[name=product_code]").val(form.find("span.product_code").html());
                  $("form.hht001_2 input[name=area]").val(form.find("input.area").val());
                  $("form.hht001_2 input[name=quantity]").val(form.find("input.quantity").val());
                  $("form.hht001_2 input[name=order_no]").val(qr[5]);
                  $("form.hht001_2 input[name=order_row]").val(qr[6]);
                  $("form.hht001_2 input[name=pallet_no]").val(qr[7]);
                  $("form.hht001_2 input[name=pallet_qty]").val(qr[9]);

                  changeScreen("hht001_2");
                });


                break;
            }
            break;

          // 仕入入荷入力(確認)
          case "hht001_2":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hht001_1");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 登録
              case 115:

                $("div.processing").show();
                $("div.processing").focus();

                if (isValid()) return;

                var qty = ("0000000" + form.find("input[name=quantity]").val()).slice(-7);

                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H123" + OPERATOR_CODE + ("0000000" + form.find("input[name=product_code]").val()).slice(-7) + ("000" + form.find("input[name=area]").val()).slice(-3) + qty + ("000000000" + form.find("input[name=order_no]").val()).slice(-9) + ("0" + form.find("input[name=order_row]").val()).slice(-1) + ("00" + form.find("input[name=pallet_no]").val()).slice(-2) + ("00" + form.find("input[name=pallet_qty]").val()).slice(-2);

                ajax(url, "POST", true, "", function (data) {
                  if (data == "" || data != "OK") {
                    displayAlert("<div>・仕入入荷処理ができませんでした。</div>");
                    return;
                  };

                  btBuzzer();
                  changeScreen("hht001_1");
                  clearScreen();
                });

                break;
            }
            break;

          // CS入庫入力
          case "hht002_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                if (OPERATOR_TYPE == 1) {
                  clearScreen();
                }
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 確認画面に遷移
              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (form.find("span.product_code").html() == "") {
                  displayAlert("<div>・受渡票のＱＲコードをスキャンしてください。</div>");
                  return;
                };

                if (isValid()) return;

//                if ((form.find("input.quantity").val() % form.find("input.iru_su").val()) != 0) {
//                  displayAlert("<div>・数量には受渡票の入数で割り切れる値を入力してください。</div>","エラー",form.find("input.quantity"));
//                  return;
//                }

                var station_cd = form.find("input.station").val();
                var station_nm = "";

                switch (station_cd) {
                  case "1":
                    station_cd = "1311";
                    station_nm = "1階 1311";
                    break;
                  case "2":
                    station_cd = "1312";
                    station_nm = "1階 1312";
                    break;
                  case "3":
                    station_cd = "1321";
                    station_nm = "1階 1321";
                    break;
                  case "4":
                    station_cd = "1322";
                    station_nm = "1階 1322"
                    break;
                  case "5":
                    station_cd = "1331";
                    station_nm = "1階 1331";
                    break;
                  case "6":
                    station_cd = "2311";
                    station_nm = "2階 2311";
                    break;
                  default:
                    displayAlert("<div>・入庫ステーションには１～６のいずれかを入力してください。</div>","エラー",form.find("input.station"));
                    return;
                    break;
                }

                var qr = form.find("input.qr").val().split(",");

                //VIEW
                $("form.hht002_2 span.product_code").html(form.find("span.product_code").html());
                $("form.hht002_2 span.product_name").html(form.find("span.product_name").html());
                $("form.hht002_2 span.sub_name").html(form.find("span.sub_name").html());
                $("form.hht002_2 span.quantity").html(addComma(form.find("input.quantity").val()));
                $("form.hht002_2 span.station").html(station_nm);

                //API VALUES
                $("form.hht002_2 input[name=product_code]").val(form.find("span.product_code").html());
                $("form.hht002_2 input[name=lot_no]").val(qr[2]);
                $("form.hht002_2 input[name=station]").val(station_cd);
                $("form.hht002_2 input[name=quantity]").val(form.find("input.quantity").val());

                changeScreen("hht002_2");
                break;
            }
            break;

          // CS入庫(確認)
          case "hht002_2":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hht002_1");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 登録
              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (isValid()) return;

                var qty = ("0000000" + form.find("input[name=quantity]").val()).slice(-7);

                var lot_no = ("00000000" + form.find("input[name=lot_no]").val()).slice(-8);

                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H041" + OPERATOR_CODE + ("0000000" + form.find("input[name=product_code]").val()).slice(-7) + lot_no + form.find("input[name=station]").val() + qty;

                ajax(url, "POST", true, "", function (data) {
                  if (data != "OK" || data == "") {
                    displayAlert("<div>・ＣＳ入庫処理ができませんでした。</div>");
                    return;
                  };
                  btBuzzer();
                  changeScreen("hht002_1");
                  clearScreen();
                });
                break;
            }
            break;

          // ＣＳ出荷検品
          case "hht003_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 次画面に遷移
              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (form.find("span.product_code").html() == "") {
                  displayAlert("<div>・ピッキングリストＱＲコードをスキャンしてください。</div>");
                  return;
                };

                //VIEW
                $("form.hht003_2 span.product_code").html(form.find("span.product_code").html());
                $("form.hht003_2 span.product_name").html(form.find("span.product_name").html());
                $("form.hht003_2 span.kenpin_quantity").html(form.find("span.kenpin_quantity").html());
                $("form.hht003_2 span.total_quantity").html(form.find("span.total_quantity").html());

                //API VALUES
                $("form.hht003_2 input[name=qr]").val(form.find("input.qr").val());
                $("form.hht003_2 input[name=complete_qty]").val(form.find("input.complete_qty").val());

                changeScreen("hht003_2");
                clearScreen();
                break;
            }
            break;

          // ＣＳ出荷検品（ステーションと商品入力）
          case "hht003_2":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
//				if(iCnt>0 && !gblConfirmOk){
//					confirmKeyCode = e.keyCode;
//					displayConfirm("<div>・作業の途中ですが、検品保留しますか？</div>");
//				}else{
//					gblConfirmOk = false;
//	                $("div.processing").show();
//	                $("div.processing").focus();
//                    form.find("input[name=kenpin_kbn]").val(0);
//	                fnc_hht003(0);
//				}
                changeScreen("hht003_1");
                clearScreen();
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 登録
              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (isValid()) return;

                if (form.find("span.product_code").html()!=form.find("input.product_cd").val()) {
                    displayAlert("<div>・ピッキングリストと受注票の商品コードが異なります。</div>")
                    return;
                }

                var station_cd = form.find("input.station").val();

                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H012" + station_cd + form.find("input.product_cd").val();

                ajax(url, "GET", true, "", function (data) {
//data="OK123456789012345678901234561000000";
                  var status = (data+"  ").substring(0,2);

                  if (status != "OK") {
                    switch (status) {
                      case "NG":
                        displayAlert("<div>・指定したステーションNo.は存在しません。</div>");
                        break;
                      case "01":
                        displayAlert("<div>・指定したステーションは準備できていません！！</div>");
                        break;
                      case "02":
                        displayAlert("<div>・指定したステーションは出庫ではありません！！</div>");
                        break;
                      case "03":
                        displayAlert("<div>・商品一致しません！！</div>");
                        break;
                      default:
                        displayAlert("<div>・サーバーエラーが発生しました。</div>");
                        break;
                    }
                    return;
                  };

                  switch (station_cd) {
                    case "1311":
                      station_nm = "1階 1311";
                      break;
                    case "1312":
                      station_nm = "1階 1312";
                      break;
                    case "1321":
                      station_nm = "1階 1321";
                      break;
                    case "1322":
                      station_nm = "1階 1322"
                      break;
                    case "1331":
                      station_nm = "1階 1331";
                      break;
                    case "2311":
                      station_nm = "2階 2311";
                      break;
                    default:
                      displayAlert("指定したステーション№は存在しません。");
                      return;
                      break;
                  }

                  var schedule_no = data.substr(2, 10);
                  var ship_key = data.substr(12, 16);
                  var remain_qty = data.substr(28);

                  //VIEW
                  $("form.hht003_3 span.product_code").html(form.find("span.product_code").html());
                  $("form.hht003_3 span.product_name").html(form.find("span.product_name").html());
                  $("form.hht003_3 span.kenpin_quantity").html(form.find("span.kenpin_quantity").html());
                  $("form.hht003_3 span.total_quantity").html(form.find("span.total_quantity").html());
                  $("form.hht003_3 span.station").html(station_nm);
                  $("form.hht003_3 span.product").html(form.find("input.product_cd").val());

                  var qr = splitPickQr(form.find("input[name=qr]").val());

                  //API VALUES
                  $("form.hht003_3 input[name=batch_no]").val(qr[0]);
                  $("form.hht003_3 input[name=location_kbn]").val(qr[1]);
                  $("form.hht003_3 input[name=seq_no]").val(qr[5]);

                  $("form.hht003_3 input[name=lot_no]").val(form.find("input[name=lot_no]").val());

                  $("form.hht003_3 input[name=station_no]").val(station_cd);
                  $("form.hht003_3 input[name=schedule_no]").val(schedule_no);
                  $("form.hht003_3 input[name=ship_key]").val(ship_key);


//                  if (iCnt == 0) {
                    $("form.hht003_3 input[name=total_quantity]").val(qr[3]);
                    $("form.hht003_3 input[name=complete_qty]").val(form.find("input[name=complete_qty]").val());
//                  };
                  $("form.hht003_3 input[name=remain_qty]").val(remain_qty);

                  $("form.hht003_3 input.quantity").val("");
                  changeScreen("hht003_3");
                });

                break;
            }
            break;

          // ＣＳ出荷検品（確認用）
          case "hht003_3":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hht003_2");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (isValid()) return;

                //検品数チェック
                var total_qty = form.find("input[name=total_quantity]").val() - 0;
                var complete_qty = form.find("input[name=complete_qty]").val() - 0;
                var kenpin_qty = form.find("input.quantity").val() - 0;
                var remain_qty = form.find("input[name=remain_qty]").val() - 0;

                //input QTY is Greater than remaining qty
                if (kenpin_qty > remain_qty) {
                  displayAlert("<div>・検品数が抜取残数を超えています。</div>");
                  form.find("input.quantity").focus();
                  return;
                }

                if (kenpin_qty > (total_qty - complete_qty)) {
                  displayAlert("<div>・検品数が検品数残を超えています。</div>");
                  form.find("input.quantity").focus();
                  return;
                }

                //出庫完了区分
                remain_qty = remain_qty - kenpin_qty;
                var lot = ("00000000" + form.find("input[name=lot_no]").val()).slice(-8);

//                hht003_mesai.push(lot + form.find("input[name=station_no]").val() + form.find("input[name=schedule_no]").val() + form.find("input[name=ship_key]").val() + ("000000" + remain_qty).slice(-6));
//
//                if (total_qty - complete_qty - kenpin_qty == 0) {
//                  // Call function
//                  form.find("input[name=kenpin_kbn]").val(1);
//                  fnc_hht003(0);
//                  hht003_mesai.pop();
//                  return;
//                }
//
//                //完了数
//                form.find("input[name=complete_qty]").val(complete_qty + kenpin_qty);
//
//                //0埋め
//                complete_qty = form.find("input[name=complete_qty]").val();
//
//                //完了区分＝0　=>ステーションと商品を入力画面に戻る
//                form.find("input[name=kenpin_kbn]").val(0);
//                form.find("input[name=remain_qty]").val("");
//                iCnt++;
//                $("form.hht003_2 span.kenpin_quantity").html(addComma(total_qty - complete_qty));
//                $("form.hht003_2 input[name=complete_qty]").val(complete_qty);
//                $("form.hht003_2 input.lot_no").val("");
//                $("form.hht003_2 input.product_cd").val("");
//                $("form.hht003_2 input.station").val("");
//                changeScreen("hht003_2");

				var urlHead = API_ENDPOINT + API_GET + hht003_header + ("000000" + (complete_qty + kenpin_qty)).slice(-6) + (total_qty > (complete_qty + kenpin_qty) ? "0" : "1");
				var urlBody = lot + form.find("input[name=station_no]").val() + form.find("input[name=schedule_no]").val() + form.find("input[name=ship_key]").val() + ("0000000" + remain_qty).slice(-7);
				//データ送信
				ajax(urlHead + urlBody, "POST", true, "", function (data) {
					if (data == "" || data != "OK") {
					  displayAlert("<div>・ＣＳ出荷検品処理ができませんでした。</div>");
					  return;
					}
					iCnt = 0;
					hht003_mesai = [];
					if(total_qty > (complete_qty + kenpin_qty)){
					  var scanData = splitPickQr($("form.hht003_1 input.qr").val());
					  var url = API_ENDPOINT + API_GET + HANDY_NAME + "H011" + scanData[0] + scanData[1] + scanData[5];
					  ajax(url, "GET", true, "", function (data) {
//data="OK000002あいうえおかきくけこ       ";
						data = data.replace(/\s+$/, "");
						var status = (data + "  ").substr(0, 2);
						if (data == "" || data.length == 0 || status != "OK") {
							changeScreen("hht003_1");
							clearScreen();
							displayAlert("<div>・検品状況が取得できませんでした。</div>");
							return;
						};

						var complete_qty = data.substr(2, 6) - 0;
						var remain_qty = total_qty - complete_qty;

						if (remain_qty == 0) {
							changeScreen("hht003_1");
							clearScreen();
							displayAlert("<div>・該当のピッキングリストは検品完了しています。</div>");
							return;
						}

						iCnt = 0;
						hht003_mesai = [];
						changeScreen("hht003_2");
						form.find("span.kenpin_quantity").html(addComma(remain_qty));
						form.find("input[name=complete_qty]").val(complete_qty);
						form.find("input[name=lot_no]").val("");
						form.find("input.product_cd").val("");
						form.find("input.station").val("");
						btBuzzer();
					  });
					}else{
					  btBuzzer();
					  changeScreen("hht003_1");
					  clearScreen();
					}
				});
                break;
            }
            break;

          // 出庫完了
          case "hht004_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 処理なし
              case 115:
                break;
            }
            break;

          //荷揃表発行指示
          case "hht005_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 処理なし
              case 115:
                break;
            }
            break;

          //移動入力
          case "hht006_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (form.find("span.product_code").html() == "") {
                  displayAlert("<div>・受渡票ＱＲコードをスキャンしてください。</div>");
                  return;
                }

                if (isValid()) return;

                //移動元
                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H112" + ("000" + form.find("input.location_before").val()).slice(-3);
                ajax(url, "GET", true, "", function (data) {
                  data = data.replace(/\s+$/, "");
                  if (data == "" || data.length == 0) {
                    displayAlert("<div>・入力された移動元エリアはマスタに存在しません。</div>","エラー",form.find("input.location_before"));
                    return;
                  };
                  $("form.hht006_2 input[name=location_before]").val(form.find("input.location_before").val());
                  $("form.hht006_2 span.location_before").html(form.find("input.location_before").val() + " " + data);

                  //移動先
                  var url = API_ENDPOINT + API_GET + HANDY_NAME + "H113" + ("000" + form.find("input.location_after").val()).slice(-3);
                  ajax(url, "GET", true, "", function (data) {
                    data = data.replace(/\s+$/, "");
                    if (data == "" || data.length == 0) {
                      displayAlert("<div>・入力された移動先エリアはマスタに存在しません。</div>","エラー",form.find("input.location_after"));
                      return;
                    };
                    $("form.hht006_2 input[name=location_after]").val(form.find("input.location_after").val());
                    $("form.hht006_2 span.location_after").html(form.find("input.location_after").val() + " " + data);

	                var qr = form.find("input.qr").val().split(",");

	                //VIEW
	                $("form.hht006_2 span.product_code").html(form.find("span.product_code").html());
	                $("form.hht006_2 span.product_name").html(form.find("span.product_name").html());
	                $("form.hht006_2 span.sub_name").html(form.find("span.sub_name").html());
	                $("form.hht006_2 span.quantity").html(addComma(form.find("input.quantity").val()));

	                //API VALUES
	                $("form.hht006_2 input[name=product_code]").val(form.find("span.product_code").html());
	                $("form.hht006_2 input[name=quantity]").val(form.find("input.quantity").val());
	                $("form.hht006_2 input[name=order_no]").val(qr[5]);
	                $("form.hht006_2 input[name=order_row]").val(qr[6]);
	                $("form.hht006_2 input[name=pallet_no]").val(qr[7]);
	                $("form.hht006_2 input[name=pallet_qty]").val(qr[9]);

	                changeScreen("hht006_2");
                  });
                });
                break;
            }
            break;

          //移動入力（確認用）
          case "hht006_2":
            switch (e.keyCode) {
              case 112:
                changeScreen("hht006_1");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 登録
              case 115:

                $("div.processing").show();
                $("div.processing").focus();

                if (isValid()) return;

                //0埋め
                var qty = form.find("input[name=quantity]").val();
                while (qty.length != 7) {
                  qty = "0" + qty;
                }

                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H114" + OPERATOR_CODE + ("0000000" + form.find("input[name=product_code]").val()).slice(-7) + ("000" + form.find("input[name=location_before]").val()).slice(-3) + ("000" + form.find("input[name=location_after]").val()).slice(-3) + qty + ("000000000" + form.find("input[name=order_no]").val()).slice(-9) + ("0" + form.find("input[name=order_row]").val()).slice(-1) + ("00" + form.find("input[name=pallet_no]").val()).slice(-2) + ("00" + form.find("input[name=pallet_qty]").val()).slice(-2);

                ajax(url, "POST", true, "", function (data) {
                  if (data == "" || data != "OK") {
                    displayAlert("<div>・移動処理ができませんでした。</div>");
                    return;
                  };
                  btBuzzer();
                  changeScreen("hht006_1");
                  clearScreen();
                });

                break;
            }
            break;

          //横持移動入力
          case "hht007_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if (form.find("span.product_code").html() == "") {
                  displayAlert("<div>・受渡票ＱＲコードをスキャンしてください。</div>");
                  return;
                };

                if (isValid()) return;

                //移動元
                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H112" + ("000" + form.find("input.location_before").val()).slice(-3);
                ajax(url, "GET", true, "", function (data) {
                  data = data.replace(/\s+$/, "");
                  if (data == "" || data.length == 0) {
                    displayAlert("<div>・入力された移動元エリアはマスタに存在しません。</div>","エラー",form.find("input.location_before"));
                    return;
                  };
                  $("form.hht007_2 input[name=location_before]").val(form.find("input.location_before").val());
                  $("form.hht007_2 span.location_before").html(form.find("input.location_before").val() + " " + data);

                  //移動先
                  var url = API_ENDPOINT + API_GET + HANDY_NAME + "H113" + ("000" + form.find("input.location_after").val()).slice(-3);
                  ajax(url, "GET", true, "", function (data) {
                    data = data.replace(/\s+$/, "");
                    if (data == "" || data.length == 0) {
                      displayAlert("<div>・入力された移動先エリアはマスタに存在しません。</div>","エラー",form.find("input.location_after"));
                      return;
                    };
                    $("form.hht007_2 input[name=location_after]").val(form.find("input.location_after").val());
                    $("form.hht007_2 span.location_after").html(form.find("input.location_after").val() + " " + data);

	                var qr = form.find("input.qr").val().split(",");

	                //VIEW
	                $("form.hht007_2 span.product_code").html(form.find("span.product_code").html());
	                $("form.hht007_2 span.product_name").html(form.find("span.product_name").html());
	                $("form.hht007_2 span.sub_name").html(form.find("span.sub_name").html())
	                $("form.hht007_2 span.quantity").html(addComma(form.find("input.quantity").val()));

	                //API VALUES
	                $("form.hht007_2 input[name=product_code]").val(form.find("span.product_code").html());
	                $("form.hht007_2 input[name=quantity]").val(form.find("input.quantity").val());
	                $("form.hht007_2 input[name=order_no]").val(qr[5]);
	                $("form.hht007_2 input[name=order_row]").val(qr[6]);
	                $("form.hht007_2 input[name=pallet_no]").val(qr[7]);
	                $("form.hht007_2 input[name=pallet_qty]").val(qr[9]);

	                changeScreen("hht007_2");
                  });
                });
                break;
            }
            break;

          //横持移動入力（確認用）
          case "hht007_2":
            switch (e.keyCode) {
              case 112:
                changeScreen("hht007_1");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              // 登録
              case 115:

                $("div.processing").show();
                $("div.processing").focus();

                if (isValid()) return;

                var qty = ("0000000" + form.find("input[name=quantity]").val()).slice(-7);

                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H114" + OPERATOR_CODE + ("0000000" + form.find("input[name=product_code]").val()).slice(-7) + ("000" + form.find("input[name=location_before]").val()).slice(-3) + ("000" + form.find("input[name=location_after]").val()).slice(-3) + qty + ("000000000" + form.find("input[name=order_no]").val()).slice(-9) + ("0" + form.find("input[name=order_row]").val()).slice(-1) + ("00" + form.find("input[name=pallet_no]").val()).slice(-2) + ("00" + form.find("input[name=pallet_qty]").val()).slice(-2);

                ajax(url, "GET", true, "", function (data) {
                  if (data == "" || data != "OK") {
                    displayAlert("<div>・移動処理ができませんでした。</div>");
                    return;
                  };
                  btBuzzer();
                  changeScreen("hht007_1");
                  clearScreen();
                });

                break;
            }
            break;

          //荷札発行
          case "hht008_1":
            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hhtMenu");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;


              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                if(form.find("span.arrangement_no").html()==""){
                    displayAlert("<div>・荷合わせ用バーコードをスキャンしてください。</div>");
                    return;
                }

                if (isValid()) return;

                $("form.hht008_2 span.arrangement_no").html(form.find("span.arrangement_no").html());
                $("form.hht008_2 span.quantity").html(form.find("input.quantity").val());
                $("form.hht008_2 input[name=arrangement_no]").val(form.find("input[name=arrangement_no]").val());

                changeScreen("hht008_2");
                break;
            }
            break;

          //荷札発行（確認）
          case "hht008_2":

            switch (e.keyCode) {
              // メニュー画面に遷移
              case 112:
                changeScreen("hht008_1");
                break;

              // 処理なし
              case 113:
                break;

              // 処理なし
              case 114:
                break;

              case 115:
                $("div.processing").show();
                $("div.processing").focus();

                var qty = ("000" + (form.find("span.quantity").html() - 0)).slice(-3);

                //SEND
                var url = API_ENDPOINT + API_GET + HANDY_NAME + "H035" + form.find("input[name=arrangement_no]").val() + qty;

                ajax(url, "GET", true, "", function (data) {
                  if (data == "" || data == "NG") {
                    displayAlert("<div>・サーバーでエラーが発生しました。</div>");
                    return;
                  };

                  if (data == "PE") {
                    displayAlert("<div>・ラベルプリンタが認識できません。電源を確認してください。</div>");
                    return;
                  };

                  btBuzzer();
                })

                changeScreen("hht008_1");
                clearScreen();
                break;
            }

            break;

        }
      });

      // 手入力による変更時はLotをｸﾘｱ
      $("div.hht003_2 input.product_cd").change(function(){
      	$("div.hht003_2 input[name=lot_no]").val("");
      });
      changeScreen("hhtTop");

    });
  </script>

  <script type="text/javascript" src="js/btLibDef.js" charset="UTF-8"></script>
  <script type="text/javascript" src="js/btScanLib.js" charset="UTF-8"></script>
  <script type="text/javascript" src="js/btSysLib.js" charset="UTF-8"></script>
  <script type="text/javascript" src="js/btFileLib.js" charset="UTF-8"></script>
  <script type="text/javascript" src="js/btCommLib.js" charset="UTF-8"></script>

  <script for="btEvent" event="btScan(wParam)" language="javascript">
    ScanEventReceive(wParam);
  </script>

</head>

<body>
  <object id="btScanLib" width="0" height="0" classid="clsid:B5EBE200-8206-436E-934B-C7801C0CBAA5"></object>
  <object id="btSysLib" width="0" height="0" classid="clsid:C402E5BB-6F60-4D26-8E12-56533989BAB3"></object>
  <object id="btFileLib" width="0" height="0" classid="clsid:942CBD6F-8864-43DE-9496-2E02C11F1145"></object>
  <object id="btEvent" width="0" height="0" classid="clsid:C48419D8-30CC-40C1-9AB3-2029CA4D079F"></object>
  <object id="btCommLib" width="0" height="0" classid="clsid:6D1023A6-A890-4FC7-9AE0-134B0D78DC1C"></object>

  <script src="js/setting.js"></script>
  <script src="js/common.js"></script>

  <!----------------------- ログイン ---------------------------->

  <div class="screen hhtTop">
    <!-- 入力エリア -->
    <form class="hhtTop">
      <h1 style="text-align: center;">物流 入出庫管理システム</h1>

      <div class="input-full mt10">
        <div>オペレーターＣＤを入力してください。</div>
      </div>

      <div class="input-area mt5">
        <div class="input-full first-col center">
          <h2 class="disnon">オペレーターＣＤ</h2>
          <input type="text" name="operator_code" class="text-half operator_code" data-require="true"
            data-format="numeric" data-input="6" maxlength="6">
        </div>
      </div>
    </form>

    <!-- ボタンエリア -->
    <div class="btn-area">
      <div class="btn-f1">F1:終了</div>
      <div class="btn-f0"></div>
      <div class="btn-f0"></div>
      <div class="btn-f4">F4:送信</div>
    </div>

  </div>

  <!----------------------- メニュー ---------------------------->

  <div class="screen hhtMenu disnon">
    <!-- 入力エリア -->
    <form class="hhtMenu">
      <h1 style="text-align: center;">物流 入出庫管理システム</h1>

      <div class="input-area">

        <div class="input-full section sec-1 center" style="padding:2px;">
          <table class="select-list">
            <tr>
              <td class="left" id="btn-1">１．　仕入入荷入力</td>
            </tr>
            <tr>
              <td class="left" id="btn-2">２．　ＣＳ入庫入力</td>
            </tr>
          </table>
        </div>
        <div class="input-full section sec-2 center" style="padding:2px;">
          <table class="select-list">
            <tr>
              <td class="left" id="btn-3">３．　ＣＳ出庫検品</td>
            </tr>
            <tr>
              <td class="left" id="btn-4">４．　出庫完了</td>
            </tr>
            <tr>
              <td class="left" id="btn-5">５．　荷揃表発行指示</td>
            </tr>
          </table>
        </div>
        <div class="input-full section sec-3 center" style="padding:2px;">
          <table class="select-list">
            <tr>
              <td class="left" id="btn-6">６．　移動入力</td>
            </tr>
            <tr>
              <td class="left" id="btn-7">７．　横持移動入力</td>
            </tr>
          </table>
        </div>
        <div class="input-full section sec-4 center" style="padding:2px;">
          <table class="select-list">
            <tr>
              <td class="left" id="btn-8">８．　荷札発行</td>
            </tr>
          </table>
        </div>
      </div>
    </form>

    <!-- ボタンエリア -->
    <div class="btn-area">
      <div class="btn-f1">F1:終了</div>
      <!-- <div class="btn-f0"></div>
      <div class="btn-f0"></div>
      <div class="btn-f0"></div> -->
      <div class=" right" style="width: 72%;padding:0;">
        <span class="operator_name" style="padding:0;"></span>
      </div>
    </div>
  </div>

  <!----------------------- 仕入入荷入力 ---------------------------->

  <div class="screen hht001_1 disnon sec-1">
    <!-- 入力エリア -->
    <form class="hht001_1">
      <h1 class="hht001">１．仕入入荷入力</h1>
      <div class="input-area">
        <div class="input-full right">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          受渡票のＱＲコードをスキャンし、入荷先を入力してください。
        </div>

        <div class="input-full">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;"></span>
        </div>

        <div class="input-full">
          <h2 class="">数量</h2>
          <input type="text" name="quantity" class="text-half quantity" data-require="true" data-format="numericMoreThanZero"
            data-input="6" maxlength="7">
        </div>

        <div class="input-full">
          <h2 class="">入荷先</h2>
          <input type="text" name="area" class="text-half area" data-require="true" data-format="numeric" data-input="6"
            maxlength="3" style="width: 20%;">
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:次へ</div>
      </div>

      <input type="hidden" class="qr" data-require="true" data-format="alphaNumeric">
    </form>
  </div>

  <div class="screen hht001_2 disnon sec-1">
    <!-- 入力エリア -->
    <form class="hht001_2">
      <h1 class="hht001">１．仕入入荷入力</h1>
      <div class="input-area">
        <div class="input-full right">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          この内容でよろしいですか？　　　　　　　　　　　
        </div>

        <div class="input-full">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;"></span>
        </div>

        <div class="input-full">
          <h2 class="">数量</h2>
          <span class="full quantity" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">入荷先</h2>
          <span class="full area" style="width:55%;"></span>
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:戻る</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:ＯＫ</div>
      </div>

      <input type="hidden" name="product_code" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="area" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="quantity" data-require="true" data-format="numeric">
      <input type="hidden" name="order_no" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="order_row" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="pallet_no" data-require="true" data-format="numeric">
      <input type="hidden" name="pallet_qty" data-require="true" data-format="numeric">

    </form>
  </div>

  <!----------------------- ＣＳ入庫入力 ---------------------------->

  <div class="screen hht002_1 disnon sec-1">
    <!-- 入力エリア -->
    <form class="hht002_1">
      <h1 class="hht002">２．ＣＳ入庫入力</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full hht002_info mt2">
          受渡票のＱＲコードをスキャンし、入庫ステーションを選択してください。
        </div>

        <div class="input-full">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;padding-bottom:0;"></span>
        </div>

        <div class="input-full" style="margin-top:0;">
          <h2 class="">数量</h2>
          <input type="text" class="text-half quantity" data-require="true" data-format="numericMoreThanZero" data-input="6"
            maxlength="7">
        </div>

        <div class="input-full type-chk">
          <h2 class="">入庫ＳＴ</h2>
          <input type="text" class="text-half station" data-require="true" data-format="numeric" data-input="6"
            maxlength="1" style="width: 10%;">
        </div>
        <div class="input-full" style="padding:1px 1px;padding-bottom:0;width:98%;background:none;font-size:110%;">
          <div class="station_disp " style="font-size:100%;margin-bottom:-3px;">
          	<div style="font-size:100%;">
			<span style="display:inline-block;font-size:100%;font-weight:bold;width:35px;border:1px solid #000;margin:0px 2px 0px 0px;padding-top:1px;" class="center">1階</span>
			<span style="font-size:110%;font-weight:bold;">1:</span>1311&nbsp;
			<span style="font-size:110%;font-weight:bold;">2:</span>1312&nbsp;
			<span style="font-size:110%;font-weight:bold;">3:</span>1321
            </div>
          	<div style="font-size:100%;margin-top:-1px;">
			<span style="display:inline-block;font-size:100%;font-weight:bold;width:35px;border:1px solid #fff;margin:0 2px 0 0px;padding:0;" class="center">&nbsp;&nbsp;</span>
			<span style="font-size:110%;font-weight:bold;">4:</span>1322&nbsp;
			<span style="font-size:110%;font-weight:bold;">5:</span>1331&nbsp;
			<span style="font-size:110%;font-weight:bold;"></span>
            </div>
          </div>
          <div style="font-size:100%;">
			<span style="display:inline-block;font-size:100%;font-weight:bold;width:35px;border:1px solid #000;margin:0px 2px 0px 0px;padding-top:1px;" class="center">2階</span>
			<span style="font-size:110%;font-weight:bold;">6:</span>2311&nbsp;
          </div>
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:次へ</div>
      </div>

      <input type="hidden" class="qr" data-require="true" data-format="alphaNumeric">
      <input type="hidden" class="iru_su">
    </form>
  </div>

  <div class="screen hht002_2 disnon sec-1">
    <!-- 入力エリア -->
    <form class="hht002_2">
      <h1 class="hht002">２．ＣＳ入庫入力</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          この内容でよろしいですか？　　　　　　　　　　　　
        </div>

        <div class="input-full">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;padding-bottom:0;"></span>
        </div>

        <div class="input-full">
          <h2 class="">数量</h2>
          <span class="full label quantity" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">入庫ＳＴ</h2>
          <span class="full label station" style="width:55%;"></span>
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:戻る</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:ＯＫ</div>
      </div>

      <input type="hidden" name="product_code" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="lot_no" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="station" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="quantity" data-require="true" data-format="alphaNumeric">

    </form>
  </div>

  <!----------------------- ＣＳ出庫検品 ---------------------------->

  <div class="screen hht003_1 disnon sec-2">
    <!-- 入力エリア -->
    <form class="hht003_1">
      <h1 class="hht003">３．ＣＳ出庫検品</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          ピッキングリストのＱＲコードをスキャンしてください。
        </div>

        <div class="input-full mt5">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name"></span>
        </div>

        <div class="input-full">
          <h2>検品数残</h2>
          <span class="full label kenpin_quantity right" style="width:24%;"></span>/<span class="full label total_quantity right" style="width:24%;"></span>
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:次へ</div>
      </div>

      <input type="hidden" class="qr" data-require="true" data-format="alphaNumeric">
      <input type="hidden" class="complete_qty" data-require="true" data-format="numeric">

    </form>
  </div>

  <div class="screen hht003_2 disnon sec-2">
    <!-- 入力エリア -->
    <form class="hht003_2">
      <h1 class="hht003">３．ＣＳ出庫検品</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          ステーション№と出庫商品の受渡票ＱＲコードをスキャンしてください。
        </div>

        <div class="input-full mt5">
          <h2 class="">商品名</h2>
          <span class="full notclear product_code" style="width:50%;"></span>
          <span class="full notclear product_name"></span>
        </div>

        <div class="input-full">
          <h2>検品数残</h2>
          <span class="full notclear kenpin_quantity right" style="width:24%;"></span>/<span class="full notclear total_quantity right" style="width:24%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">ｽﾃｰｼｮﾝ№</h2>
          <input type="text" class="text-half station" data-require="true" data-format="numeric" data-input="6"
            maxlength="4" style="width: 20%;">
        </div>

        <div class="input-full">
          <h2 class="">商品ｺｰﾄﾞ</h2>
          <input type="text" class="text-half product_cd" data-require="true" data-format="numeric" data-input="6"
            maxlength="7">
        </div>

      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:戻る</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:次へ</div>
      </div>

      <input type="hidden" class="notclear" name="qr" data-require="true" data-format="alphaNumeric">
      <input type="hidden" class="notclear" name="complete_qty" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="lot_no" data-require="true" data-format="alphaNumeric">
      <input type="hidden" class="notclear" name="kenpin_kbn" value="0">

    </form>
  </div>

  <div class="screen hht003_3 disnon sec-2">
    <!-- 入力エリア -->
    <form class="hht003_3">
      <h1 class="hht003">３．ＣＳ出庫検品</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          検品数を入力してください。　　　　　　　　　　　
        </div>

        <div class="input-full mt5">
          <h2 class="">商品名</h2>
          <span class="full notclear product_code" style="width:50%;"></span>
          <span class="full notclear product_name"></span>
        </div>

        <div class="input-full">
          <h2>検品数残</h2>
          <span class="full notclear kenpin_quantity right" style="width:24%;"></span>/<span class="full notclear total_quantity right" style="width:24%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">ｽﾃｰｼｮﾝ№</h2>
          <span class="full notclear station" style="width:50%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">商品ｺｰﾄﾞ</h2>
          <span class="full notclear product" style="width:50%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">検品数</h2>
          <input type="text" class="text-half quantity" data-require="true" data-format="numericMoreThanZero" data-input="6"
            maxlength="7">
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:戻る</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:ＯＫ</div>
      </div>

      <input type="hidden" class="notclear" name="total_quantity" data-require="true" data-format="numeric">

      <input type="hidden" class="notclear" name="batch_no" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="location_kbn" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="seq_no" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="complete_qty" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="kenpin_kbn" data-require="true" data-format="numeric">

      <input type="hidden" class="notclear" name="lot_no" data-require="true" data-format="numeric">

      <input type="hidden" class="notclear" name="station_no" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="schedule_no" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="ship_key" data-require="true" data-format="numeric">
      <input type="hidden" class="notclear" name="remain_qty" data-require="true" data-format="numeric">

    </form>
  </div>

  <!----------------------- 出庫完了 ---------------------------->

  <div class="screen hht004_1 disnon sec-2">
    <!-- 入力エリア -->
    <form class="hht004_1">
      <h1 class="hht004">４．出庫完了</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          出庫チェックリストの出庫検品用バーコードをスキャンしてください。
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
      </div>
    </form>
  </div>

  <!----------------------- 荷揃表発行指示 ---------------------------->

  <div class="screen hht005_1 disnon sec-2">
    <!-- 入力エリア -->
    <form class="hht005_1">
      <!-- <input type="hidden" class="product_code" data-require="true" data-format="numeric" maxlength="6"> -->
      <h1 class="hht005">　５.荷揃表発行指示</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          出庫チェックリストの荷合せ用バーコード、もしくは荷合せリストのバーコードをスキャンしてください。
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
      </div>
    </form>
  </div>

  <!----------------------- 移動入力 ---------------------------->

  <div class="screen hht006_1 disnon sec-3">
    <!-- 入力エリア -->
    <form class="hht006_1">
      <h1 class="hht006">６．移動入力</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          受渡票のＱＲコードをスキャンし、移動先を入力してください。
        </div>

        <div class="input-full mt5">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;padding-bottom:0;"></span>
        </div>

        <div class="input-full">
          <h2 class="">数量</h2>
          <input type="text" name="quantity" class="text-half quantity" data-require="true" data-format="numericMoreThanZero"
            data-input="6" maxlength="7">
        </div>

        <div class="input-full">
          <h2 class="">移動元</h2>
          <input type="text" name="location_before" class="text-half location_before" data-require="true"
            data-format="alphaNumeric" data-input="6" maxlength="3" style="width: 15%;">
        </div>

        <div class="input-full">
          <h2 class="">移動先</h2>
          <input type="text" name="location_after" class="text-half location_after" data-require="true"
            data-format="alphaNumeric" data-input="6" maxlength="3" style="width: 15%;">
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:次へ</div>
      </div>

      <input type="hidden" class="qr" data-require="true" data-format="alphaNumeric">

    </form>
  </div>


  <div class="screen hht006_2 disnon sec-3">
    <!-- 入力エリア -->
    <form class="hht006_2">
      <h1 class="hht006">６．移動入力</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          この内容でよろしいですか？
        </div>

        <div class="input-full mt5">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;padding-bottom:0;"></span>
        </div>

        <div class="input-full">
          <h2 class="">数量</h2>
          <span class="full quantity" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">移動元</h2>
          <span class="full location_before" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">移動先</h2>
          <span class="full location_after" style="width:55%;"></span>
        </div>.
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:戻る</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:ＯＫ</div>
      </div>

      <input type="hidden" name="product_code" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="location_before" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="location_after" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="quantity" data-require="true" data-format="numeric">
      <input type="hidden" name="order_no" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="order_row" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="pallet_no" data-require="true" data-format="numeric">
      <input type="hidden" name="pallet_qty" data-require="true" data-format="numeric">

    </form>
  </div>

  <!----------------------- 横持移動入力 ---------------------------->

  <div class="screen hht007_1 disnon sec-3">
    <!-- 入力エリア -->
    <form class="hht007_1">
      <h1 class="hht007">７．横持移動入力</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          受渡票のＱＲコードをスキャンし、移動先を入力してください。
        </div>

        <div class="input-full mt5">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;padding-bottom:0;"></span>
        </div>

        <div class="input-full">
          <h2 class="">数量</h2>
          <input type="text" name="quantity" class="text-half quantity" data-require="true" data-format="numericMoreThanZero"
            data-input="6" maxlength="7">
        </div>

        <div class="input-full">
          <h2 class="">移動元</h2>
          <input type="text" name="location_before" class="text-half location_before" data-require="true"
            data-format="alphaNumeric" data-input="6" maxlength="3" style="width: 15%;">
        </div>

        <div class="input-full">
          <h2 class="">移動先</h2>
          <input type="text" name="location_after" class="text-half location_after" data-require="true"
            data-format="alphaNumeric" data-input="6" maxlength="3" style="width: 15%;">
        </div>
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:次へ</div>
      </div>

      <input type="hidden" class="qr" data-require="true" data-format="alphaNumeric">

    </form>
  </div>


  <div class="screen hht007_2 disnon sec-3">
    <!-- 入力エリア -->
    <form class="hht007_2">
      <h1 class="hht007">７．横持移動入力</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          この内容でよろしいですか？
        </div>

        <div class="input-full mt5">
          <h2 class="">商品名</h2>
          <span class="full label product_code" style="width:55%;"></span>
          <span class="full label product_name" style="padding-top:1px;"></span>
          <span class="full label sub_name" style="padding-top:0;padding-bottom:0;"></span>
        </div>

        <div class="input-full">
          <h2 class="">数量</h2>
          <span class="full quantity" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">移動元</h2>
          <span class="full location_before" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">移動先</h2>
          <span class="full location_after" style="width:55%;"></span>
        </div>.
      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:戻る</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:ＯＫ</div>
      </div>

      <input type="hidden" name="product_code" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="location_before" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="location_after" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="quantity" data-require="true" data-format="numeric">
      <input type="hidden" name="order_no" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="order_row" data-require="true" data-format="alphaNumeric">
      <input type="hidden" name="pallet_no" data-require="true" data-format="numeric">
      <input type="hidden" name="pallet_qty" data-require="true" data-format="numeric">

    </form>
  </div>

  <!----------------------- 荷札発行 ---------------------------->

  <div class="screen hht008_1 disnon sec-4">
    <!-- 入力エリア -->
    <form class="hht008_1">
      <h1 class="hht008">８．荷札発行</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          出庫チェックリストの荷合せ用バーコード、もしくは荷合せリストのバーコードをスキャンしてください。
        </div>

        <br>

        <div class="input-full mt5">
          <h2 class="">荷合せNo.</h2>
	      <input type="hidden" name="arrangement_no">
          <span class="full label arrangement_no" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">枚数</h2>
          <input type="text" name="quantity" class="text-half quantity" data-require="true" data-format="numericMoreThanZero"
            data-input="6" maxlength="3" style="width: 20%;">
        </div>

      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:終了</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:次へ</div>
      </div>

    </form>
  </div>

  <div class="screen hht008_2 disnon sec-4">
    <!-- 入力エリア -->
    <form class="hht008_2">
      <h1 class="hht008">８．荷札発行</h1>
      <div class="input-area">
        <div class="input-full right ">
          <span class="operator_name"></span>
        </div>

        <div class="input-full mt2">
          この内容でよろしいですか？　　　　　　　　　　　　　　
        </div>

        <br>

        <div class="input-full mt5">
          <h2 class="">荷合せNo.</h2>
	      <input type="hidden" name="arrangement_no" class="disnon">
          <span class="full arrangement_no" style="width:55%;"></span>
        </div>

        <div class="input-full">
          <h2 class="">枚数</h2>
          <span class="quantity full" style="width: 55%;"></span>
        </div>

      </div>

      <!-- ボタンエリア -->
      <div class="btn-area">
        <div class="btn-f1">F1:戻る</div>
        <div class="btn-f0"></div>
        <div class="btn-f0"></div>
        <div class="btn-f4">F4:ＯＫ</div>
      </div>

    </form>
  </div>

  <!----------------------- ポップアップ ---------------------------->
  <div class="alert disnon">
    <h1>エラー</h1>
    <div class="message">
    </div>
    <div class="fix">
      なにかキーを押してください。
    </div>
  </div>

  <div class="confirm disnon">
    <h1>確認</h1>
    <div class="message">
      直近の明細を削除します。よろしいですか？<br><br>
      「Enter」で削除します。
    </div>
    <div class="fix">
      [ＥＮＴ]キーで処理を進めます。<br><br>
      なにかキーを押してください。
    </div>
  </div>

  <div class="processing disnon">
    処理中です。<br><br>
    しばらくお待ちください。
  </div>

</body>

</html>