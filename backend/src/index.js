const path = require('path');
const fs = require('fs');
const glob = require('glob');

const express = require('express');
const fupload = require('express-fileupload');
const zip = require('express-zip');
const router = express.Router()

const shortid = require('shortid');

const { hotreload, engine } = require('express-handlebars-hotreload');

const { printNetowrkInstructrion } = require('./printip.js');
const { sendHelloworldGroupMessage } = require('./util/sendTelegramMessage.js');

const is_develop = process.env.NODE_ENV !== 'production';

const PROCESS_NOT_SUCCESS = 0;
const PROCESS_SUCCESS = 1;

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

app.use(express.static('public'));

app.use(fupload({ useTempFiles: true, tempFileDir: config.TMP_DIR }));

app.get('/g/:_uploadid', async function (req, res, next) {
  console.log(req.params);
  var { _uploadid } = req.params;

  var UPLOAD_PATH = config.FOLDER + '/' + _uploadid + '/';
  // res.zip([
  //   { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' },
  //   { path: '/path/to/file2.name', name: 'file2.name' },
  // ]);

  var file_need_to_compress = await glob(config.FOLDER + '/' + _uploadid + '/**', { sync: true });

  // helloworld.txt
  file_need_to_compress = file_need_to_compress.filter(f => f.search(/.+\/.+\..*/) != -1);

  // returnFilesInDirRelative(config.FOLDER + '/' + _uploadid).then(files => {
  //   console.log(files);
  // });
  var filename_in_zip = file_need_to_compress.map(f => {
    return {
      path: f,
      name: f.replace(UPLOAD_PATH, ''),
    };
  });

  console.log(filename_in_zip);

  res.zip(filename_in_zip);
});

app.get('/upload', function (req, res, next) {
  const _uploadid = shortid.generate();

  upload_id_list[_uploadid] = { valid_until: Date.now() + 300 };

  res.status(200).render('uploadPage', {
    _uploadid: _uploadid,
    HOST: HOST
  });
});

const getUploadDir = (baseURL, _uploadid) => `${baseURL}/${_uploadid}`;

app.get('/upload_done', function (req, res, next) {
  var _uploadid = 'xxxxxxxx';
  var baseURL = 'https://www.google.com';
  var _uploadid = 'uuuuuuuu';

  var upload_link = getUploadDir(baseURL, _uploadid);
  var upload_link_carousell = `${baseURL}/${_uploadid}`.replace('http', 'ttp');

  res.status(200).render('uploadSuccessful', {
    upload_link,
    upload_link_carousell,
    HOST: HOST
  });
});

app.post('/upload', function (req, res, next) {
  // const fname = req.query.supercoolfile;
  var all_result, overall_result;

  try {
    console.log(req.body?._uploadid);
    if (!req.body?._uploadid) overall_result = PROCESS_NOT_SUCCESS;

    let { _uploadid } = req.body;
    const NOW_FOLDER = ['u', _uploadid].join('-');
    const STORE_FOLODER = config.FOLDER + '/' + NOW_FOLDER;

    if (upload_id_list[_uploadid]) {
      // const _uploadid = shortid.generate();
      // const TIME_NOW = Date.now();

      // if no file -> error
      if (req.files == null) return PROCESS_NOT_SUCCESS;

      // if one file -> not array
      console.log({ test: req.files.supercoolfile.name });
      if (req.files.supercoolfile?.name != undefined) {
        if (!fs.existsSync(STORE_FOLODER)) fs.mkdirSync(STORE_FOLODER);

        file = req.files.supercoolfile;
        file.mv(path.join(STORE_FOLODER, file.name), err => {
          if (err) return PROCESS_NOT_SUCCESS;

          return PROCESS_SUCCESS;
        });

        overall_result = true;
      }

      // if more than one file -> array
      // console.log({ test: typeof req.files.supercoolfile == typeof [] });

      if (req.files.supercoolfile?.length > 1) {
        if (!fs.existsSync(STORE_FOLODER)) fs.mkdirSync(STORE_FOLODER);

        all_result = req.files.supercoolfile.map((file, idx) => {
          file.mv(path.join(STORE_FOLODER, file.name), err => {
            if (err) return PROCESS_NOT_SUCCESS;

            return PROCESS_SUCCESS;
          });
        });

        // if no fail then pass
        overall_result = all_result.filter(r => r == PROCESS_NOT_SUCCESS).length <= 0;
      }

      debugLog({ overall_result });

      // delete key after success upload
      delete upload_id_list[_uploadid];
    } else {
      // upload id not found
      overall_result = PROCESS_NOT_SUCCESS;
    }
    // if (upload_id_list[])

    if (overall_result == PROCESS_SUCCESS) {
      var upload_link = `${config.baseURL}/g/${NOW_FOLDER}`;
      var upload_link_carousell = `${config.baseURL}/g/${NOW_FOLDER}`.replace('http', 'ttp');

      res.status(200).render('uploadSuccessful', {
        upload_link,
        upload_link_carousell,
        HOST: HOST
      });
      // publishMessage('general', `a file uploaded ${upload_link} :tada:`);
      sendHelloworldGroupMessage(`a file uploaded ${upload_link} :tada:`);
    } else {
      res.status(300).redirect('/uploadNotSuccessful', { HOST: HOST });
    }

    // house keep upload_id_list
    for (const [k, v] of Object.entries(upload_id_list)) {
      if (v?.valid_until > Date.now()) {
        // upload_id still valid
      } else {
        // clear invalid key due to timeout
        delete upload_id_list[k];
      }
    }
  } catch (error) {
    res.status(300).redirect('/uploadNotSuccessful', { HOST: HOST });
  }
});

app.get('/uploadNotSuccessful', (req, res) => {
  console.log('hello unsuccessful');
  res.status(300).render('uploadNotSuccessful', { HOST: HOST });
});

app.use('/helloworld', require('./routes/helloworld'));

app.get('/', (req, res) => {
  res.redirect('/upload');
});

app.listen(config.PORT, function (err) {
  if (err) {
    console.log(err);
  } else {
    printNetowrkInstructrion(config.PORT, config.FOLDER);
  }
});

console.log('helloworld 1111');

