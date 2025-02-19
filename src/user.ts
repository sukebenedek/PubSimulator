import { User } from './interfaces.js';

export function getUser() {
    let getuser = localStorage.getItem('user');
    let user: User;
    if (getuser == null) {
        window.location.replace("./login.html");
    }
    else {
        user = JSON.parse(getuser);
        return user;
    }
}

export function showUser(body:any, user: User) {
    let userDiv = document.createElement("div");
    userDiv.id = "userDiv";
    userDiv.className = "position-absolute top-0 end-0 p-1 row bg-light dropdown";
    
    let money = document.createElement("div");
    money.innerHTML = `<h3>${user.money} Ft</h3>`;
    money.className = "col-6 d-flex align-items-center justify-content-center";
    userDiv.appendChild(money);

    let pfp = document.createElement("div");
    pfp.innerHTML = `
        <img src="${user.img}" class="mx-auto shadow">
        <ul class="dropdown-menu">
            <li class="text-center border-bottom border-2 border-black text-uppercase fs-5">${user.username}</li>
            <li><a class="dropdown-item text-success text-center" href="#">Pénzfeltöltés</a></li>
            <li><a class="dropdown-item text-center" href="#">Szerepváltás</a></li>
            <li><a class="dropdown-item text-danger text-center" href="#">Kijelentkezés</a></li>
        </ul>

    `;
    pfp.className = "col-6 btn dropdown-toggle";
    pfp.dataset.bsToggle = "dropdown";
    pfp.setAttribute("aria-expanded", "false");  
    userDiv.appendChild(pfp);

    body.appendChild(userDiv);
}