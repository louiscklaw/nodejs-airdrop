const express = require('express');
const router = express.Router();

const {HOST} = require('../config');

router.get('/', (req, res) => {
  console.log('hello unsuccessful');
  res.status(300).render('uploadNotSuccessful', { HOST });
});

module.exports = router;
