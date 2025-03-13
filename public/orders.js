import { drawImage, drawRect, fetchData, randomN, randomNum } from "./functions.js";
import { getUser, showUser } from './user.js';
let user = getUser();
showUser(document.body, user);
export let glass;
export function loadGlass(index = 0) {
    saveGlassState();
    glass = queue[0].order[index];
    if (drinkFillLevels[glass.name]) {
        glass.ingredientsInCup = [...drinkFillLevels[glass.name]];
    }
    else {
        glass.ingredientsInCup = [];
    }
}
// export function addToQueue(user: User) {
//     let guest: Guest = {
//         name: user.username,
//         money: user.money,
//         drunkness: user.drunkness,
//         img: user.img,
//         order: user.order,
//         age: 0,
//         stinkness: 0,
//     };
//     queue.push(guest);
// }
const allGuests = await fetchData("http://localhost:3000/guests");
const allDrinks = await fetchData("http://localhost:3000/drinks");
const users = await fetchData("http://localhost:3000/users");
let balanceSpan = document.getElementById("balance");
let balance = users.find(user => user.id == "0").money;
let servedUsers;
let drinkFillLevels = {};
if (localStorage.getItem("served") == null || localStorage.getItem("served") == undefined || localStorage.getItem("served") == "") {
    servedUsers = [];
}
else {
    servedUsers = JSON.parse(localStorage.getItem("served"));
}
// console.log(servedUsers);
//console.log(servedUsers);
balanceSpan.innerHTML = balance.toString();
// console.log(users);
let queue = [];
let ingredients = await fetchData("http://localhost:3000/ingredients");
let c = document.getElementById("canvas");
const ctx = c.getContext("2d");
c.height = 775;
c.width = 950;
let height = c.height;
let width = c.width;
// incomingOrder()
drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx);
let drinkType = ingredients[0];
let currentDrink = 0;
let interval;
const glassConstant = 0.1;
const glassBottom = 50;
const rowHeight = 14;
const glassStart = 230;
const cup = new Image();
cup.src = "https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png";
let liquidHeight = 0;
let div = document.getElementById("drinks");
export async function incomingOrder() {
    // console.log(users);
    let userAdded = false;
    users.forEach((u) => {
        if (!(queue.some(a => a.id === u.id)) && u.order.length > 0 && u.isServed === false && !servedUsers.map(u => u.id).includes(u.id)) {
            queue.push(convertUserToGuest(u));
            userAdded = true;
        }
    });
    if (!userAdded && queue.length < 10) {
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks = [];
        while (randomDrinks.length < 1) {
            for (let i = 0; i < randomNum(4); i++) {
                let r = allDrinks[randomNum(allDrinks.length)];
                // if (!randomDrinks.some(d => d.name === r.name)) {
                randomDrinks.push(r);
                // }
            }
        }
        while (queue.some(g => g.id === randomGuest.id)) {
            randomGuest = allGuests[randomNum(allGuests.length)];
        }
        randomGuest.order = randomDrinks;
        queue.push(randomGuest);
    }
    updateOrdersUI();
    receiveOrder();
}
function updateOrdersUI() {
    let orders = document.getElementById("orders");
    orders.innerHTML = "";
    queue.forEach(customer => {
        orders.innerHTML += `
            <div class="order">
                <img class="customerImg" src="${customer.img}"/>
                <p class="customerName">${customer.name}</p>
            </div>`;
    });
}
function randomIncomingOrder() {
    const randomDelay = randomNum(10000);
    setTimeout(() => {
        incomingOrder();
        randomIncomingOrder();
    }, randomDelay);
}
export function receiveOrder() {
    //darabokba bonáts
    let sum = document.getElementById("sum");
    let customerData = document.querySelector(".customerData");
    if (queue.length == 0) {
        sum.innerHTML = "Nincs rendelés!";
    }
    else {
        if (glass == undefined) {
            loadGlass();
        }
        // console.log(glass);
        let orderListHTML = `
            <h1 class="text-center" style="margin-top:10px">Rendelés összesítő</h1>
            <h3 id="currentOrder" class="text-center mb-4">${queue[0].name}</h3>
            <ul class="h4" id="orderList">
        `;
        //drinkek kiirása
        for (let i = 0; i < queue[0].order.length; i++) {
            const drink = queue[0].order[i];
            let state;
            drink.index = i;
            // console.log(drink);
            if (drink.ingredientsInCup.length == 0) {
                state = "empty";
            }
            else if (drink.ingredientsInCup == glass.ingredientsInCup && drink.name == glass.name) {
                state = "current";
            }
            else {
                state = "done";
            }
            orderListHTML += `
                <li class="drinkListItem" id="${drink.name + i}">
                    <div class="drinkItem">
       
                        <div class="shadow">
                            <img class="drinkImg" src="${drink.img}" alt="${drink.name}">
                        </div>
                        <span class="drinkText">${drink.name} - ${drink.price}Ft ${state}</span>
                    </div>
                    <ul class="ingredientsList">

            `;
            console.log(queue[0].order);
            for (let j = 0; j < drink.ingredientsRequired.length; j++) {
                const ingredient = drink.ingredientsRequired[j];
                const ingredientInCup = drink.ingredientsInCup.find((i) => {
                    return i.name == ingredient.name; //&& drink.index === glass.index
                    console.log(ingredient.name);
                    console.log(i.name);
                });
                const ingredientAmout = ingredientInCup == undefined ? 0 : ingredientInCup.amount * 10;
                console.log(ingredientInCup);
                const red = ingredientAmout < ingredient.amount ? "color: red;" : "";
                console.log("glass: ");
                console.log(glass.index);
                orderListHTML += `
                    <li style="${red} list-style-type: none; margin-bottom: 5px;">
                        ${ingredient.name}: ${ingredientAmout}ml / ${ingredient.amount}ml
                    </li>
                `;
            }
            orderListHTML += `
                    </ul>
                </li>
            `;
            // console.log(drink.name);
        }
        let priceInput = document.getElementById("priceInput");
        if (!priceInput || priceInput.value == "") {
            orderListHTML += `
                </ul>
                <input type="number" id="priceInput" class="form-control" placeholder="Fizetendő összeg" style="margin: 100px 0px 0px 70px; height: 50px; width: 300px;"> 
                <button id="accept" class="btn btn-success" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">igen</button>
                <button id="decline" class="btn btn-danger" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">nem</button>
            `;
        }
        else {
            orderListHTML += `
                </ul>
                <input type="number" id="priceInput" value="${priceInput.value}" class="form-control" placeholder="Fizetendő összeg" style="margin: 100px 0px 0px 70px; height: 50px; width: 300px;"> 
                <button id="accept" class="btn btn-success" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">igen</button>
                <button id="decline" class="btn btn-danger" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">nem</button>
            `;
        }
        sum.innerHTML = orderListHTML;
        if (customerData) {
            sum.innerHTML = "";
            sum.appendChild(customerData);
        }
        else {
            const declineBtn = document.getElementById("decline");
            declineBtn.onclick = () => {
                declineOrder();
            };
            const acceptBtn = document.getElementById("accept");
            acceptBtn.onclick = () => {
                //console.log(queue);
                if (users.some(user => user.username == queue[0].name)) {
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].isServed == false && users[i].username == queue[0].name) {
                            acceptOrder(users[i]);
                        }
                    }
                }
                else {
                    acceptOrder(queue[0]);
                }
            };
            document.getElementById("currentOrder").onmouseover = () => {
                document.getElementById("currentOrder").style.cursor = "pointer";
            };
            document.getElementById("currentOrder").onclick = () => {
                getCustomerData();
            };
            for (let i = 0; i < queue[0].order.length; i++) {
                const drink = queue[0].order[i];
                let drinkClick = document.getElementById(drink.name + i);
                drinkClick === null || drinkClick === void 0 ? void 0 : drinkClick.addEventListener("click", () => {
                    if (queue[0].order[i].ingredientsInCup.length == 0) {
                        loadGlass(i);
                        emptyGlass(glass);
                    }
                });
                drinkClick.onmouseover = () => {
                    drinkClick.style.cursor = "pointer";
                };
            }
        }
    }
}
function getCustomerData() {
    let sum = document.getElementById('sum');
    sum.innerHTML = "";
    const customer = queue[0];
    // console.log(customer.name);
    const customerDataDiv = document.createElement('div');
    customerDataDiv.classList.add('customerData');
    customerDataDiv.innerHTML = `
        <h2>Információk</h2>
        <img style = "border-radius:20px;" src="${customer.img}"/>
        <p>Név: ${customer.name}</p>
        <p>Életkor: ${customer.age} év</p>
        <p>Vagyon: ${customer.money}Ft</p>
        <p>Részegség: ${customer.drunkness}%</p>
        <p>Büdösség: ${customer.stinkness}%</p>
        <button class="closeBtn">Bezár</button>
    `;
    sum.appendChild(customerDataDiv);
    const closeBtn = customerDataDiv.querySelector('.closeBtn');
    closeBtn.addEventListener('click', () => {
        sum.removeChild(customerDataDiv);
        receiveOrder();
    });
}
async function acceptOrder(u) {
    let priceInput = document.getElementById("priceInput");
    let orderSum = user.order.reduce((sum, drink) => sum + drink.price, 0);
    if (priceInput.value == "") {
        alert("Kérem adja meg a fizetendő összeget!");
        return;
    }
    if (isUser(u)) {
        //console.log(users);
        u.isServed = true;
        u.order = [];
        servedUsers.push(u);
        localStorage.setItem("served", JSON.stringify(servedUsers));
        //console.log(users);
    }
    u.order.forEach(drink => {
        drink.ingredientsRequired.forEach(ingredient => {
            const ingredientInCup = drink.ingredientsInCup.find(i => i.name == ingredient.name);
            if (ingredientInCup) {
                const ingredientAmount = ingredientInCup.amount * 10;
                console.log(ingredientAmount);
            }
        });
    });
    declineOrder();
}
function calculatePrice(order) {
    let price = 0;
    order.forEach(drink => {
        price += drink.price;
    });
    return price;
}
function isUser(u) {
    return typeof u == "object" && "isServed" in u;
}
function declineOrder() {
    let priceInput = document.getElementById("priceInput");
    priceInput.value = "";
    queue.shift();
    let orders = document.getElementById("orders");
    orders.innerHTML = "";
    queue.forEach(customer => {
        orders.innerHTML +=
            `<div class="order">
        <img class="customerImg" src="${customer.img}"/>
        <p class="customerName">${customer.name}</p>
    </div>`;
    });
    emptyGlass(glass);
    receiveOrder();
    // console.log("asd");
}
function convertUserToGuest(u) {
    // console.log(u.order);
    return {
        "name": u.username,
        "money": u.money,
        "drunkness": u.drunkness,
        "age": randomN(18, 99),
        "stinkness": randomN(0, 100),
        "img": u.img,
        "order": u.order,
        "id": u.id,
    };
}
function saveGlassState() {
    if (glass) {
        drinkFillLevels[glass.name] = [...glass.ingredientsInCup];
    }
}
randomIncomingOrder();
receiveOrder();
c === null || c === void 0 ? void 0 : c.addEventListener("mousedown", (e) => {
    ctx.fillStyle = drinkType.color;
    currentDrink = 0;
    let r = randomN(50, 100);
    let pre = liquidHeight;
    interval = setInterval(function () {
        if (!(liquidHeight >= height - glassBottom)) {
            currentDrink++;
            r = randomN(50, 100);
            // console.log(currentDrink);
            liquidHeight = pre + currentDrink * rowHeight;
            // glass.ingredientsInCup.forEach((ingredient) => {
            //     liquidHeight += ingredient.amount
            // })
            // console.log(liquidHeight);
            drawRect(glassStart - liquidHeight * glassConstant, height - glassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, rowHeight, ctx);
            ctx.drawImage(cup, 0, 0, width, height);
            // drawRect(10, 100, 100, 100, ctx)
        }
        else {
            // console.log("tele van"); 
        }
    }, r);
});
c === null || c === void 0 ? void 0 : c.addEventListener("mouseup", (e) => {
    clearInterval(interval);
    drinkType.amount += currentDrink;
    if (!glass.ingredientsInCup.some(ingredient => ingredient.name === drinkType.name)) {
        //console.log(drinkType);
        glass.ingredientsInCup.push(drinkType);
    }
    glass.ingredientsInCup.find((a) => a.name == drinkType.name).amount = drinkType.amount;
    //mitől működik félig???
    console.log(glass);
    drawGlass(glass);
    // console.log(glass);
    receiveOrder();
});
ingredients.forEach(i => {
    // console.log(i);
    div.innerHTML += `<div class="ingredientCard card m-1 ${i.name} asd" id=""  style="width: 140px;">
    <img src="${i.img}" class="card-img-top my-2 ingredient" alt="...">
    <div class="card-body m-0">
    <p class="m-0">${i.name}</p>
    </div>
    </div>`;
    if (i.name == "Sör") {
        let a = document.querySelector(`.${i.name}`);
        a.classList.add("selected");
    }
});
ingredients.forEach(i => {
    let a = document.querySelector(`.${i.name}`);
    a === null || a === void 0 ? void 0 : a.addEventListener("click", () => { selectIngredient(i); });
});
function selectIngredient(i) {
    const allDrinkDiv = document.getElementsByClassName("selected");
    Array.from(allDrinkDiv).forEach(div => {
        div.classList.remove("selected");
    });
    drinkType = i;
    const drinkDiv = document.querySelector(`.${i.name}`);
    drinkDiv.classList.add("selected");
}
function drawGlass(g) {
    // console.log(height);
}
export function emptyGlass(g) {
    ctx.clearRect(0, 0, width, height);
    drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx);
    g.ingredientsInCup = [];
    liquidHeight = 0;
    currentDrink = 0;
    ingredients.forEach(i => i.amount = 0);
    ctx.fillStyle = drinkType.color;
    // drawRect(glassStart - liquidHeight * glassConstant, height - gassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, rowHeight, ctx)
    //ez mi???
    ctx.drawImage(cup, 0, 0, width, height);
}
export { queue };
