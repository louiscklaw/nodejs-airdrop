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
  OK_COPIED: 'OK copied',
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
  OK_COPIED: 'OK 復製左喇',
  OK_CAROUSELL_COPIED: 'OK, 連結已復製，請貼到 carousell message box，唔該晒',
};

let lang = { en, zh };
let active_lang = lang[window.navigator.language.split('-')[0] || 'en'];

let fileInput = document.getElementById('file-input');
let fileList = document.getElementById('files-list');
let numOfFiles = document.getElementById('num-of-files');

let fileUpload = [];

fileInput.addEventListener('change', () => {
  fileList.innerHTML = '';

  for (i of fileInput.files) {
    fileUpload.push(i);
  }

  refreshFileList();

  console.log(fileUpload);
});

function clearFileList() {
  var child = fileList.lastElementChild;
  while (child) {
    fileList.removeChild(child);
    child = fileList.lastElementChild;
  }
}

function refreshFileList() {
  clearFileList();

  numOfFiles.textContent = `${fileUpload.length} Files Selected`;

  fileUpload.map((i, idx) => {
    let reader = new FileReader();
    let listItem = document.createElement('li');
    let fileName = i.name;
    let fileSize = (i.size / 1024).toFixed(1);

    let fileSizeHuman =
      fileSize >= 1024 ? (fileSize / 1024).toFixed(1) + 'MB' : fileSize + 'KB';

    listItem.innerHTML = `
        <div class="left">
          <p class="icon"><i class="fa-regular fa-file fa-2x"></i> </p>
          <p class="name">${fileName}</p>
        </div>
        <div class="right">
          <p class="size">${fileSizeHuman}</p>
          <p class="delete-container">
            <div class="delete-button" id="file-${idx}" onClick="handleDeleteButtonClick(this, ${idx})">
              <i class="fa-solid fa-trash-can fa-2x"></i>
            </div>
          </p>
        </div>
      `;

    fileList.appendChild(listItem);
  });

  if (fileUpload.length > 0) {
    document.querySelector('#btn-upload').classList.remove(['disabled']);
  } else {
    document.querySelector('#btn-upload').classList.add(['disabled']);
  }
}

function handleDeleteButtonClick(ele, idx) {
  console.log({ idx });
  fileUpload = fileUpload.filter((f, i) => i != idx);

  refreshFileList();
  console.log(fileUpload);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#btn-upload').addEventListener('click', () => {
    if (fileUpload.length > 0) {
      document.querySelector('.upload-form-container').submit();
    } else {
      console.debug('file list is empty');
      alert(lang.en.ALERT_PICK_FILE);
    }
  });

  document.querySelector('#btn-back').addEventListener('click', () => {
    console.log('helloworld');
    // location.href = 'https://louiscklaw.github.io';
    // window.open('https://www.codexworld.com/', '_self');
    window.open('https://louiscklaw.github.io', '_self');
  });
});

if (!localStorage.getItem('hide-tutorial')) {
  Swal.fire({
    icon: 'question',
    title: active_lang.HOW_TO_USE,
    html:
      `
      <ul style="text-align: left;">
        <li style="margin-top: 0.5rem; font-size: 1rem; display: flex; flex-direction:row;">
          <div style="min-width: 2rem;">1.</div>
          <div>` +
      active_lang.CLICK_CHOSE_FILES +
      `</div>
        </li>
        <li style="margin-top: 0.5rem; font-size: 1rem; display: flex; flex-direction:row;">
          <div style="min-width: 2rem;">2.</div>
          <div>` +
      active_lang.UPLOAD_BUTTON_ENABLED +
      `</div>
        </li>
        <li style="margin-top: 0.5rem; font-size: 1rem; display: flex; flex-direction:row;">
          <div style="min-width: 2rem;">3.</div>
          <div>` +
      active_lang.COPY_TO_CAROUSELL +
      `</div>
        </li>
      </ul>

      <div style="margin-top: 1rem; display: flex; flex-direction:row; justify-content: center;align-items: baseline;">
        <div><input type="checkbox" onchange="DontShowMeThisAgain()"/></div>
        <div style="margin-top: 0.5rem; font-size: 1rem; line-height: 1rem;padding-left: 1rem;">Don't show me again</div>
      </div>
    `,
    confirmButtonText: active_lang.OK_I_UNDERSTAND,
  });
} else {
}

function DontShowMeThisAgain() {
  localStorage.setItem('hide-tutorial', true);
}
