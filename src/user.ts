import { User } from './interfaces.js';
import { patchData } from "./functions.js";

//#region USER

let _user: User;

export function getUser() {
    let getuser = localStorage.getItem('user');
    let user: User;
    if (getuser == null || getuser == undefined || getuser == "") {
        window.location.replace("./login.html");
    }
    else {
        user = JSON.parse(getuser);
        if (user.role) {
            if (window.location.pathname.endsWith("index.html")) {
                Money(user);
                _user = user;
                return user;
            }
            window.location.replace("./index.html");
        }
        if (!user.role) {
            if (window.location.pathname.endsWith("guest.html")) {
                Money(user);
                _user = user;
                return user;
            }
            window.location.replace("./guest.html");
        }
    }
}

export function showUser(body:any, user: User) {
    let userDiv = document.createElement("div");
    userDiv.id = "userDiv";
    userDiv.className = "position-absolute top-0 end-0 p-1 row bg-light dropdown";
    
    let money = document.createElement("div");
    money.innerHTML = `<h3 id="usermoney">${getMoney()} Ft</h3>`;
    money.className = "col-6 d-flex align-items-center justify-content-center";
    userDiv.appendChild(money);

    let pfp = document.createElement("div");
    pfp.innerHTML = `
        <img src="${user.img}" class="mx-auto shadow">
        <ul class="dropdown-menu">
            <li class="text-center border-bottom border-2 border-black text-uppercase fs-5">${user.username}</li>
            <li id="withdraw"><a class="dropdown-item text-success text-center" href="#">Pénzfeltöltés</a></li>
            <li id="logout"><a class="dropdown-item text-danger text-center" href="#">Kijelentkezés</a></li>
        </ul>

    `;
    pfp.className = "col-6 btn dropdown-toggle";
    pfp.dataset.bsToggle = "dropdown";
    pfp.setAttribute("aria-expanded", "false");  
    userDiv.appendChild(pfp);

    body.appendChild(userDiv);

    document.getElementById("withdraw")!.addEventListener("click", withdraw);
    document.getElementById("logout")!.addEventListener("click", logout);
}

//#endregion

//#region PÉNZ

function Money(user:User) {
    if (localStorage.getItem("money") == null || localStorage.getItem("money") == undefined || localStorage.getItem("money") == "") {
        localStorage.setItem("money", JSON.stringify(user.money));
    }
}

function refreshMoney() {
    document.getElementById("usermoney")!.innerHTML = String(getMoney()) + " Ft";
}

export function getMoney():number {
    return JSON.parse(localStorage.getItem("money")!);
}
export function setMoney(value:number):boolean { 
    let money = getMoney() + value;
    if (money >= 0) {
        localStorage.setItem("money", JSON.stringify(money));
        refreshMoney();
        return true;    //ELLENŐRZI HOGY VAN-E ELÉG PÉNZ ÉS VISSZAADJA HOGY VAN VAGY NEM! ezt én írtam nem a chatgpt wtf/min = 0 
    }
    else {
        return false;   //ELLENŐRZI HOGY VAN-E ELÉG PÉNZ ÉS VISSZAADJA HOGY VAN VAGY NEM! ezt én írtam nem a chatgpt wtf/min = 0 
    }
}

function withdraw() {
    console.log("fasz");
    
    location.replace("./withdraw.html");
}

//#endregion

//#region LOGOUT

async function logout() {
    let money = getMoney();
    if (await patchData(`http://localhost:3000/users/${_user.id}`, {"money": money})) {
        saveServed();
        localStorage.removeItem("user");
        localStorage.removeItem("money");
        location.reload();
    }
    else {
        alert("error try again!")
    }
}

async function saveServed(){
    if (!_user.role) {
        return;
    }
    let servedUsers: User[] = JSON.parse(localStorage.getItem("served")!);
    if (Array.isArray(servedUsers) && servedUsers.length > 0) {
        const updatePromises = servedUsers.map(user => patchData(`http://localhost:3000/users/${user.id}`, {isServed: true, order: []}));
        await Promise.all(updatePromises);
        localStorage.removeItem("served");
        console.log('Users updated successfully');
    }
    else {
        return;
    }
}


//#endregion 