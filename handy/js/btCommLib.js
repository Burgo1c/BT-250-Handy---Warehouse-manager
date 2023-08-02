// *******************************************************************************
// **	Copyright(c) 2012-2014 Keyence Corporation. All rights reserved
// **	File Name: btCommLib.js
// **
// **	Function	: Terminal Library JavaScript File (Communication control)
// **	Notes		: None
// **
// ********************************************************************************

//Create Namespace
var Bt;
if( !Bt ){
	Bt = {};							// Namespace "Bt"
}
if( !Bt.CommLib ){
	Bt.CommLib = {};					// Namespace "Bt.CommLib"
}
if( !Bt.CommLib.Utility ){
	Bt.CommLib.Utility = {};			// Namespace "Bt.CommLib.Utility"
}
if( !Bt.CommLib.Bluetooth ){
	Bt.CommLib.Bluetooth = {};			// Namespace "Bt.CommLib.Bluetooth"
}
if( !Bt.CommLib.Wlan ){
	Bt.CommLib.Wlan = {};				// Namespace "Bt.CommLib.Wlan"
}
if( !Bt.CommLib.Usb ){
	Bt.CommLib.Usb = {};				// Namespace "Bt.CommLib.Usb"
}
if( !Bt.CommLib.Snmp ){
	Bt.CommLib.Snmp = {};				// Namespace "Bt.CommLib.Snmp"
}

