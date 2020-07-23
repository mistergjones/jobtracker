console.log("nav");
// var nav = document.querySelector("nav");
var links = document.querySelectorAll(".nav-link");
for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
        var current = document.querySelector(".active");
        current.classList.remove("active");
        e.target.classList.add("active");
    });
}