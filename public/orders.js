import { fetchData, randomNum } from './functions.js';
const allGuests = await fetchData("http://localhost:3000/guests");
const allDrinks = await fetchData("http://localhost:3000/drinks");
let queue = [];
function incomingOrder() {
    let orders = document.getElementById("orders");
    if (queue.length < 10) {
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks = [];
        for (let i = 0; i < randomNum(4); i++) {
            randomDrinks.push(allDrinks[randomNum(allDrinks.length)]);
        }
        let order = {
            customer: randomGuest,
            drinks: randomDrinks
        };
        while (queue.includes(randomGuest)) {
            randomGuest = allGuests[randomNum(allGuests.length)];
        }
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
}
setInterval(incomingOrder, 1000);
