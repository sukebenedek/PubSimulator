"use strict";
const chooseDIV = document.getElementById("choose");
const loginDIV = document.getElementById("login");
const registerDIV = document.getElementById("register");
const LoginButton = document.getElementById("loginbtn");
const RegisterButton = document.getElementById("registerbtn");
const BackButton = document.getElementsByClassName("backbtn");
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
LoginButton === null || LoginButton === void 0 ? void 0 : LoginButton.addEventListener("click", showLogin);
RegisterButton === null || RegisterButton === void 0 ? void 0 : RegisterButton.addEventListener("click", showRegister);
Array.from(BackButton).forEach(e => {
    e.addEventListener("click", backToChoose);
});
