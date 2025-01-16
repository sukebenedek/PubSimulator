import { fetchData, randomNum, randomRandomNum } from './functions.js';
const allGuests = await fetchData("http://localhost:3000/guests");
const allDrinks = await fetchData("http://localhost:3000/drinks");
let queue = [];
function incomingOrder() {
    let orders = document.getElementById("orders");
    if (queue.length < 10) {
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks = [];
        while (randomDrinks.length < 1) {
            for (let i = 0; i < randomNum(4); i++) {
                randomDrinks.push(allDrinks[randomNum(allDrinks.length)]);
            }
        }
        while (queue.includes(randomGuest)) {
            randomGuest = allGuests[randomNum(allGuests.length)];
        }
        randomGuest.order = randomDrinks;
        queue.push(randomGuest);
        orders.innerHTML +=
            `<div class="order">
            <img class="customerImg" src="${randomGuest.img}"/>
            <p class="customerName">${randomGuest.name}</p>
        </div>`;
        //console.log(order);
        //console.log(randomDrinks);
        console.log(queue);
    }
}
function receiveOrder() {
    let sum = document.getElementById("sum");
    sum.innerHTML = `
    <h1 class="text-center" style="margin-top:10px">Rendelés összesítő</h1>
    <h3 id="currentOrder" class="text-center mb-4">${queue[0].name}</h3>
    <ul class="h4" id="orderList">
        ${queue[0].order.map(drink => `<li class="drinkListItem" id="${drink.name}">${drink.name} - ${drink.price}Ft</li>`).join('')}
    </ul>
    <input type="number" id="money" class="form-control" placeholder="Fizetendő összeg" style="margin: 100px 0px 0px 70px; height: 50px; width: 300px;">
    <button id="decline" class="btn btn-success" style = "margin: 30px 0px 0px 80px; width: 100px; height: 50px">igen</button>
    <button id="accept" class="btn btn-danger" style = "margin: 30px 0px 0px 80px; width: 100px; height: 50px">nem</button>
    `;
    document.getElementById("currentOrder").onmouseover = () => {
        document.getElementById("currentOrder").style.cursor = "pointer";
    };
    document.getElementById("currentOrder").onclick = () => {
        getCustomerData();
    };
}
function getCustomerData() {
    let sum = document.getElementById('sum');
    sum.innerHTML = "";
    const customer = queue[0];
    console.log(customer.name);
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
incomingOrder();
setInterval(incomingOrder, randomRandomNum(50000));
receiveOrder();
