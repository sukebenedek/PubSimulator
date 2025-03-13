import { showUser } from './user.js';
if (localStorage.getItem("user") == null || localStorage.getItem("user") == undefined || localStorage.getItem("user") == "") {
    window.location.replace("./login.html");
}
let user = JSON.parse(localStorage.getItem("user"));
showUser(document.body, user);
