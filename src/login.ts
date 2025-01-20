import { User } from './interfaces.js';
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

function userFinder(username: string, users: User[]) {
    return users.find(u => u.username === username) || null;
}

async function Login(event: any) {
    event?.preventDefault();
    const unsername = (<HTMLInputElement>document.getElementById("usernameInput")!).value;
    const password = (<HTMLInputElement>document.getElementById("passwordInput")!).value;

    const users: User[] = await fetchData("http://localhost:3000/users");
    const user = userFinder(unsername, users);
    console.log(user);    
    if (user != null && (<User>user).password == password) {
        succes();
    }
    else {
        console.log("nem jó");        
    }
}

async function Register(event: any) {
    event?.preventDefault();
    const unsername = (<HTMLInputElement>document.getElementById("usernameInput1")!).value;
    const password = (<HTMLInputElement>document.getElementById("passwordInput1")!).value;

    const users: User[] = await fetchData("http://localhost:3000/users");
    if (userFinder(unsername, users) == null) {
        
    }
        
}

function succes() {
    console.log("hurrá");
}

LoginButton?.addEventListener("click", showLogin);
RegisterButton?.addEventListener("click", showRegister);
Array.from(BackButton).forEach(e => {
    e.addEventListener("click", backToChoose);
});
SubmitLogin?.addEventListener("click", Login);
RegisterButton?.addEventListener("click", Register);
