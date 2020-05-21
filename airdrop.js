const express = require('express');

const PORT = process.env.PORT || 31005;
const IP = process.env.ip1 || process.env.ip2 || process.env.ip3;
const FOLDER = process.env.folder || "public";

var app = express();


app.use(express.static(FOLDER));


app.listen(PORT,function(err){

	if(err){
		console.log(err);
	}
	else{
		console.log(`Visit http://${IP}:${PORT} on your localnetwork, and to download files:`);
		console.log(`Simply navigate to the filename in the url, it will check in the folder that is logged here:"${FOLDER}"`);
	}
});
