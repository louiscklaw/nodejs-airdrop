// const path = require('path');
// const fs = require('fs');
// const glob = require('glob');

// const getUploadDir = (baseURL, _uploadid) => `${baseURL}/${_uploadid}`;

const express = require('express');
const fupload = require('express-fileupload');
// const zip = require('express-zip');
// const router = express.Router()

const { hotreload, engine } = require('express-handlebars-hotreload');

const { printNetowrkInstructrion } = require('./printip.js');
const { PUBLIC_DIR, VIEWS_DIR, TMP_DIR, PORT, FOLDER } = require('./config.js');
// const { sendHelloworldGroupMessage } = require('./util/sendTelegramMessage.js');

const is_develop = process.env.NODE_ENV !== 'production';

// const PROCESS_NOT_SUCCESS = 0;
// const PROCESS_SUCCESS = 1;

// const HOST = is_develop ? 'localhost:3000' : process.env.HOST;

if (is_develop) hotreload();

// const debugLog = o => (is_develop ? console.log(o) : '');
// debugLog({ 'running config': config });

// var upload_id_list = {};

var app = express();

app.engine('handlebars', engine());
// app.engine(
//   'handlebars',
//   engine({
//     hotreload: is_develop,
//   }),
// );
app.set('view options', { layout: 'main' });

app.set('view engine', 'handlebars');
app.set('views', VIEWS_DIR);

app.use(express.static(PUBLIC_DIR));
app.use(fupload({ useTempFiles: true, tempFileDir: TMP_DIR }));

app.use('/g', require('./routes/g/_uploadid'));
app.use('/uploadNotSuccessful', require('./routes/uploadNotSuccessful'));
app.use('/uploadSuccessful', require('./routes/upload_done'));

// NOTE: to be obsolete
app.use('/upload_done', require('./routes/upload_done'));

app.use('/upload', require('./routes/upload'));
app.use('/helloworld', require('./routes/helloworld'));

app.get('/', (req, res) => {
  res.redirect('/upload');
});

app.listen(PORT, function (err) {
  if (err) {
    console.log(err);
  } else {
    printNetowrkInstructrion(PORT, FOLDER);
  }
});

console.log('end');
