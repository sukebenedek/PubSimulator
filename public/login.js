import { fetchData, postData } from './functions.js';
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
    if (user != null && user.password == password) {
        succes(user.role);
    }
    else {
        document.getElementById("error").innerHTML = "Hibás felhasználónév/jelszó!";
    }
}
async function Register(event) {
    var _a, _b, _c, _d, _e, _f;
    event === null || event === void 0 ? void 0 : event.preventDefault();
    document.getElementById("usernameError").innerHTML = "";
    document.getElementById("passwordHelpBlock").innerHTML = "A jelszó maximum 20 karaktert tartalmazhat.";
    (_a = document.getElementById("passwordHelpBlock")) === null || _a === void 0 ? void 0 : _a.classList.remove("text-danger");
    (_b = document.getElementById("passwordHelpBlock")) === null || _b === void 0 ? void 0 : _b.classList.add("text-white");
    const unsername = document.getElementById("usernameInput1").value;
    const password = document.getElementById("passwordInput1").value;
    if (unsername == "") {
        document.getElementById("usernameError").innerHTML = "Kötelező felhasználónevet megadni!";
    }
    else {
        const users = await fetchData("http://localhost:3000/users");
        if (userFinder(unsername, users) == null) {
            if (password.length > 0) {
                if (password.length > 20) {
                    (_c = document.getElementById("passwordHelpBlock")) === null || _c === void 0 ? void 0 : _c.classList.remove("text-white");
                    (_d = document.getElementById("passwordHelpBlock")) === null || _d === void 0 ? void 0 : _d.classList.add("text-danger");
                }
                else {
                    const role = document.getElementById("flexRadioDefault1").checked;
                    const img = document.getElementById("flexRadioDefault4").checked == true ? `https://randomuser.me/api/portraits/men/${99 - users.length}.jpg` : `https://randomuser.me/api/portraits/women/${99 - users.length}.jpg`;
                    if (await postData("http://localhost:3000/users", { id: users.length, username: unsername, password: password, money: 1000, drunkness: 0, img: img, role: role })) {
                        succes(role);
                    }
                    else {
                        alert("Hiba! Próbálja újra!");
                    }
                }
            }
            else {
                (_e = document.getElementById("passwordHelpBlock")) === null || _e === void 0 ? void 0 : _e.classList.remove("text-white");
                (_f = document.getElementById("passwordHelpBlock")) === null || _f === void 0 ? void 0 : _f.classList.add("text-danger");
                document.getElementById("passwordHelpBlock").innerHTML = "Kötelező jelszót megadni!";
            }
        }
        else {
            document.getElementById("usernameError").innerHTML = "A felhasználónév már foglalt.";
        }
    }
}
function succes(role) {
    if (role) {
        window.location.replace("./index.html");
    }
    else {
        window.location.replace("./alcoholism.html");
    }
}
LoginButton === null || LoginButton === void 0 ? void 0 : LoginButton.addEventListener("click", showLogin);
RegisterButton === null || RegisterButton === void 0 ? void 0 : RegisterButton.addEventListener("click", showRegister);
Array.from(BackButton).forEach(e => {
    e.addEventListener("click", backToChoose);
});
SubmitLogin === null || SubmitLogin === void 0 ? void 0 : SubmitLogin.addEventListener("click", Login);
SubmitRegister === null || SubmitRegister === void 0 ? void 0 : SubmitRegister.addEventListener("click", Register);
