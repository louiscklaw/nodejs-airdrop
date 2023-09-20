const is_develop = process.env.NODE_ENV !== 'production';

const HOST = is_develop ? 'localhost:3000' : process.env.HOST;

const PROCESS_NOT_SUCCESS = 0;
const PROCESS_SUCCESS = 1;

const CWD = process.cwd();
const SRC_DIR = CWD + '/src';

const FOLDER = process.cwd() + '/tmp';
const PORT = 3000;
const baseURL = `https://${HOST}`;

const PUBLIC_DIR = SRC_DIR + '/public';
const VIEWS_DIR = SRC_DIR + '/views';
const TMP_DIR = process.cwd() + '/tmp';

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
  PUBLIC_DIR,
  VIEWS_DIR,
};
