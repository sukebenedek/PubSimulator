import { drawImage, drawRect, fetchData, randomN, randomNum } from "./functions.js";
import { getUser, showUser } from './user.js';
//#endregion - import
//#region - canvas valtozok
let c = document.getElementById("canvas");
const ctx = c.getContext("2d");
c.height = 775;
c.width = 950;
let height = c.height;
let width = c.width;
//#endregion - canvas valtozok
//#region - valtozok
export let glass;
const allGuests = await fetchData("http://localhost:3000/guests");
const allDrinks = await fetchData("http://localhost:3000/drinks");
const users = await fetchData("http://localhost:3000/users");
let ingredients = await fetchData("http://localhost:3000/ingredients");
let queue = [];
let user = getUser();
showUser(document.body, user);
let balanceSpan = document.getElementById("balance");
let balance = users.find(user => user.id == "0").money;
balanceSpan.innerHTML = balance.toString();
let servedUsers;
let drinkFillLevels = {};
let drinkType = ingredients[0];
let currentDrink = 0;
let interval;
if (localStorage.getItem("served") == null || localStorage.getItem("served") == undefined || localStorage.getItem("served") == "") {
    servedUsers = [];
}
else {
    servedUsers = JSON.parse(localStorage.getItem("served"));
}
//#endregion - valtozok
//#region - pohar valtozok
drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx);
const glassConstant = 0.1;
const glassBottom = 50;
const rowHeight = 14;
const glassStart = 230;
const cup = new Image();
cup.src = "https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png";
let liquidHeight = 0;
let div = document.getElementById("drinks");
//#endregion - pohar valtozok
//#region - rendelesfelvetel
export async function incomingOrder() {
    let userAdded = false;
    users.forEach((u) => {
        if (!(queue.some(a => a.id === u.id)) && u.order.length > 0 && u.isServed === false && !servedUsers.map(u => u.id).includes(u.id)) {
            queue.push(convertUserToGuest(u));
            userAdded = true;
        }
    });
    if (!userAdded && queue.length < 10) { //guestek berakasa a queueba
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks = [];
        while (randomDrinks.length < 1) { //rendeles generalasa
            for (let i = 0; i < randomNum(4); i++) {
                let r = allDrinks[randomNum(allDrinks.length)];
                if (!randomDrinks.some(d => d.name === r.name)) {
                    randomDrinks.push(r);
                }
            }
        }
        while (queue.some(g => g.id === randomGuest.id)) { //nem engedi belerakni ketszer ugyyanazt a guestet
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
                <p class="customerName goldenGlow">${customer.name}</p>
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
    let sum = document.getElementById("sum"); //ide irja ki
    let customerData = document.querySelector(".customerData");
    if (queue.length == 0) {
        sum.innerHTML = "Nincs rendelés!";
    }
    else {
        if (glass == undefined) { //Ez nullazza a poharat?
            loadGlass();
        }
        let orderListHTML = `
            <h1 class="text-center whiteGlow" style="margin-top:10px">Rendelés összesítő</h1>
            <h3 id="currentOrder" class="text-center mb-4 whiteGlow login">${queue[0].name}</h3>
            <ul class="h4" id="orderList">
        `;
        //drinkek kiirása
        for (let i = 0; i < queue[0].order.length; i++) {
            const drink = queue[0].order[i];
            let state;
            drink.index = i;
            if (drink.ingredientsInCup.length == 0) {
                state = "ÜRES";
            }
            else if (drink.ingredientsInCup == glass.ingredientsInCup && drink.name == glass.name) {
                state = "JELENLEGI";
            }
            else {
                state = "KÉSZ";
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
            //hozzavalok es azok mennyisegebek kiirasa
            for (let j = 0; j < drink.ingredientsRequired.length; j++) {
                const ingredient = drink.ingredientsRequired[j];
                const ingredientInCup = drink.ingredientsInCup.find((i) => {
                    return i.name == ingredient.name; //&& drink.index === glass.index
                });
                const ingredientAmout = ingredientInCup == undefined ? 0 : ingredientInCup.amount * 10;
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
        }
        //ar input mezo
        let priceInput = document.getElementById("priceInput");
        if (!priceInput || priceInput.value == "") { //ha nincs beleirva nullazza
            orderListHTML += `
                </ul>
                <input type="number" id="priceInput" class="form-control" placeholder="Fizetendő összeg" style="margin: 100px 0px 0px 70px; height: 50px; width: 300px;"> 
                <button id="accept" class="btn login greenGlow" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">igen</button>
                <button id="decline" class="btn login redGlow" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">nem</button>
            `;
        }
        else { //ha van beleirva benenmarad
            orderListHTML += `
                </ul>
                <input type="number" id="priceInput" value="${priceInput.value}" class="form-control" placeholder="Fizetendő összeg" style="margin: 100px 0px 0px 70px; height: 50px; width: 300px;"> 
                <button id="accept" class="btn login greenGlow" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">igen</button>
                <button id="decline" class="btn login redGlow" style="margin: 30px 0px 0px 80px; width: 100px; height: 50px">nem</button>
            `;
        }
        sum.innerHTML = orderListHTML;
        if (customerData) { //ha meg van nyitva az adatlap nem ir ki mast
            sum.innerHTML = "";
            sum.appendChild(customerData);
        }
        else { //ha nincs megnyitva latszodnak a gombok
            const declineBtn = document.getElementById("decline"); //elutasit
            declineBtn.onclick = () => {
                declineOrder();
            };
            const acceptBtn = document.getElementById("accept"); //elfogad
            acceptBtn.onclick = () => {
                if (users.some(user => user.username == queue[0].name)) { //ha user az epp kiszolgalt vendeg vele hivja meg
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].isServed == false && users[i].username == queue[0].name) {
                            acceptOrder(users[i]);
                        }
                    }
                }
                else { //ha guest guesttel hivja meg
                    acceptOrder(queue[0]);
                }
            };
            document.getElementById("currentOrder").onmouseover = () => {
                document.getElementById("currentOrder").style.cursor = "pointer";
            };
            document.getElementById("currentOrder").onclick = () => {
                getCustomerData();
            };
            for (let i = 0; i < queue[0].order.length; i++) { //drinkek kozotti valtas
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
//#endregion - rendelesfelvetel
//#region - lehetosegek a rendeleskor
function getCustomerData() {
    let sum = document.getElementById('sum');
    sum.innerHTML = ""; //kiuriti a sumot hogy ne legyen benne semmi
    const customer = queue[0];
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
        <button class="closeBtn login">[Bezár]</button>
    `;
    sum.appendChild(customerDataDiv); //belerakja az adatgokt a sumba
    const closeBtn = customerDataDiv.querySelector('.closeBtn');
    closeBtn.addEventListener('click', () => {
        sum.removeChild(customerDataDiv);
        receiveOrder(); //bezaras gomb megnyomasakor meghivja a receiveordert hogy kiirja az aktualis adatokat
    });
}
async function acceptOrder(u) {
    let priceInput = document.getElementById("priceInput"); //a fizetendo osszeg inputja
    if (priceInput.value == "") { //ha ures nem enged tovabb
        alert("Kérem adja meg a fizetendő összeget!");
        return;
    }
    if (isUser(u)) { //ha user akkor frissiti a statuszt servedre
        u.isServed = true;
        u.order = [];
        servedUsers.push(u);
        localStorage.setItem("served", JSON.stringify(servedUsers));
    }
    calculatePrice(u);
    declineOrder(); //az aktualis vasarlo eltavolitasa a sorbol es a kovetkezo kiszolgalasa
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
}
function calculatePrice(u) {
    let price = 0;
    u.order.forEach(drink => {
        price += drink.price;
    });
    for (let i = 0; i < u.order.length; i++) { //vegigmegy az orderen
        const drink = u.order[i];
        for (let j = 0; j < drink.ingredientsRequired.length; j++) { //vegigmegy a drink osszetevoin
            const ingredient = drink.ingredientsRequired[j];
            const ingredientInCup = drink.ingredientsInCup.find(i => i.name == ingredient.name); //ezek csak azok amik benne vannak ES kellenek is bele
            console.log(`Kell: ${ingredient.name} ${ingredient.amount}ml`); // Kilogolja aminek benne kene lennie
            console.log(`Van: ${ingredientInCup ? ingredientInCup.name : 'None'} ${ingredientInCup ? ingredientInCup.amount * 10 : '0'}ml`); // Kilogolja ami benne van
            console.log(`Ital ara: ${price} Ft`);
            if (ingredientInCup) { //TODO NEM JOL SZAMOLJA KI
                const ingredientAmount = ingredientInCup.amount * 10;
                let accuracy = 0;
                // Osszetevo mennyiseg ellenorzes
                if (ingredientAmount === ingredient.amount) {
                    accuracy = 1;
                }
                else if (ingredientAmount > ingredient.amount) {
                    accuracy = 0.8;
                }
                else {
                    accuracy = 0.5;
                }
                // Jo osszetevo?
                if (ingredientInCup.name !== ingredient.name) {
                    accuracy *= 0.5;
                }
                // Kalkulacio
                price += drink.price * accuracy;
                console.log(`${ingredient.name}: ${ingredientAmount}ml / ${ingredient.amount}ml, Pontossag: ${accuracy * 100}%`);
            }
        }
    }
    console.log(`Kapott penz: ${price} Ft`);
}
//#endregion - lehetosegek a rendeleskor
//#region - tovabbi funkciok
function isUser(u) {
    return typeof u == "object" && "isServed" in u;
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
function saveGlassState(index) {
    if (glass && glass.name) {
        drinkFillLevels[`${glass.name}_${index}`] = [...glass.ingredientsInCup];
    }
}
function selectIngredient(i) {
    const allDrinkDiv = document.getElementsByClassName("selected");
    Array.from(allDrinkDiv).forEach(div => {
        div.classList.remove("selected");
    });
    drinkType = i;
    const drinkDiv = document.querySelector(`.${i.name}`);
    drinkDiv.classList.add("selected");
}
function displayIngredients() {
    ingredients.forEach(i => {
        div.innerHTML += `<div class="ingredientCard card m-1 ${i.name} asd" id=""  style="width: 140px;">
        <img src="${i.img}" class="card-img-top my-2 ingredient" alt="...">
        <div class="card-body m-0">
        <p class="m-0">${i.name}</p>
        </div>
        </div>`;
        if (i.name == "Sör") { //sor alapertelmezett kivalasztasa
            let a = document.querySelector(`.${i.name}`);
            a.classList.add("selected");
        }
    });
    ingredients.forEach(i => {
        let a = document.querySelector(`.${i.name}`);
        a === null || a === void 0 ? void 0 : a.addEventListener("click", () => { selectIngredient(i); });
    });
}
//#endregion  - tovabbi funkciok
//program kezdetehez meg kell hivni
displayIngredients();
randomIncomingOrder();
receiveOrder();
function loadGlass(index = 0) {
    saveGlassState(index);
    glass = queue[0].order[index];
    const savedState = drinkFillLevels[`${glass.name}_${index}`];
    if (savedState) {
        glass.ingredientsInCup = savedState.map(ingredient => (Object.assign({}, ingredient)));
    }
    else {
        glass.ingredientsInCup = [];
    }
}
c === null || c === void 0 ? void 0 : c.addEventListener("mousedown", (e) => {
    ctx.fillStyle = drinkType.color;
    currentDrink = 0;
    let r = randomN(50, 100);
    let pre = liquidHeight;
    interval = setInterval(function () {
        if (!(liquidHeight >= height - glassBottom)) {
            currentDrink++;
            r = randomN(50, 100);
            liquidHeight = pre + currentDrink * rowHeight;
            // glass.ingredientsInCup.forEach((ingredient) => {
            //     liquidHeight += ingredient.amount
            // })
            drawRect(glassStart - liquidHeight * glassConstant, height - glassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, rowHeight, ctx);
            ctx.drawImage(cup, 0, 0, width, height);
            // drawRect(10, 100, 100, 100, ctx)
        }
        else {
        }
    }, r);
});
c === null || c === void 0 ? void 0 : c.addEventListener("mouseup", (e) => {
    saveGlassState(currentDrink);
    clearInterval(interval);
    drinkType.amount += currentDrink;
    if (!glass.ingredientsInCup.some(ingredient => ingredient.name === drinkType.name)) {
        glass.ingredientsInCup.push(drinkType);
    }
    glass.ingredientsInCup.find((a) => a.name == drinkType.name).amount = drinkType.amount;
    //mitől működik félig???
    drawGlass(glass);
    receiveOrder();
});
function drawGlass(g) {
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
