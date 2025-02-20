import { drawImage, drawRect, fetchData, randomN, randomNum, sleep } from "./functions.js";
console.log();
export let glass;
export function loadGlass(index = 0) {
    glass = queue[0].order[index];
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
console.log(users);
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
    users.forEach((u) => {
        if (!(queue.map(a => a.id).includes(u.id)) && u.order.length > 0) {
            console.log(users.map(a => a.id));
            console.log(u.id);
            queue.push(convertUserToGuest(u));
            sleep(randomNum(5000));
        }
    });
    let orders = document.getElementById("orders");
    if (queue.length < 10) {
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks = [];
        while (randomDrinks.length < 1) {
            for (let i = 0; i < randomNum(4); i++) {
                let r = allDrinks[randomNum(allDrinks.length)];
                if (!randomDrinks.some(d => d.name === r.name)) {
                    randomDrinks.push(r);
                }
            }
        }
        while (queue.includes(randomGuest)) {
            randomGuest = allGuests[randomNum(allGuests.length)];
        }
        randomGuest.order = randomDrinks;
        queue.push(randomGuest);
        orders.innerHTML = "";
        queue.forEach(customer => {
            orders.innerHTML +=
                `<div class="order">
            <img class="customerImg" src="${customer.img}"/>
            <p class="customerName">${customer.name}</p>
            </div>`;
        });
    }
    receiveOrder();
    // loadGlass(); nem tudom mit csinal !!!! 
}
function randomIncomingOrder() {
    const randomDelay = randomNum(10000);
    setTimeout(() => {
        incomingOrder();
        randomIncomingOrder();
    }, randomDelay);
}
export function receiveOrder() {
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
        for (let i = 0; i < queue[0].order.length; i++) {
            const drink = queue[0].order[i];
            let state;
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
                <li class="drinkListItem" id="${drink.name}">
                    <div class="drinkItem">
       
                        <div class="shadow">
                            <img class="drinkImg" src="${drink.img}" alt="${drink.name}">
                        </div>
                        <span class="drinkText">${drink.name} - ${drink.price}Ft ${state}</span>
                    </div>
                    <ul class="ingredientsList">

            `;
            for (let j = 0; j < drink.ingredientsRequired.length; j++) {
                const ingredient = drink.ingredientsRequired[j];
                //  console.log(drink.ingredientsInCup);
                const ingredientInCup = drink.ingredientsInCup.find(i => i.name == ingredient.name);
                const ingredientAmout = ingredientInCup ? ingredientInCup.amount * 10 : 0;
                const red = ingredientAmout < ingredient.amount ? "color: red;" : "";
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
        orderListHTML += `
            </ul>
            <input type="number" id="priceInput" class="form-control" placeholder="Fizetendő összeg" style="margin: 100px 0px 0px 70px; height: 50px; width: 300px;"> 
            <button id="accept" class="btn btn-success" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">igen</button>
            <button id="decline" class="btn btn-danger" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">nem</button>
        `;
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
                acceptOrder();
            };
            document.getElementById("currentOrder").onmouseover = () => {
                document.getElementById("currentOrder").style.cursor = "pointer";
            };
            document.getElementById("currentOrder").onclick = () => {
                getCustomerData();
            };
            for (let i = 0; i < queue[0].order.length; i++) {
                const drink = queue[0].order[i];
                let drinkClick = document.getElementById(drink.name);
                drinkClick === null || drinkClick === void 0 ? void 0 : drinkClick.addEventListener("click", () => {
                    // console.log(drink.ingredientsRequired);
                    // console.log(glass.ingredientsInCup);
                    if (queue[0].order[i].ingredientsInCup.length == 0) {
                        loadGlass(i);
                        emptyGlass(glass);
                    }
                    else {
                    }
                    receiveOrder();
                });
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
function acceptOrder() {
    let orderSum = queue[0].order.reduce((sum, drink) => sum + drink.price, 0);
    let priceInput = document.getElementById("priceInput");
    // if (priceInput!.value == orderSum.toString()) {
    // }
    // else {
    //     // console.log("nem jo");
    // }
}
function declineOrder() {
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
        glass.ingredientsInCup.push(drinkType);
    }
    drawGlass(glass);
    // console.log(glass);
    receiveOrder();
});
ingredients.forEach(i => {
    // console.log(i);
    i.amount = 0;
    div.innerHTML += `<div class="ingredientCard card m-1 ${i.name} asd" id=""  style="width: 140px;">
    <img src="${i.img}" class="card-img-top my-2 ingredient" alt="...">
    <div class="card-body m-0">
    <p class="m-0">${i.name}</p>
    </div>
    </div>`;
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
    drawRect(glassStart - liquidHeight * glassConstant, height - glassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, rowHeight, ctx);
    ctx.drawImage(cup, 0, 0, width, height);
}
export { queue };
