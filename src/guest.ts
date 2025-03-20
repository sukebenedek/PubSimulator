import { Drink, User } from './interfaces.js';
import { fetchData, postData, patchData } from './functions.js';
import { getUser, setMoney, showUser } from './user.js';

let user: User = getUser()!;
showUser(document.body, user);


let welcome: boolean
let getWelcome = localStorage.getItem("welcome");
if (getWelcome == null) {
    welcome = true;
}
else {
    welcome = JSON.parse(getWelcome);
}

if (!welcome) {
    closePopup();
}

let loaded = false;
let amounts: { [key: string]: number } = {};

function closePopup() {
    document.getElementById("popup")!.classList.add("d-none");
    document.getElementById("container")!.classList.remove("d-none");
}
function closePopup2() {
    document.getElementById("popup2")!.classList.add("d-none");
    document.getElementById("gamble")!.classList.remove("d-none");
}
async function openPopup3() {
    document.getElementById("popup3")!.classList.remove("d-none");
    document.getElementById("gamble")!.classList.add("d-none");
}
function closePopup3() {
    document.getElementById("popup3")!.classList.add("d-none");
    document.getElementById("gamble")!.classList.remove("d-none");
}

document.getElementById("okButton")?.addEventListener("click", closePopup);

async function order() {
    document.getElementById("popup2")!.classList.remove("d-none");
    document.getElementById("gamble")!.classList.add("d-none");
    document.getElementById("cancel")?.addEventListener("click", closePopup2);
    document.getElementById("order")?.addEventListener("click", finishOrder);
    
    if(!loaded) {
        const drinks: Drink[] = await fetchData("http://localhost:3000/drinks");    
        drinks.forEach(d => {
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
            document.getElementById(d.category)?.appendChild(li);
            document.getElementById(d.name)?.addEventListener("click", () => {orderDrink(d)});
        });
        loaded = true;
    };
}

function orderDrink(d: Drink) {
    if (d.name in amounts) amounts[d.name] += 1
    else amounts[d.name] = 1;
    
    document.getElementById(d.name + "span")!.innerHTML = `X${amounts[d.name]} <svg id="${d.name}trash" role="button" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill text-danger" viewBox="0 0 16 16">
    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
    </svg>`;
    
    document.getElementById(d.name + "trash")?.addEventListener("click", () => trash(d));
    
    updatePrice();
}

function trash(d: Drink) {
    amounts[d.name] = 0;
    document.getElementById(d.name + "span")!.innerHTML = "";
    updatePrice();
}

async function updatePrice() {
    const drinks: Drink[] = await fetchData("http://localhost:3000/drinks");    
    
    let sum = 0;
    
    for (const [key, value] of Object.entries(amounts)) {
        drinks.forEach(d => {
            if (d.name == key) {
                sum += value * d.price;
            }
        });
    }
    
    if (sum != 0) {
        document.getElementById("h3")!.classList.remove("d-none");
    }
    else {
        document.getElementById("h3")!.classList.add("d-none");
    }
    
    document.getElementById("price")!.innerHTML = String(sum)
}

async function finishOrder() {
    const drinks: Drink[] = await fetchData("http://localhost:3000/drinks");    
    let order: Drink[] = [];
    
    for (const [key, value] of Object.entries(amounts)) {
        if (value > 0) {
            for (let i = 0; i < value; i++) {
                drinks.forEach(d => {
                    if (d.name == key) {
                        d.ingredientsInCup = []
                        order.push(d);
                    }
                });
                
            }
        }
        document.getElementById(key + "span")!.innerHTML = "";
    }
    
    if (order.length > 0) {
        let pastOrder = user.order;
        let newOrder = pastOrder.concat(order);
    
        
        closePopup2();
        openPopup3();
    
        document.getElementById("okButton3")?.addEventListener("click", () => {
            closePopup3();
            succes(newOrder);
        });
    }
    else {
        alert("Semmit nem lehet rendelni!")
    }
}

async function succes(order: Drink[]) {    
    if ( await patchData(`http://localhost:3000/users/${user.id}`, { "order": order, "isServed": false })) {
        localStorage.setItem("user", JSON.stringify(await fetchData(`http://localhost:3000/users/${user.id}`)));
        localStorage.setItem("welcome", JSON.stringify(false));
        setMoney(-Number(document.getElementById("price")!.innerHTML));
    }
    else {
        alert("Hiba! Próbálja újra!");
    }
}

document.getElementById("counter")?.addEventListener("click", order);