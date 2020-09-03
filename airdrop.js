const express = require('express');
const fupload = require("express-fileupload")
var ViewEngine = require('express-handlebars');
const path = require('path')
const fs = require('fs');

const {printNetowrkInstructrion} = require("./printip.js");


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

var PORT = process.env.PORT;
var FOLDER = process.env.folder;
var app = express();



if(!PORT || !FOLDER){
	for(var i=0;i<process.argv.length;i++){
		if(process.argv[i] == "-p" || process.argv[i]== "--port"){
			if(i+1<process.argv.length){
				PORT = parseInt(process.argv[i+1]);
			}
		}

		if(process.argv[i] == "-f" || process.argv[i]=="--folder"){
			if(i+1<process.argv.length){
				FOLDER = process.argv[i+1];
			}
		}
	}
}

if(!PORT || !FOLDER){
 PORT = PORT || 3000;
 FOLDER = FOLDER || "../";
}


app.engine('handlebars', ViewEngine());
app.set('view options', { layout: 'main' });
app.set('view engine', 'handlebars');
app.set("views",__dirname+ "/views");

app.use( fupload({
	useTempFiles : true,
	tempFileDir : __dirname+'/tmp'
}));
app.use(express.static(path.join(__dirname,FOLDER)));


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;



app.get("/",function(req,res){
// list all files in the directory
	fs.readdir(FOLDER, (err, files) => {
    if (err) {
        res.status(300).send(err)
    }
		res.status(200).render("directoryPage",{
			 files: files.map(function(f){
				 return {f}
			 })
		 });


		});
})

app.get("/upload",function(req,res,next){
	res.status(200).render("uploadPage");
});


app.post("/upload",function(req,res,next){
	const fname = req.query.supercoolfile;
	if(req.files.supercoolfile.size){
		req.files.supercoolfile.mv(path.join(__dirname,FOLDER,req.files.supercoolfile.name),function(err){
			if(err){
				res.status(300).send(err)
			}
			res.status(200).render("uploadSuccessful");
		});
	}
	else{
		res.status(300).render("uploadNotSuccessful")
	}


});



app.listen(PORT,function(err){

	if(err){
		console.log(err);
	}
	else{
		printNetowrkInstructrion(PORT,FOLDER)
	}
});


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
