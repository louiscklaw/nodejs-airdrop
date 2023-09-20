const express = require('express');
const router = express.Router();

const getUploadDir = require('../util/getUploadDir');
const { HOST } = require('../config');

router.get('/', (req, res) => {
  var _uploadid = 'xxxxxxxx';
  var baseURL = 'https://www.google.com';
  var _uploadid = 'uuuuuuuu';

  var upload_link = getUploadDir(baseURL, _uploadid);
  var upload_link_carousell = `${baseURL}/${_uploadid}`.replace('http', 'ttp');

  res.status(200).render('uploadSuccessful', {
    upload_link,
    upload_link_carousell,
    HOST: HOST,
  });
});

module.exports = router;
