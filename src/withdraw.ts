import { User } from './interfaces.js';
import { postData, patchData } from './functions.js';
import { showUser, getUser, setMoney } from './user.js';

if (localStorage.getItem("user") == null || localStorage.getItem("user") == undefined || localStorage.getItem("user") == "" ) {
    window.location.replace("./login.html");
}

let user: User = JSON.parse(localStorage.getItem("user")!);
showUser(document.body, user);
