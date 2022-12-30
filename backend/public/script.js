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
}

function handleDeleteButtonClick(ele, idx) {
  console.log({ idx });
  fileUpload = fileUpload.filter((f, i) => i != idx);

  refreshFileList();
  console.log(fileUpload);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#btn-upload').addEventListener('click', () => {
    document.querySelector('.upload-form-container').submit();
  });

  document.querySelector('#btn-back').addEventListener('click', () => {
    console.log('helloworld');
  });
});