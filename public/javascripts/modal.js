// const { default: Axios } = require("axios");

console.log("Button Click");
let saveJobBtn = document.querySelectorAll(".modal-save-job");

for (var i = 0; i < saveJobBtn.length; i++) {
  saveJobBtn[i].addEventListener("click", (event) => {
    let app_id = document.querySelector(`#${i}`);
    // Axios.post(url, { app_id: event.target.textContent });
    console.log(app_id.textContent);
  });
}
