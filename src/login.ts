const chooseDIV = document.getElementById("choose");
const loginDIV = document.getElementById("login");
const registerDIV = document.getElementById("register");

const LoginButton = document.getElementById("loginbtn"); 
const RegisterButton = document.getElementById("registerbtn");
const BackButton = document.getElementsByClassName("backbtn");

function showLogin() {
    chooseDIV?.classList.add("d-none");
    registerDIV?.classList.add("d-none");
    loginDIV!.classList.remove("d-none");
}

function showRegister() {
    chooseDIV?.classList.add("d-none");
    loginDIV!.classList.add("d-none");
    registerDIV!.classList.remove("d-none");
}

function backToChoose() {
    loginDIV!.classList.add("d-none");
    registerDIV!.classList.add("d-none");
    chooseDIV?.classList.remove("d-none");
}

LoginButton?.addEventListener("click", showLogin);
RegisterButton?.addEventListener("click", showRegister);
Array.from(BackButton).forEach(e => {
    e.addEventListener("click", backToChoose);
});
