const path = require("path");
const fs = require("fs");
const glob = require('glob');

const express = require('express');
const fupload = require('express-fileupload');
const zip = require('express-zip');

const shortid = require('shortid');

const { hotreload, engine } = require('express-handlebars-hotreload');

const { printNetowrkInstructrion } = require('./printip.js');

const is_develop = process.env.NODE_ENV !== 'production';

const HOST = is_develop ? 'localhost:3000' : 'share.louislabs.com';
const config = {
  CWD: process.cwd(),
  TMP_DIR: process.cwd() + '/tmp',
  VIEWS_DIR: process.cwd() + '/views',
  FOLDER: process.cwd() + '/tmp',
  PORT: 3000,
  baseURL: `http://${HOST}`,
};

console.log(config);

if (is_develop) hotreload();

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

app.get('/', function (req, res) {
  res.send('helloworld');
  // list all files in the directory
});

app.get('/g/:_uploadid', async function (req, res, next) {
  console.log(req.params);
  var { _uploadid } = req.params;

  var UPLOAD_PATH = config.FOLDER + '/' + _uploadid + '/';
  // res.zip([
  //   { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' },
  //   { path: '/path/to/file2.name', name: 'file2.name' },
  // ]);

  var file_need_to_compress = await glob(
    config.FOLDER + '/' + _uploadid + '/**',
    { sync: true },
  );

  // helloworld.txt
  file_need_to_compress = file_need_to_compress.filter(
    f => f.search(/.+\/.+\..*/) != -1,
  );

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
  res.status(200).render('uploadPage');
});

const getUploadDir = (baseURL, _uploadid) => `${baseURL}/${_uploadid}`;

app.get('/upload_done', function (req, res, next) {
  var _uploadid = 'xxxxxxxx';
  var baseURL = 'http://www.google.com';
  var _uploadid = 'uuuuuuuu';

  var upload_link = getUploadDir(baseURL, _uploadid);
  var upload_link_carousell = `${baseURL}/${_uploadid}`.replace('http', 'ttp');

  res.status(200).render('uploadSuccessful', {
    upload_link,
    upload_link_carousell,
  });
});

app.post('/upload', function (req, res, next) {
  const fname = req.query.supercoolfile;

  const PROCESS_NOT_SUCCESS = 0;
  const PROCESS_SUCCESS = 1;
  var all_result, overall_result;

  const _uploadid = shortid.generate();

  const TIME_NOW = Date.now();
  const NOW_FOLDER = TIME_NOW + '-' + _uploadid;
  const STORE_FOLODER = config.FOLDER + '/' + NOW_FOLDER;

  if (!fs.existsSync(STORE_FOLODER)) fs.mkdirSync(STORE_FOLODER);

  all_result = req.files.supercoolfile.map((file, idx) => {
    file.mv(path.join(STORE_FOLODER, file.name), err => {
      if (err) return PROCESS_NOT_SUCCESS;

      return PROCESS_SUCCESS;
    });
  });

  // if any case false => failure
  overall_result = all_result.filter(r => r == false).length <= 0;

  console.log({ overall_result });

  if (!overall_result) {
    res.status(300).render('uploadNotSuccessful');
  }

  var upload_link = `${config.baseURL}/g/${NOW_FOLDER}`;
  var upload_link_carousell = `${config.baseURL}/g/${NOW_FOLDER}`.replace(
    'http',
    'ttp',
  );

  res.status(200).render('uploadSuccessful', {
    upload_link,
    upload_link_carousell,
  });
});

app.listen(config.PORT, function (err) {
  if (err) {
    console.log(err);
  } else {
    printNetowrkInstructrion(config.PORT, config.FOLDER);
  }
});

function returnFilesInDirRelative(relativeDir) {
  return new Promise(function (res, rej) {
    fs.readdir(relativeDir, (err, files) => {
      if (err) {
        rej(err);
      } else {
        res(files);
      }
    });
  });
}

function getModifiedTimeString(timestamp) {
  let elapsed = Date.now() - timestamp;
  let str = "seconds ago";
  elapsed /= 1000; // seconds
  if (elapsed / 60 > 1) {
    str = "minutes ago";
    elapsed /= 60;
  }
  if (elapsed / 60 > 1) {
    str = "hours ago";
    elapsed /= 60;

    if (elapsed / 24 > 1) {
      str = "days ago";
      elapsed /= 24;
    }
  }
  return `${elapsed.toFixed(0)} ${str}`;
}

function returnFStatsSync(files, relativeDir) {
  let stats = [];
  try {
    files.forEach(function (fileName) {
      const stat = fs.statSync(relativeDir + fileName);
      stats.push(stat);
    });
  } catch (err) {
    print(err);
  }
  return stats;
}
