let en = {
  ALERT_PICK_FILE: 'please pick a file to upload before click upload button',
  OK_I_UNDERSTAND: 'OK, i understand',
  HOW_TO_USE: 'HOW TO USE?',
  CLICK_CHOSE_FILES: `click "choose files to upload"`,
  UPLOAD_BUTTON_ENABLED: `"upload" button enabled after you select file, press it`,
  COPY_TO_CAROUSELL: `click "copy to carousell" button and paste the link copied into carousell message box`,
  YOUR_UPLOAD_LINK: 'your link to the file:',
  BACK: 'BACK',
  COPY_LINK: 'COPY LINK',
  COPY_CAROUSELL_LINK: 'COPY CAROUSELL LINK',
  OK_COPIED: 'OK link copied !',
  UPLOAD_SUCCESSFUL: 'Upload successful !',
  OK_CAROUSELL_COPIED:
    'OK, carousell link copied, please head to carousell message window and paste the link. Thanks !',
};

let zh = {
  ALERT_PICK_FILE: 'please pick a file to upload before click upload button',
  OK_I_UNDERSTAND: 'OK, 明晒!',
  HOW_TO_USE: '喂，點用呀​？',
  CLICK_CHOSE_FILES: `click "choose files to upload"`,
  UPLOAD_BUTTON_ENABLED: `"upload" button enabled after you select file, press it`,
  COPY_TO_CAROUSELL: `click "copy to carousell" button and paste the link copied into carousell message box`,
  YOUR_UPLOAD_LINK: '你的專屬連結:',
  BACK: '返回',
  COPY_LINK: '復製連結',
  COPY_CAROUSELL_LINK: '復製 carousell 連結',
  OK_COPIED: 'OK 復製左喇！',
  UPLOAD_SUCCESSFUL: '上傳完成 !',
  OK_CAROUSELL_COPIED: 'OK, 連結已復製，請貼到 carousell message box，唔該晒！',
};

let lang = { en, zh };
let active_lang = lang[window.navigator.language.split('-')[0] || 'en'];
