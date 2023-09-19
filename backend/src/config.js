const is_develop = process.env.NODE_ENV !== 'production';

const HOST = is_develop ? 'localhost:3000' : process.env.HOST;

const PROCESS_NOT_SUCCESS = 0;
const PROCESS_SUCCESS = 1;

const CWD = process.cwd();
const TMP_DIR = process.cwd() + '/tmp';
const VIEWS_DIR = process.cwd() + '/views';
const FOLDER = process.cwd() + '/tmp';
const PORT = 3000;
const baseURL = `https://${HOST}`;

module.exports = {
  HOST,
  PROCESS_NOT_SUCCESS,
  PROCESS_SUCCESS,

  CWD,
  TMP_DIR,
  VIEWS_DIR,
  FOLDER,
  PORT,
  baseURL,
};
