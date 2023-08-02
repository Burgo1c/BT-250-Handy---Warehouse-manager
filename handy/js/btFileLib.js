// *******************************************************************************
// **	Copyright(c) 2012-2014 Keyence Corporation. All rights reserved
// **	File Name: btFileLib.js
// **
// **	Function	: Terminal Library JavaScript File (File control)
// **	Notes		: None
// **
// ********************************************************************************

//Create Namespace
var Bt;
if( !Bt ){
	Bt = {};							// Namespace "Bt"
}
if( !Bt.FileLib ){
	Bt.FileLib = {};					// Namespace "Bt.FileLib"
}
if( !Bt.FileLib.Def ){
	Bt.FileLib.Def = {};				// Namespace "Bt.FileLib.Def"
}
if (!Bt.FileLib.File){
	Bt.FileLib.File = {};				// Namespace "Bt.FileLib.File"
}
if (!Bt.FileLib.Sound){
	Bt.FileLib.Sound = {};				// Namespace "Bt.FileLib.Sound"
}

//Functions in Namespace

(function() {

	var FileLib = Bt.FileLib;

	//------------------------------------------------------------------------
	// Bt.FileLib.File
	//------------------------------------------------------------------------
	//********************************************************************************
	// * @brief	Function:@n	[File Open]
	// * @n
	// * @param	[in]	filename:File name
	// * @param	[in]	enctype	:Encode type
	// * @param	[in]	mode	:Operation mode
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.File.btFileOpen = function(filename, enctype, mode)
	{
		var ret = btFileLib_X.btFileOpen(filename, enctype, mode);	// Execute ActiveX method
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Close]
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.File.btFileClose = function()
	{
		var ret = btFileLib_X.btFileClose();	// Execute ActiveX method
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Write]
	// * @n
	// * @param	[in]	data	:Write strings
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.File.btFileWrite = function(data)
	{
		var ret = btFileLib_X.btFileWrite(data);	// Execute ActiveX method
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Write (add Line feed code)]
	// * @n
	// * @param	[in]	data	:Write strings
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.File.btFileWriteln = function(data)
	{
		var ret = btFileLib_X.btFileWriteln(data);	// Execute ActiveX method
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Read]
	// * @n
	// * @param	[in]	length	:Read string length
	// * @param	[out]	objBuf	:Read data buffer (FileReadData class)
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.File.btFileRead = function(length, objBuf)
	{
		var ret = btFileLib_X.btFileRead(length);	// Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			objBuf.data = btFileLib_X.FileReadData; 	// Get Read data property
		}
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Read (one line)]
	// * @n
	// * @param	[out]	objBuf	:Read data buffer (FileReadData class)
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.File.btFileReadln = function(objBuf)
	{
		var ret = btFileLib_X.btFileReadln();	// Execute ActiveX method
		if (ret == Bt.LibDef.BT_OK)
		{
			objBuf.data = btFileLib_X.FileReadData; 	// Get Read data property
		}
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Copy]
	// * @n
	// * @param	[in]	orig_file	:Source file name
	// * @param	[in]	new_file	:Create file name
	// * @param	[in]	overwrite	:Overwrite flag
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.File.btFileCopy = function(orig_file, new_file, overwrite)
	{
		var ret = btFileLib_X.btFileCopy(orig_file, new_file, overwrite);	// Execute ActiveX method
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Rename]
	// * @n
	// * @param	[in]	orig_file	:Source file name
	// * @param	[in]	new_file	:Change file name
	// * @param	[in]	overwrite	:Overwrite flag
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************/
	FileLib.File.btFileRename = function(orig_file, new_file)
	{
		var ret = btFileLib_X.btFileRename(orig_file, new_file);	// Execute ActiveX method
		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[File Delete]
	// * @n
	// * @param	[in]	filename	:Delete file name
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************/
	FileLib.File.btFileDelete = function(filename)
	{
		var ret = btFileLib_X.btFileDelete(filename);	// Execute ActiveX method
		return ret;
	};

	//------------------------------------------------------------------------
	// Bt.FileLib.Sound
	//------------------------------------------------------------------------
	//********************************************************************************
	// * @brief	Function:@n	[Register Pseudo WAVE settings]
	// * @n
	// * @param	[in]	filepath:File path
	// * @param	[in]	buz		:Buzzer control parameters class (BT_BUZZER_PARAM class)
	// * @param	[in]	vib		:Vibrator control parameters class (BT_VIBRATOR_PARAM class)
	// * @param	[in]	led		:LED control parameters class (BT_LED_PARAM class)
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.Sound.btSetPseudoWave = function(filepath, buz, vib, led)
	{
		// Set to Buzzer control property
		btFileLib_X.BuzzerOn = buz.on;				// ON period
		btFileLib_X.BuzzerOff = buz.off;			// OFF period
		btFileLib_X.BuzzerCount = buz.count;		// Repeat count
		btFileLib_X.BuzzerTone = buz.tone;			// Tone
		btFileLib_X.BuzzerVolume = buz.volume;		// Volume

		// Set to Vibrator control property
		btFileLib_X.VibOn = vib.on;					// ON period
		btFileLib_X.VibOff = vib.off;				// OFF period
		btFileLib_X.VibCount = vib.count;			// Repeat count

		// Set to LED control property
		btFileLib_X.LedOn = led.on;					// ON period
		btFileLib_X.LedOff = led.off;				// OFF period
		btFileLib_X.LedCount = led.count;			// Repeat count
		btFileLib_X.LedColor = led.color;			// Color

		var ret = btFileLib_X.btSetPseudoWave(filepath);		// Execute ActiveX method

		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[Query Pseudo WAVE settings]
	// * @n
	// * @param	[in]	filename:File name
	// * @param	[out]	buz		:Buzzer control parameters class (BT_BUZZER_PARAM class)
	// * @param	[out]	vib		:Vibrator control parameters class (BT_VIBRATOR_PARAM class)
	// * @param	[out]	led		:LED control parameters class (BT_LED_PARAM class)
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.Sound.btGetPseudoWave = function(filename, buz, vib, led)
	{

		var ret = btFileLib_X.btGetPseudoWave(filename);		// Execute ActiveX method

		if (ret == Bt.LibDef.BT_OK){
			// Get from Buzzer control property
			buz.on = btFileLib_X.BuzzerOn;				// ON period
			buz.off = btFileLib_X.BuzzerOff;			// OFF period
			buz.count = btFileLib_X.BuzzerCount;		// Repeat count
			buz.tone = btFileLib_X.BuzzerTone;			// Tone
			buz.volume = btFileLib_X.BuzzerVolume;		// Volume

			// Get from Vibrator control property
			vib.on = btFileLib_X.VibOn;					// ON period
			vib.off = btFileLib_X.VibOff;				// OFF period
			vib.count = btFileLib_X.VibCount;			// Repeat count

			// Get from LED control property
			led.on = btFileLib_X.LedOn;					// ON period
			led.off = btFileLib_X.LedOff;				// OFF period
			led.count = btFileLib_X.LedCount;			// Repeat count
			led.color = btFileLib_X.LedColor;			// Color
		}

		return ret;
	};

	//********************************************************************************
	// * @brief	Function:@n	[Delete Pseudo WAVE settings]
	// * @n
	// * @param	[in]	filename:File name
	// * @n
	// * @return	Refer to the terminal library reference
	//********************************************************************************
	FileLib.Sound.btDeletePseudoWave = function(filename)
	{
		var ret = btFileLib_X.btDeletePseudoWave(filename);		// Execute ActiveX method

		return ret;
	};

})();
