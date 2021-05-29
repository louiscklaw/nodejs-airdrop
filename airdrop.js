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
 PORT = PORT || 80;
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

function returnFilesInDirRelative(relativeDir){
	return new Promise(function(res,rej){
		fs.readdir(FOLDER, (err, files) => {
			if (err) {
					rej(err)
			} else {
				res(files)
			}
		})
	})
}

function returnFStatsSync(files,relativeDir){
	let stats = []
	try {
			files.forEach(function(fileName){
				const stat = fs.statSync(relativeDir+fileName)
				stats.push(stat)
			})
		} catch (err) {
			print(err)
		}
	return stats;
}

function getModifiedTimeString(timestamp){
	let elapsed = Date.now() - timestamp;
	let str = "seconds ago"
	elapsed /= 1000 // seconds
	if(elapsed / 60 > 1){
		str = "minutes ago"
		elapsed /= 60
	}
	if(elapsed / 60 > 1){
		str = "hours ago"
		elapsed /= 60

		if(elapsed / 24 > 1){
			str = "days ago"
			elapsed /= 24
		}
	}
	return `${elapsed.toFixed(0)} ${str}`;
}

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

app.get("/",function(req,res){
// list all files in the directory
	returnFilesInDirRelative(FOLDER)
	.then(function(files){
		let stats = returnFStatsSync(files,FOLDER)
		res.status(200).render("directoryPage",{
			 files: files.map(function(f,index){
				 return {
					 fileName: f,
					 dateModifed: getModifiedTimeString(stats[index].mtimeMs),
					 size: (stats[index].size / 1024 / 1024).toFixed(3),
					 _dmsort: stats[index].mtimeMs,
				 }
			 }).sort(function(el,la){
				 if (el._dmsort > la._dmsort) {
				    return -1;
				  }
				 else if (el._dmsort < la._dmsort) {
				    return 1;
				  }
					else {
						return 0;
					}
			 }),
		 });
	})
	.catch(function(err){
		res.status(300).send(err)
	})
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
