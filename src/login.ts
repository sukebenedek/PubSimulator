import { User } from './interfaces.js';
import { fetchData, postData } from './functions.js';

localStorage.clear();
localStorage.setItem("welcome", JSON.stringify(true));

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
    const username = (<HTMLInputElement>document.getElementById("usernameInput")!).value;
    const password = (<HTMLInputElement>document.getElementById("passwordInput")!).value;

    const users: User[] = await fetchData("http://localhost:3000/users");
    const user = userFinder(username, users);
    if (user != null && (<User>user).password == password) {
        succes(user);
    }
    else {
        document.getElementById("error")!.innerHTML = "Hibás felhasználónév/jelszó!"
    }
}

async function Register(event: any) {
    event?.preventDefault();
    document.getElementById("usernameError")!.innerHTML = "";
    document.getElementById("passwordHelpBlock")!.innerHTML = "A jelszó maximum 20 karaktert tartalmazhat.";
    document.getElementById("passwordHelpBlock")?.classList.remove("text-danger");
    document.getElementById("passwordHelpBlock")?.classList.add("text-white");

    const username = (<HTMLInputElement>document.getElementById("usernameInput1")!).value;
    const password = (<HTMLInputElement>document.getElementById("passwordInput1")!).value;

    if (username == "") {
        document.getElementById("usernameError")!.innerHTML = "Kötelező felhasználónevet megadni!";
    }
    else {
        const users: User[] = await fetchData("http://localhost:3000/users");
        if (userFinder(username, users) == null) {
            if (password.length > 0) {
                if (password.length > 20){
                    document.getElementById("passwordHelpBlock")?.classList.remove("text-white");
                    document.getElementById("passwordHelpBlock")?.classList.add("text-danger");
                }
                else {
                    const role = (<HTMLInputElement>document.getElementById("flexRadioDefault1")!).checked;
                    const img = (<HTMLInputElement>document.getElementById("flexRadioDefault4")!).checked == true ? `https://randomuser.me/api/portraits/men/${99 - users.length}.jpg` : `https://randomuser.me/api/portraits/women/${99 - users.length}.jpg`;
                    if ( await postData("http://localhost:3000/users", {id: users.length, username: username, password: password, money: 1000, drunkness: 0, img: img, role: role, isServed : false, order: []}) ) {
                        succes({id: String(users.length), username: username, password: password, money: 1000, drunkness: 0, img: img, role: role, isServed: false, order: []});
                    }
                    else {
                        alert("Hiba! Próbálja újra!")
                    }
                }
            }
            else {
                document.getElementById("passwordHelpBlock")?.classList.remove("text-white");
                document.getElementById("passwordHelpBlock")?.classList.add("text-danger");
                document.getElementById("passwordHelpBlock")!.innerHTML = "Kötelező jelszót megadni!";
            }
        }
        else {
            document.getElementById("usernameError")!.innerHTML = "A felhasználónév már foglalt.";
        }   
    }
}

function succes(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.role) {
        window.location.replace("./index.html");
    }
    else {
        window.location.replace("./guest.html");
    }
}

LoginButton?.addEventListener("click", showLogin);
RegisterButton?.addEventListener("click", showRegister);
Array.from(BackButton).forEach(e => {
    e.addEventListener("click", backToChoose);
});
SubmitLogin?.addEventListener("click", Login);
SubmitRegister?.addEventListener("click", Register);
