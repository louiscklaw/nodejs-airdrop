const glob = require('glob');

const express = require('express');
const router = express.Router();

const zip = require('express-zip');

const { FOLDER } = require('../../config');

router.get('/', async (req, res) => {
  console.log(req.params);
  var { _uploadid } = req.params;

  var UPLOAD_PATH = FOLDER + '/' + _uploadid + '/';
  // res.zip([
  //   { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' },
  //   { path: '/path/to/file2.name', name: 'file2.name' },
  // ]);

  var file_need_to_compress = await glob(FOLDER + '/' + _uploadid + '/**', { sync: true });

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

module.exports = router;
