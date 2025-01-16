import { fetchData } from './interfaces.js';
const allGuests = await fetchData("http://localhost:3000/guests");
const allDrinks = await fetchData("http://localhost:3000/drinks");
let queue = [];
function incomingOrder() {
    let orders = document.getElementById("orders");
    let random = Math.floor(Math.random() * allGuests.length);
    if (queue.length < 10) {
        let randomGuest = allGuests[random];
        queue.push(randomGuest);
        orders.innerHTML +=
            `<div class="order">
            <img class="customerImg" src="${randomGuest.img}"/>
            <p class="customerName">${randomGuest.name}</p>
        </div>`;
        console.log(queue);
    }
}
setInterval(incomingOrder, 1000);
