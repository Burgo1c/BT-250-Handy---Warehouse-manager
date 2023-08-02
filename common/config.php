<?php

/**
 * DATABASE CONNECTION
 */
define("DB_CON_STR", "oci:dbname=(description=(address=(protocol=tcp)(host=192.168.5.100)(port=1521))(connect_data=(service_name=ORCL)));charset=AL32UTF8");
//
define("DB_USER", "eawc");
define("DB_PASS", "eawc");

/**
 * PRODUCT FILE PATH
 */
define("PRODUCT_FILE_PATH", "temp/");
define("PRODUCT_FILE_NAME", "Product.csv");
define("PRODUCT_IMPORT_FILE_PATH", "\\\\192.168.5.70\\eawc-share");
define("PRODUCT_IMPORT_FILE_NAME", "S1ITEM*.txt");
define("PRODUCT_IMPORT_USER", "administrator");
define("PRODUCT_IMPORT_PASS", "kunimo#10");

/**
 * SIGNAGE IP
 */
define("ST_1311_IP", "192.168.5.101");
define("ST_1312_IP", "192.168.5.102");
define("ST_1321_IP", "192.168.5.103");
define("ST_1322_IP", "192.168.5.104");
define("ST_1331_IP", "192.168.5.105");
define("ST_2311_IP", "192.168.5.90");

/**
 * ENDJ02 AND wait_msg FILE PATH
 */
define("FILE_PATH", "\\\\192.168.5.72\\KSD\\EXE");
define("END_FILE_NAME", "\\ENDJ02");
define("MSG_FILE_NAME", "\\wait_msg.txt");
define("FOLDER_USER", "administrator");
define("FOLDER_PASS", "kunimo#10");
define("TEMP_PATH", "D:/htdocs/signage/temp/");

/**
 * HANDY用 API ENDPOINT
 */
define("API_ENDPOINT", "http://164.70.88.229/index.php?d=");
