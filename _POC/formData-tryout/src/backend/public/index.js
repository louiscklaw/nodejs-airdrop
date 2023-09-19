document.getElementById("app").innerHTML = `
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

const fileUserSelect = document.querySelector("#fileUserSelect");
const filePendingUpload = document.querySelector("#filePendingUpload");
const fileListDiv = document.querySelector("#file_list");

const dataTransfer = new DataTransfer();

function remove_file_from_list(event) {
  let {id} = event.target;
  console.log(`remove file ${id}`);
  let file_id_to_remove = id.split('_').pop();

  files = files.filter((f,i) => i != parseInt(file_id_to_remove));

  redraw_file_list();
}

fileUserSelect.addEventListener("change", event => {
  // push to pending upload list
  const user_selected_files = fileUserSelect.files;

  for (let i = 0; i < user_selected_files.length; i++){
    console.log('adding file ');
    console.log(user_selected_files[i].name);

    const myFile = new File(['Hello World!'], user_selected_files[i].name, {
      type: 'text/plain',
      lastModified: new Date(),
    });
    dataTransfer.items.add(myFile);
  }

  // push to pending upload list

  redraw_file_list(dataTransfer.items)
});

const uploadFile = (event) => {
  console.log('findme ?');
  filePendingUpload.files = dataTransfer.files;
  let files = filePendingUpload.files;

  console.log("Uploading file...");
  const API_ENDPOINT = "//localhost:8000/upload";
  const request = new XMLHttpRequest();
  const formData = new FormData();

  request.open("POST", API_ENDPOINT, true);
  request.onreadystatechange = () => {
    if (request.readyState === 4 && request.status === 200) {
      console.log(request.responseText);
    }
  };

  for (let i = 0; i < files.length; i++) {
    formData.append(files[i].name, files[i])
  }

  request.send(formData);

};

function redraw_file_list(files){
  let temp_inner_html = "";

  for (let i = 0; i < files.length; i++) {
    temp_inner_html = temp_inner_html +
    `<div>
      <div>
        ${files[i].name}
      </div>
      <button id="remove_file_${i}" type="button" onclick="remove_file_from_list(event)">
        delete
      </button>
    </div>`
  }

  fileListDiv.innerHTML = temp_inner_html;
}
