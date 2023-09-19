// const path = require('path');
// const fs = require('fs');
const glob = require('glob');

// const getUploadDir = (baseURL, _uploadid) => `${baseURL}/${_uploadid}`;

const express = require('express');
const fupload = require('express-fileupload');
// const zip = require('express-zip');
// const router = express.Router()


const { hotreload, engine } = require('express-handlebars-hotreload');

const { printNetowrkInstructrion } = require('./printip.js');
const { PUBLIC_DIR } = require('./config.js');
// const { sendHelloworldGroupMessage } = require('./util/sendTelegramMessage.js');

const is_develop = process.env.NODE_ENV !== 'production';

// const PROCESS_NOT_SUCCESS = 0;
// const PROCESS_SUCCESS = 1;

const HOST = is_develop ? 'localhost:3000' : process.env.HOST;
const config = {
  CWD: process.cwd(),
  TMP_DIR: process.cwd() + '/tmp',
  VIEWS_DIR: process.cwd() + '/views',
  FOLDER: process.cwd() + '/tmp',
  PORT: 3000,
  baseURL: `https://${HOST}`,
};

if (is_develop) hotreload();

const debugLog = o => (is_develop ? console.log(o) : '');

debugLog({ 'running config': config });

var upload_id_list = {};

var app = express();

app.engine(
  'handlebars',
  engine({
    hotreload: is_develop,
  }),
);
app.set('view options', { layout: 'main' });
app.set('view engine', 'handlebars');
app.set('views', config.VIEWS_DIR);

app.use(express.static(PUBLIC_DIR));
app.use(fupload({ useTempFiles: true, tempFileDir: config.TMP_DIR }));

// app.get('/g/:_uploadid', async function (req, res, next) {
//   console.log(req.params);
//   var { _uploadid } = req.params;

//   var UPLOAD_PATH = config.FOLDER + '/' + _uploadid + '/';
//   // res.zip([
//   //   { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' },
//   //   { path: '/path/to/file2.name', name: 'file2.name' },
//   // ]);

//   var file_need_to_compress = await glob(config.FOLDER + '/' + _uploadid + '/**', { sync: true });

//   // helloworld.txt
//   file_need_to_compress = file_need_to_compress.filter(f => f.search(/.+\/.+\..*/) != -1);

//   // returnFilesInDirRelative(config.FOLDER + '/' + _uploadid).then(files => {
//   //   console.log(files);
//   // });
//   var filename_in_zip = file_need_to_compress.map(f => {
//     return {
//       path: f,
//       name: f.replace(UPLOAD_PATH, ''),
//     };
//   });

//   console.log(filename_in_zip);

//   res.zip(filename_in_zip);
// });

// app.use('/g/:_uploadid', require('./routes/g/_uploadid.js'));

app.use('/upload', require('./routes/upload'));

app.use('/upload_done', require('./routes/upload_done'));
app.use('/uploadNotSuccessful', require('./routes/uploadNotSuccessful'));
app.use('/helloworld', require('./routes/helloworld'));

// app.get('/', (req, res) => {
//   res.redirect('/upload');
// });

app.listen(config.PORT, function (err) {
  if (err) {
    console.log(err);
  } else {
    printNetowrkInstructrion(config.PORT, config.FOLDER);
  }
});

console.log('helloworld 1111');

