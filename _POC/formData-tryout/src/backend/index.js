const express = require('express');
const fileUpload = require('express-fileupload');

const FILE_UPLOADED = 'FILE_UPLOADED';
const UPLOAD_ERROR = 'UPLOAD_ERROR';

var app = express();
app.use(express.static('public'));
app.use(fileUpload());

app.post('/upload', function (req, res) {
  let output = { state: 'init', debug: {}, error: '' };

  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let uploaded_file_names = Object.keys(req.files);
    console.log({ uploaded_files: uploaded_file_names });
    output = {...output, uploaded_file_names};

    for (let i = 0; i < uploaded_file_names.length; i++) {
      let f_name = uploaded_file_names[i];
      let uploaded_file = req.files[f_name];
      let target_path = './upload/' + f_name;

      uploaded_file.mv(target_path, err => {
        try {
          if (err) throw err
          // throw new Error('blablabla');
        } catch (error) {
          console.log({target_path, output, err_message: error.message})
          throw error
        }
      });
    }

    output = { ...output, state: FILE_UPLOADED };

    res.send(output);
  } catch (error) {
    // prepare user error reply
    let reply = { ...output, state: UPLOAD_ERROR, error: error.message };

    // locally log error
    output = { ...output, debug: { req } };
    console.log(output);

    // reply to request and end
    res.status(500).send(reply);
  }

});

try {
  app.listen(8000, function (err) {
    if (err) console.log(err);
    console.log('express server started at port 8000');
  });
} catch (error) {
  console.log(error);
  console.log('app listen ended');
}
