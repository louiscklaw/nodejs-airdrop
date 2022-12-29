const path = require("path");
const fs = require("fs");

const express = require("express");
const fupload = require("express-fileupload");

const { hotreload, engine } = require("express-handlebars-hotreload");

const { printNetowrkInstructrion } = require("./printip.js");


const config = {
  CWD: process.cwd(),
  TMP_DIR: process.cwd() + '/tmp',
  VIEWS_DIR: process.cwd() + '/views',
  FOLDER: process.cwd() + '/tmp',
  PORT: 3000,
};

console.log(config);

if (process.env.NODE_ENV !== 'production') hotreload();

var app = express();

app.engine(
  'handlebars',
  engine({
    hotreload: process.env.NODE_ENV !== 'production',
  }),
);
app.set('view options', { layout: 'main' });
app.set('view engine', 'handlebars');
app.set('views', config.VIEWS_DIR);

app.use(fupload({ useTempFiles: true, tempFileDir: config.TMP_DIR }));

app.get('/', function (req, res) {
  // list all files in the directory
  returnFilesInDirRelative(FOLDER)
    .then(function (files) {
      let stats = returnFStatsSync(files, FOLDER);
      res.status(200).render('directoryPage', {
        files: files
          .map(function (f, index) {
            return {
              fileName: f,
              dateModifed: getModifiedTimeString(stats[index].mtimeMs),
              size: (stats[index].size / 1024 / 1024).toFixed(3),
              _dmsort: stats[index].mtimeMs,
            };
          })
          .sort(function (el, la) {
            if (el._dmsort > la._dmsort) {
              return -1;
            } else if (el._dmsort < la._dmsort) {
              return 1;
            } else {
              return 0;
            }
          }),
      });
    })
    .catch(function (err) {
      res.status(300).send(err);
    });
});

app.get('/upload', function (req, res, next) {
  res.status(200).render('uploadPage');
});

app.post('/upload', function (req, res, next) {
  const fname = req.query.supercoolfile;

  if (req.files.supercoolfile.size) {
    console.log(path.join(config.FOLDER, req.files.supercoolfile.name));
    req.files.supercoolfile.mv(
      path.join(config.FOLDER, req.files.supercoolfile.name),
      err => {
        if (err) {
          res.status(300).send(err);
        }
        // if upload successful
        res.status(200).render('uploadSuccessful');
      },
    );
  } else {
    // if upload not successful
    res.status(300).render('uploadNotSuccessful');
  }
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
    fs.readdir(FOLDER, (err, files) => {
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
