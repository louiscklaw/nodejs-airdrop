const path = require('path');
const fs = require('fs');

const express = require('express');
const fileUpload = require('express-fileupload');

var app = express();
app.use(express.static('public'));
app.use(fileUpload());

app.post('/upload', function(req, res) {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  console.log(req.files.sampleFile.length);

  sampleFile = req.files.sampleFile;
  // uploadPath = __dirname + '/somewhere/on/your/server/' + sampleFile.name;
  uploadPath = sampleFile.name;

  // // Use the mv() method to place the file somewhere on your server
  // sampleFile.mv(uploadPath, function(err) {
  //   if (err)
  //     return res.status(500).send(err);

  //   res.send('File uploaded!');
  // });
});

try {
  app.listen(8000, function (err) {
    if (err) console.log(err);
    console.log('express server started at port 8000')
  });
} catch (error) {
  console.log(error);
  console.log('app listen ended');
}
