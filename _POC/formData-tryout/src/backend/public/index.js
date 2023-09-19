document.getElementById('app').innerHTML = `
<h1>File Upload & FormData Example</h1>

<div>
  <div>
    <div>pending_upload</div>
    <input type="file" id="filePendingUpload" multiple  />
  </div>
  <div>
    <div>user select</div>
    <input type="file" id="fileUserSelect" multiple  />
  </div>
</div>

<div >file list here:</div>
<div id="file_list">~ no files ~</div>

<button type="button"
  onclick="uploadFile(event)"
>upload</button>
`;

const fileUserSelect = document.querySelector('#fileUserSelect');
const filePendingUpload = document.querySelector('#filePendingUpload');
const fileListDiv = document.querySelector('#file_list');

let dataTransfer = new DataTransfer();

function remove_file_from_list(event) {
  let { id } = event.target;
  console.log(`remove file ${id}`);
  let file_id_to_remove = id.split('_').pop();

  files = files.filter((f, i) => i != parseInt(file_id_to_remove));

  redraw_file_list();
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

const uploadFile = event => {
  console.log('findme ?');
  filePendingUpload.files = dataTransfer.files;
  let files = filePendingUpload.files;

  console.log('Uploading file...');
  const API_ENDPOINT = '//localhost:8000/upload';
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

  request.send(formData);
};

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

  for (let i = 0; i < files.length; i++) {
    console.log(files[i].name);
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
}
