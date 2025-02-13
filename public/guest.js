var _a, _b;
import { fetchData, patchData } from './functions.js';
let getuser = localStorage.getItem('user');
let user;
if (getuser == null) {
    window.location.replace("./login.html");
}
else {
    user = JSON.parse(getuser);
}
let loaded = false;
let amounts = {};
function closePopup() {
    document.getElementById("popup").classList.add("d-none");
    document.getElementById("container").classList.remove("d-none");
}
function closePopup2() {
    document.getElementById("popup2").classList.add("d-none");
}
(_a = document.getElementById("okButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closePopup);
async function order() {
    var _a, _b;
    document.getElementById("popup2").classList.remove("d-none");
    (_a = document.getElementById("cancel")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closePopup2);
    (_b = document.getElementById("order")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", finishOrder);
    if (!loaded) {
        const drinks = await fetchData("http://localhost:3000/drinks");
        drinks.forEach(d => {
            var _a, _b;
            let li = document.createElement('li');
            li.style.listStyleType = 'none';
            li.innerHTML = `
                <div class="drinkItem my-5">
                    <div id="${d.name}" class="drinkItem" role="button">
                        <div class="shadow">
                            <img class="drinkImg" src="${d.img}" alt="${d.name}">
                        </div>
                        <span class="drinkText">${d.name} - ${d.price}Ft</span> 
                        </div>
                    <div>
                        <span id="${d.name}span" class="drinkText text-success"></span>
                    </div>
                </div>
            `;
            (_a = document.getElementById(d.category)) === null || _a === void 0 ? void 0 : _a.appendChild(li);
            (_b = document.getElementById(d.name)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { orderDrink(d); });
        });
        loaded = true;
    }
    ;
}
function orderDrink(d) {
    var _a;
    if (d.name in amounts)
        amounts[d.name] += 1;
    else
        amounts[d.name] = 1;
    document.getElementById(d.name + "span").innerHTML = `X${amounts[d.name]} <svg id="${d.name}trash" role="button" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill text-danger" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
    </svg>`;
    (_a = document.getElementById(d.name + "trash")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => trash(d));
    updatePrice();
}
function trash(d) {
    amounts[d.name] = 0;
    document.getElementById(d.name + "span").innerHTML = "";
    updatePrice();
}
async function updatePrice() {
    const drinks = await fetchData("http://localhost:3000/drinks");
    let sum = 0;
    for (const [key, value] of Object.entries(amounts)) {
        drinks.forEach(d => {
            if (d.name == key) {
                sum += value * d.price;
            }
        });
    }
    if (sum != 0) {
        document.getElementById("h3").classList.remove("d-none");
    }
    else {
        document.getElementById("h3").classList.add("d-none");
    }
    document.getElementById("price").innerHTML = String(sum);
}
async function finishOrder() {
    const drinks = await fetchData("http://localhost:3000/drinks");
    let order = [];
    for (const [key, value] of Object.entries(amounts)) {
        if (value > 0) {
            drinks.forEach(d => {
                if (d.name == key) {
                    order.push(d);
                }
            });
        }
        document.getElementById(key + "span").innerHTML = "";
    }
    console.log(user);
    console.log(order);
    let pastOrder = await fetchData(`http://localhost:3000/users/${user.id}/order`);
    let newOrder = pastOrder.concat(order);
    user.order = newOrder;
    if (await patchData(`http://localhost:3000/users/${user.id}`, user)) {
        alert("sikeres rendelés!");
    }
    else {
        alert("Hiba! Próbálja újra!");
    }
    amounts = {};
    updatePrice();
    closePopup2();
}
(_b = document.getElementById("counter")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", order);