//Functions in Namespace
(function() {

	var CommLib = Bt.CommLib;

	//------------------------------------------------------------------------
	// Bt.CommLib.Bluetooth
	//------------------------------------------------------------------------
	//*********************************************************************************
	// * @brief	Function:@n	[Open Bluetooth adapter]
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothOpen = function()
	{
		var ret = btCommLib_X.btBluetoothOpen(); // Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Close Bluetooth adapter]
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothClose = function()
	{
		var ret = btCommLib_X.btBluetoothClose(); // Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Bluetooth Inquiry (query)]
	// * @n
	// * @param	[out]	obj		:Number of detected Bluetooth devices (CommDevCount class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothInquiry = function(obj)
	{
		var ret = btCommLib_X.btBluetoothInquiry(); 	// Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			obj.count = btCommLib_X.BtInquiryDevCount; 	// Get number of detected Bluetooth devices property
		}
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Get Bluetooth device information]
	// * @n
	// * @param	[in]	index	:Index of detected Bluetooth devices by Inquiry (0 to (devnum-1))
	// * @param	[out]	obj		:Bluetooth device information (BT_BLUETOOTH_TARGET class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothGetInquiryResult = function(index, obj)
	{
		var ret = btCommLib_X.btBluetoothGetInquiryResult(index); // Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			// Get property
			obj.name = btCommLib_X.BtTargetName; 		// Bluetooth device name
			obj.addr = btCommLib_X.BtTargetAddress; 		// Bluetooth device address
		}
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Execute pairing between Bluetooth devices]
	// * @n
	// * @param	[in]	obj		:Bluetooth device information (BT_BLUETOOTH_TARGET class)
	// * @param	[in]	pinlen	:PIN code string length
	// * @param	[in]	pin		:PIN code strings
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothPairing = function(obj, pinlen, pin)
	{
		// Set Bluetooth device information property
		btCommLib_X.BtTargetName = obj.name; 	// Bluetooth device name
		btCommLib_X.BtTargetAddress = obj.addr; 	// Bluetooth device address

		var ret = btCommLib_X.btBluetoothPairing(pinlen, pin); // Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Release pairing between Bluetooth devices]
	// * @n
	// * @param	[in]	obj		:Bluetooth device information (BT_BLUETOOTH_TARGET class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothUnPairing = function(obj)
	{
		// Set Bluetooth device information property
		btCommLib_X.BtTargetName = obj.name; 	// Bluetooth device name
		btCommLib_X.BtTargetAddress = obj.addr; 	// Bluetooth device address

		var ret = btCommLib_X.btBluetoothUnPairing(); // Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Connect SPP profile]
	// * @n
	// * @param	[in]	obj		:Bluetooth device information (BT_BLUETOOTH_TARGET class)
	// * @param	[in]	timeout	:Connect timeout [ms]
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothSPPConnect = function(obj, timeout)
	{
		// Set Bluetooth device information property
		btCommLib_X.BtTargetName = obj.name; 	// Bluetooth device name
		btCommLib_X.BtTargetAddress = obj.addr; 	// Bluetooth device address

		var ret = btCommLib_X.btBluetoothSPPConnect(timeout); 	// Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Send data by SPP profile]
	// * @n
	// * @param	[in]	buffer	:Data to be sent
	// * @param	[in]	dsize	:Send data size [byte]
	// * @param	[out]	obj		:Actually send data size [byte] (CommSppDataSize class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothSPPSend = function(buffer, dsize, obj)
	{
		var ret = btCommLib_X.btBluetoothSPPSend(buffer, dsize); // Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			obj.size = btCommLib_X.SppSendDataSize; 	// Get Actually send data size property
		}
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Recieve data by SPP profile]
	// * @n
	// * @param	[out]	objBuf	:Recieve data buffer (CommSppRecvData class)
	// * @param	[in]	dsize	:Data size that can be received [byte]
	// * @param	[out]	objSize	:Actually received data size [byte] (CommSppDataSize class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothSPPRecv = function(objBuf, dsize, objSize)
	{
		var ret = btCommLib_X.btBluetoothSPPRecv(dsize); // Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			objBuf.data = btCommLib_X.SppRecvData; 		// Get Recieve data property
			objSize.size = btCommLib_X.SppRecvDataSize; 	// Get Recieve data size property
		}
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Disconnect SPP profile]
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Bluetooth.btBluetoothSPPDisconnect = function()
	{
		var ret = btCommLib_X.btBluetoothSPPDisconnect(); // Execute ActiveX method
		return ret;
	};

	//------------------------------------------------------------------------
	// Bt.CommLib.Wlan
	//------------------------------------------------------------------------
	//*********************************************************************************
	// * @brief	Function:@n	[Open Wireless LAN]
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Wlan.btWLANOpen = function()
	{
		var ret = btCommLib_X.btWLANOpen(); 	// Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Close Wireless LAN]
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Wlan.btWLANClose = function()
	{
		var ret = btCommLib_X.btWLANClose(); // Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Get MAC address of Wireless LAN]
	// * @n
	// * @param	[out]	obj		:MAC address of Wireless LAN (CommMacAddress class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Wlan.btWLANGetMacAddr = function(obj)
	{
		var ret = btCommLib_X.btWLANGetMacAddr(); // Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			obj.macaddr = btCommLib_X.WlanMacAddress; // Get MAC address of Wireless LAN
		}
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Get Wireless LAN status]
	// * @n
	// * @param	[out]	obj		:Wireless LAN status (CommStatus class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Wlan.btWLANGetStatus = function(obj)
	{
		var ret = btCommLib_X.btWLANGetStatus(); // Execute ActiveX method

		if (ret == Bt.LibDef.BT_OK)
		{
			obj.status = btCommLib_X.WlanStatus; // Get Wireless LAN status property
		}
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Get Radio signal level]
	// * @n
	// * @param	[in]	type	:Type
	// * @param	[out]	obj		:Signal level (CommWlanRadioLevel class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Wlan.btWLANGetSignalLevel = function(index, obj)
	{
		var ret = btCommLib_X.btWLANGetSignalLevel(index); 	// Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			switch (index)
			{
				case Bt.LibDef.BT_WLAN_TYPE_RSSI:
					obj.level = btCommLib_X.WlanLevelRssi; 	// RSSI
					break;
				case Bt.LibDef.BT_WLAN_TYPE_SNR:
					obj.level = btCommLib_X.WlanLevelSnr; 	// SNR
					break;
			}
		}
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Set Wireless LAN property]
	// * @n
	// * @param	[in]	id		:ID
	// * @param	[in]	obj		:Property value (CommWlanProp class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Wlan.btWLANSetProperty = function(id, obj)
	{
		// Set property
		switch (id)
		{
			case Bt.LibDef.BT_WLAN_PROP_NETMODE: 		// Wireless LAN connection mode
				btCommLib_X.WlanPropNetMode = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_PHY_TYPE: 		// 802.11 Physical Standards
				btCommLib_X.WlanPropPhyType = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_SCAN_TIMEOUT: 	// Scan timeout (per channel)
				btCommLib_X.WlanPropScanTimeout = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_CHANNEL_2_4GHZ: 	// Scan channel (2.4GHz)
				btCommLib_X.WlanPropScanCh_2_4GHz = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_CHANNEL_5GHZ: 	// Scan channel (5GHz)
				btCommLib_X.WlanPropScanCh_5GHz = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_ADHOC_MODE: 		// Adhoc communication mode
				btCommLib_X.WlanPropAdhocMode = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_ADHOC_BO_CHANNEL: 		// Adhoc beacon transmission channel (at beacon owner)
				btCommLib_X.WlanPropAdhocBoChannel = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_ENCRYPTION_INFRA: 		// Encryption mode (Infrastructure)
				btCommLib_X.WlanPropEncryptInfra = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_ENCRYPTION_ADHOC: 		// Encryption mode (Adhoc)
				btCommLib_X.WlanPropEncryptAdhoc = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_AUTHENTICATION_INFRA: 		// Authentication mode (Infrastructure)
				btCommLib_X.WlanPropAuthInfra = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_AUTHENTICATION_ADHOC: 		// Authentication mode (Adhoc)
				btCommLib_X.WlanPropAuthAdhoc = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_WEP_KEYINDEX_INFRA: 		// WEP key index (Infrastructure)
				btCommLib_X.WlanPropWepIndexInfra = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_WEP_KEYINDEX_ADHOC: 		// WEP key index (Adhoc)
				btCommLib_X.WlanPropWepIndexAdhoc = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_SERVER_AUTH_TIMEOUT: 		// Standby time of server authenticate
				btCommLib_X.WlanPropSvrAuthTimeout = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_OPENMODE: 				// Wireless LAN open mode
				btCommLib_X.WlanPropOpenMode = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_DHCP_CONN_TIMEOUT: 		// Wireless LAN DHCP connection timeout
				btCommLib_X.WlanPropDhcpTimeout = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_SSID_INFRA: 		// SSID (Infrastructure)
				btCommLib_X.WlanPropSsidInfra = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_SSID_ADHOC: 		// SSID (Adhoc)
				btCommLib_X.WlanPropSsidAdhoc = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_WEP_KEY1: 		// WEP key No.1 (Infrastructure)
				btCommLib_X.WlanPropWepKey1 = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_WEP_KEY2: 		// WEP key No.2 (Infrastructure)
				btCommLib_X.WlanPropWepKey2 = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_WEP_KEY3: 		// WEP key No.3 (Infrastructure)
				btCommLib_X.WlanPropWepKey3 = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_WEP_KEY4: 		// WEP key No.4 (Infrastructure)
				btCommLib_X.WlanPropWepKey4 = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_WEP_KEY_ADHOC: 		// WEP key (Adhoc)
				btCommLib_X.WlanPropWepKeyAdhoc = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_PSK_KEY: 			// PSK key strings
				btCommLib_X.WlanPropPskKey = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_EAP_USERNAME: 		// EAP authentication: User name
				btCommLib_X.WlanPropEapUserName = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_EAP_PASSWORD: 		// EAP authentication: Password
				btCommLib_X.WlanPropEapPassword = obj.prop;
				break;
			case Bt.LibDef.BT_WLAN_PROP_EAP_CLIENT_CERTIFICATION: 		// EAP client certificate
				btCommLib_X.WlanPropEapClientCert = obj.prop;
				break;
			default:
				break;
		}

		var ret = btCommLib_X.btWLANSetProperty(id); // Execute ActiveX method
		return ret;
	};

	//*********************************************************************************
	// * @brief	Function:@n	[Get Wireless LAN property]
	// * @n
	// * @param	[in]	id		:ID
	// * @param	[out]	obj		:Property value (CommWlanProp class)
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Wlan.btWLANGetProperty = function(id, obj)
	{
		var ret = btCommLib_X.btWLANGetProperty(id); // Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			// Get property
			switch (id)
			{
				case Bt.LibDef.BT_WLAN_PROP_NETMODE: 		// Wireless LAN connection mode
					obj.prop = btCommLib_X.WlanPropNetMode;
					break;
				case Bt.LibDef.BT_WLAN_PROP_PHY_TYPE: 		// 802.11 Physical Standards
					obj.prop = btCommLib_X.WlanPropPhyType;
					break;
				case Bt.LibDef.BT_WLAN_PROP_SCAN_TIMEOUT: 	// Scan timeout (per channel)
					obj.prop = btCommLib_X.WlanPropScanTimeout;
					break;
				case Bt.LibDef.BT_WLAN_PROP_CHANNEL_2_4GHZ: 	// Scan channel (2.4GHz)
					obj.prop = btCommLib_X.WlanPropScanCh_2_4GHz;
					break;
				case Bt.LibDef.BT_WLAN_PROP_CHANNEL_5GHZ: 	// Scan channel (5GHz)
					obj.prop = btCommLib_X.WlanPropScanCh_5GHz;
					break;
				case Bt.LibDef.BT_WLAN_PROP_ADHOC_MODE: 		// Adhoc communication mode
					obj.prop = btCommLib_X.WlanPropAdhocMode;
					break;
				case Bt.LibDef.BT_WLAN_PROP_ADHOC_BO_CHANNEL: 		// Adhoc beacon transmission channel (at beacon owner)
					obj.prop = btCommLib_X.WlanPropAdhocBoChannel;
					break;
				case Bt.LibDef.BT_WLAN_PROP_ENCRYPTION_INFRA: 		// Encryption mode (Infrastructure)
					obj.prop = btCommLib_X.WlanPropEncryptInfra;
					break;
				case Bt.LibDef.BT_WLAN_PROP_ENCRYPTION_ADHOC: 		// Encryption mode (Adhoc)
					obj.prop = btCommLib_X.WlanPropEncryptAdhoc;
					break;
				case Bt.LibDef.BT_WLAN_PROP_AUTHENTICATION_INFRA: 		// Authentication mode (Infrastructure)
					obj.prop = btCommLib_X.WlanPropAuthInfra;
					break;
				case Bt.LibDef.BT_WLAN_PROP_AUTHENTICATION_ADHOC: 		// Authentication mode (Adhoc)
					obj.prop = btCommLib_X.WlanPropAuthAdhoc;
					break;
				case Bt.LibDef.BT_WLAN_PROP_WEP_KEYINDEX_INFRA: 		// WEP key index (Infrastructure)
					obj.prop = btCommLib_X.WlanPropWepIndexInfra;
					break;
				case Bt.LibDef.BT_WLAN_PROP_WEP_KEYINDEX_ADHOC: 		// WEP key index (Adhoc)
					obj.prop = btCommLib_X.WlanPropWepIndexAdhoc;
					break;
				case Bt.LibDef.BT_WLAN_PROP_SERVER_AUTH_TIMEOUT: 		// Standby time of server authenticate
					obj.prop = btCommLib_X.WlanPropSvrAuthTimeout;
					break;
				case Bt.LibDef.BT_WLAN_PROP_OPENMODE: 				// Wireless LAN open mode
					obj.prop = btCommLib_X.WlanPropOpenMode;
					break;
				case Bt.LibDef.BT_WLAN_PROP_DHCP_CONN_TIMEOUT: 		// Wireless LAN DHCP connection timeout
					obj.prop = btCommLib_X.WlanPropDhcpTimeout;
					break;
				case Bt.LibDef.BT_WLAN_PROP_SSID_INFRA: 		// SSID (Infrastructure)
					obj.prop = btCommLib_X.WlanPropSsidInfra;
					break;
				case Bt.LibDef.BT_WLAN_PROP_SSID_ADHOC: 		// SSID (Adhoc)
					obj.prop = btCommLib_X.WlanPropSsidAdhoc;
					break;
				case Bt.LibDef.BT_WLAN_PROP_WEP_KEY1: 		// WEP key No.1 (Infrastructure)
					obj.prop = btCommLib_X.WlanPropWepKey1;
					break;
				case Bt.LibDef.BT_WLAN_PROP_WEP_KEY2: 		// WEP key No.2 (Infrastructure)
					obj.prop = btCommLib_X.WlanPropWepKey2;
					break;
				case Bt.LibDef.BT_WLAN_PROP_WEP_KEY3: 		// WEP key No.3 (Infrastructure)
					obj.prop = btCommLib_X.WlanPropWepKey3;
					break;
				case Bt.LibDef.BT_WLAN_PROP_WEP_KEY4: 		// WEP key No.4 (Infrastructure)
					obj.prop = btCommLib_X.WlanPropWepKey4;
					break;
				case Bt.LibDef.BT_WLAN_PROP_WEP_KEY_ADHOC: 		// WEP key (Adhoc)
					obj.prop = btCommLib_X.WlanPropWepKeyAdhoc;
					break;
				case Bt.LibDef.BT_WLAN_PROP_PSK_KEY: 			// PSK key strings
					obj.prop = btCommLib_X.WlanPropPskKey;
					break;
				case Bt.LibDef.BT_WLAN_PROP_EAP_USERNAME: 		// EAP authentication: User name
					obj.prop = btCommLib_X.WlanPropEapUserName;
					break;
				case Bt.LibDef.BT_WLAN_PROP_EAP_PASSWORD: 		// EAP authentication: Password
					obj.prop = btCommLib_X.WlanPropEapPassword;
					break;
				case Bt.LibDef.BT_WLAN_PROP_EAP_CLIENT_CERTIFICATION: 		// EAP client certificate
					obj.prop = btCommLib_X.WlanPropEapClientCert;
					break;
				default:
					break;
			}
		}
		return ret;
	};

	//------------------------------------------------------------------------
	// Bt.CommLib.Snmp
	//------------------------------------------------------------------------
	//*********************************************************************************
	// * @brief	Function:@n	[Send SNMP monitoring information]
	// * @n
	// * @return	Refer to the terminal library reference
	//*********************************************************************************
	CommLib.Snmp.btSendSNMPMonitorInfo = function()
	{
		var ret = btCommLib_X.btSendSNMPMonitorInfo(); // Execute ActiveX method
		return ret;
	};

})();

