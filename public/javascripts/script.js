console.log("set timeout")
var body = document.querySelector('body');
// body.addEventListener("load", () => {
setTimeout(function () {
    console.log("Set-timeout over");
    let para = document.querySelector('.typing-paragraph');
    para.classList.add("show");
    para.style.color = "black";
}, 4000);
// })