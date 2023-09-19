const path = require('path');
const fs = require('fs');
const glob = require('glob');

const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const { HOST, PROCESS_NOT_SUCCESS, FOLDER, PROCESS_SUCCESS, baseURL } = require('../config');

const { sendHelloworldGroupMessage } = require('../util/sendTelegramMessage.js');

router.get('/', (req, res) => {
  const _uploadid = shortid.generate();

  res.status(200).render('uploadPage', {
    _uploadid,
    HOST,
  });
});

router.post('/', (req, res, next) => {
  // const fname = req.query.supercoolfile;
  let output = { state: 'init', debug: {}, error: '' };

  var all_result, overall_result;

  try {
    console.log(req.body?._uploadid);
    if (!req.body?._uploadid) overall_result = PROCESS_NOT_SUCCESS;

    let { _uploadid } = req.body;
    const NOW_FOLDER = ['u', _uploadid].join('-');
    const STORE_FOLODER = FOLDER + '/' + NOW_FOLDER;

    // if one file -> not array
    console.log({ test: req.files.supercoolfile.name });

    if (req.files.supercoolfile.name != undefined) {
      console.log('single file uploaded');
      if (!fs.existsSync(STORE_FOLODER)) fs.mkdirSync(STORE_FOLODER);

      file = req.files.supercoolfile;
      file.mv(path.join(STORE_FOLODER, file.name), err => {
        if (err) return PROCESS_NOT_SUCCESS;

        console.log({STORE_FOLODER});

        return PROCESS_SUCCESS;
      });

      overall_result = true;
    } else if (req.files.supercoolfile.length > 1) {
      console.log('multiple file uploaded');
      if (!fs.existsSync(STORE_FOLODER)) fs.mkdirSync(STORE_FOLODER);

      all_result = req.files.supercoolfile.map((file, idx) => {
        file.mv(path.join(STORE_FOLODER, file.name), err => {
          if (err) return PROCESS_NOT_SUCCESS;

          return PROCESS_SUCCESS;
        });
      });

      // if no fail then pass
      overall_result = all_result.filter(r => r == PROCESS_NOT_SUCCESS).length <= 0;
    } else {
      console.log('no file uploaded');

      // upload id not found
      overall_result = PROCESS_NOT_SUCCESS;
    }

    var upload_link = `${baseURL}/g/${NOW_FOLDER}`;
    var upload_link_carousell = `${baseURL}/g/${NOW_FOLDER}`.replace('http', 'ttp');

    // sendHelloworldGroupMessage(`a file uploaded ${upload_link} :tada:`);

    res.status(200).render('uploadSuccessful', {
      upload_link,
      upload_link_carousell,
      HOST,
    });

    // res.send({ hello: 'done 123321 ?' });
  } catch (error) {
    console.log(error);
    res.redirect('/uploadNotSuccessful');
  }
});

module.exports = router;
