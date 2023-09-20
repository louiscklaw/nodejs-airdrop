let dataTransfer = new DataTransfer();

const fileListDiv = document.querySelector('#file_list');
// const fileListDiv = document.querySelector('#num-of-files');

let fileInput = document.getElementById('file-input');
let fileList = document.getElementById('files-list');
let numOfFiles = document.getElementById('num-of-files');

let fileUpload = [];

function remove_file_from_list(e) {
  try {
    let file_idx = e.target.id.split('_').pop();
    const new_dataTransfer = new DataTransfer();

    for (let i = 0; i < dataTransfer.files.length; i++) {
      if (i != parseInt(file_idx)) {
        new_dataTransfer.items.add(dataTransfer.files.item(i));
      } else {
        console.log('idx need to be deleted, skipping');
      }
    }

    dataTransfer = new_dataTransfer;

    redraw_file_list(dataTransfer.files);
  } catch (error) {
    console.log('error during remove_file_from_list');
    console.log(error);
  }
}

function redraw_file_list(files) {
  let temp_inner_html = '';
  try {
    for (let i = 0; i < files.length; i++) {
      console.log(i);
      temp_inner_html =
        temp_inner_html +
        `<div>
        <div>
          ${files[i].name}
        </div>
        <button id="remove_file_${i}" type="button" onclick="remove_file_from_list(event)">
          delete
        </button>
      </div>`;
    }

    fileListDiv.innerHTML = temp_inner_html;
  } catch (error) {
    console.log(error);
  }
}

function redraw_file_list1(files) {
  let temp_inner_html = '';

  for (let i = 0; i < files.length; i++) {
    console.log(files[i].name);
    temp_inner_html =
      temp_inner_html +
      `
      <div>
        <div>
          ${files[i].name}
        </div>
        <button id="remove_file_${i}" type="button" onclick="remove_file_from_list(event)">
          delete
        </button>
      </div>
    `;
  }

  fileListDiv.innerHTML = temp_inner_html;
}

fileUserSelect.addEventListener('change', event => {
  // push to pending upload list
  const user_selected_files = fileUserSelect.files;
  const filename_current_in_data_transfer = [];
  const filename_user_selected = [];
  const newly_added_files = [];

  console.log('fileUserSelect change 1');
  console.log(dataTransfer);
  for (let i = 0; i < dataTransfer.files.length; i++) {
    console.log('adding filename_current_in_data_transfer');
    filename_current_in_data_transfer.push(dataTransfer.files.item(i).name);
  }

  // get newly added file by name
  console.log('fileUserSelect change 2');
  console.log(filename_current_in_data_transfer);
  for (let i = 0; i < user_selected_files.length; i++) {
    filename_user_selected.push(user_selected_files[i].name);
    if (filename_current_in_data_transfer.indexOf(user_selected_files[i].name) > -1) {
      console.log('file already exist in datatransfer, skipping');
    } else {
      newly_added_files.push(user_selected_files[i]);
    }
  }
  // console.log({newly_added_files, filename_current_in_data_transfer});

  for (let i = 0; i < newly_added_files.length; i++) {
    console.log(newly_added_files);
    const file = newly_added_files[i];

    dataTransfer.items.add(file);
  }

  console.log(dataTransfer);

  // push to pending upload list
  redraw_file_list(dataTransfer.files);
});

fileInput
  ? fileInput.addEventListener('change', () => {
      // push to pending upload list
      redraw_file_list(dataTransfer.files);

      fileList.innerHTML = '';

      for (i of fileInput.files) {
        fileUpload.push(i);
      }

      refreshFileList();
    })
  : false;

function clearFileList() {
  var child = fileList.lastElementChild;
  while (child) {
    fileList.removeChild(child);
    child = fileList.lastElementChild;
  }
}

function refreshFileList() {
  clearFileList();

  numOfFiles.textContent = `${fileUpload.length} ${fileUpload.length > 1 ? active_lang.FILES : active_lang.FILE} ${
    active_lang.SELECTED
  }`;

  fileUpload.map((i, idx) => {
    let reader = new FileReader();
    let listItem = document.createElement('li');
    let fileName = i.name;
    let fileSize = (i.size / 1024).toFixed(1);

    let fileSizeHuman = fileSize >= 1024 ? (fileSize / 1024).toFixed(1) + 'MB' : fileSize + 'KB';

    listItem.innerHTML = `
        <div class="left">
          <p class="icon"><i class="fa-regular fa-file"></i> </p>
          <p class="name">${fileName}</p>
        </div>
        <div class="right">
          <p class="size">${fileSizeHuman}</p>
          <p class="delete-container">
            <div class="delete-button" id="file-${idx}" onClick="handleDeleteButtonClick(this, ${idx})">
              <i class="fa-solid fa-trash-can"></i>
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

var proceedUpload = true;
function disableUploadButton() {
  document.querySelector('#btn-upload').classList.add(['disabled']);
  proceedUpload = false;
}

function resumeUploadButton() {
  document.querySelector('#btn-upload').classList.remove(['disabled']);
  proceedUpload = true;
}

function handleDeleteButtonClick(ele, idx) {
  console.log({ idx });
  fileUpload = fileUpload.filter((f, i) => i != idx);

  refreshFileList();
  console.log(fileUpload);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#btn-upload').addEventListener('click', () => {
    if (proceedUpload) {
      if (fileUpload.length > 0) {
        // NOTE: upload of files larger than 100M were restricted by cloudflare
        document.querySelector('.upload-form-container').submit();
      } else {
        alert(lang.en.ALERT_PICK_FILE);
      }
    } else {
      console.log('upload button click during upload process.');
    }
  });

  document.querySelector('#btn-back').addEventListener('click', () => {
    console.debug('helloworld');
    // location.href = 'https://louiscklaw.github.io';
    // window.open('https://www.codexworld.com/', '_self');
    window.open('https://louiscklaw.github.io', '_self');
  });

  document.querySelector('#container_title_text').innerHTML = active_lang.FILE_UPLOAD;

  document.querySelector('#btn_upload_text').innerHTML = active_lang.BTN_UPLOAD_TEXT;

  document.querySelector('#btn_back_text').innerHTML = active_lang.BTN_BACK_TEXT;

  document.querySelector('#btn_choose_file_to_upload').innerHTML = active_lang.BTN_CHOOSE_FILE_TO_UPLOAD;

  document.querySelector('#num-of-files').innerHTML = active_lang.NO_FILE_CHOOSEN;

  document.querySelector('#container_subtitle').innerHTML = active_lang.MAX_FILE_SIZE_BELOW_100MB;

  document.querySelector('#container_title_text').innerHTML = active_lang.FILE_UPLOAD;

  document.querySelector('#container_title_text').innerHTML = active_lang.FILE_UPLOAD;
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

const uploadFile1 = event => {
  console.log('findme ?');
  filePendingUpload.files = dataTransfer.files;
  let files = filePendingUpload.files;

  console.log('Uploading file...');
  const API_ENDPOINT = '/upload';
  const request = new XMLHttpRequest();
  const formData = new FormData();

  request.open('POST', API_ENDPOINT, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      console.log(request.responseText);
    }
  };

  for (let i = 0; i < files.length; i++) {
    formData.append(files[i].name, files[i]);
  }

  formData.append('_uploadid', 'test_uploadid');

  request.send(formData);
};
