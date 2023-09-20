const path = require('path');
const fs = require('fs');
const glob = require('glob');

const express = require('express');
const router = express.Router();
const shortid = require('shortid');
const { HOST, PROCESS_NOT_SUCCESS, FOLDER, PROCESS_SUCCESS, baseURL, UPLOAD_DONE, UPLOAD_ERROR } = require('../config');

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

    let uploaded_file_names = Object.keys(req.files);
    output = { ...output, debug: { ...output.debug, uploaded_file_names } };
    console.log({ uploaded_file_names });

    // if one file -> not array
    // console.log({
    //   test_single_file: req.files.name,
    //   test_file_length: req.files.length,
    //   test_file: req.files,
    //   uploaded_file_names,
    // });

    console.log({ STORE_FOLODER });
    if (!fs.existsSync(STORE_FOLODER)) {
      console.log('STORE_FOLDER created');
      fs.mkdirSync(STORE_FOLODER);
    } else {
      console.log('STORE_FOLDER already exist');
    }

    for (let i = 0; i < uploaded_file_names.length; i++) {
      let f_name = uploaded_file_names[i];
      let uploaded_file = req.files[f_name];
      let target_path = STORE_FOLODER + '/' + f_name;

      uploaded_file.mv(target_path, err => {
        try {
          if (err) throw err;
          // throw new Error('blablabla');
        } catch (error) {
          console.log({ target_path, output, err_message: error.message });
          throw error;
        }
      });
    }

    var upload_link = `${baseURL}/g/${NOW_FOLDER}`;
    var upload_link_carousell = `${baseURL}/g/${NOW_FOLDER}`.replace('http', 'ttp');

    // sendHelloworldGroupMessage(`a file uploaded ${upload_link} :tada:`);
    output = { ...output, state: UPLOAD_DONE, info: { upload_link, upload_link_carousell, HOST } };
    res.send(output);
  } catch (error) {
    console.log(error);
    // res.redirect('/uploadNotSuccessful', {});
    output = { ...output, state: UPLOAD_ERROR, error: error.message };
    res.send(output);
  }
});

module.exports = router;
