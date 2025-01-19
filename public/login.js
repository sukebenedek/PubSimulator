import { fetchData } from './functions.js';
const chooseDIV = document.getElementById("choose");
const loginDIV = document.getElementById("login");
const registerDIV = document.getElementById("register");
const LoginButton = document.getElementById("loginbtn");
const RegisterButton = document.getElementById("registerbtn");
const BackButton = document.getElementsByClassName("backbtn");
const SubmitLogin = document.getElementById("submitLogin");
const SubmitRegister = document.getElementById("submitRegiser");
function showLogin() {
    chooseDIV === null || chooseDIV === void 0 ? void 0 : chooseDIV.classList.add("d-none");
    registerDIV === null || registerDIV === void 0 ? void 0 : registerDIV.classList.add("d-none");
    loginDIV.classList.remove("d-none");
}
function showRegister() {
    chooseDIV === null || chooseDIV === void 0 ? void 0 : chooseDIV.classList.add("d-none");
    loginDIV.classList.add("d-none");
    registerDIV.classList.remove("d-none");
}
function backToChoose() {
    loginDIV.classList.add("d-none");
    registerDIV.classList.add("d-none");
    chooseDIV === null || chooseDIV === void 0 ? void 0 : chooseDIV.classList.remove("d-none");
}
function userFinder(username, users) {
    return users.find(u => u.username === username) || null;
}
async function Login(event) {
    event === null || event === void 0 ? void 0 : event.preventDefault();
    const unsername = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;
    const users = await fetchData("http://localhost:3000/users");
    const user = userFinder(unsername, users);
    console.log(user);
    if (user != null && user.password == password) {
        succes();
    }
    else {
        console.log("nem jó");
    }
}
async function Register(event) {
    event === null || event === void 0 ? void 0 : event.preventDefault();
    const unsername = document.getElementById("usernameInput1").value;
    const password = document.getElementById("passwordInput1").value;
    const users = await fetchData("http://localhost:3000/users");
    if (userFinder(unsername, users) == null) {
    }
}
function succes() {
    console.log("hurrá");
}
LoginButton === null || LoginButton === void 0 ? void 0 : LoginButton.addEventListener("click", showLogin);
RegisterButton === null || RegisterButton === void 0 ? void 0 : RegisterButton.addEventListener("click", showRegister);
Array.from(BackButton).forEach(e => {
    e.addEventListener("click", backToChoose);
});
SubmitLogin === null || SubmitLogin === void 0 ? void 0 : SubmitLogin.addEventListener("click", Login);
RegisterButton === null || RegisterButton === void 0 ? void 0 : RegisterButton.addEventListener("click", Register);
