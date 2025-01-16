import {User, Ingredient, Drink, Guest, Order, load, fetchData} from './interfaces.js';

const allGuests: Guest[] = await fetchData<Guest[]>("http://localhost:3000/guests");
const allDrinks: Drink[] = await fetchData<Drink[]>("http://localhost:3000/drinks");

let queue: Guest[] = [];

function incomingOrder() {
let orders = document.getElementById("orders");
let random = Math.floor(Math.random() * allGuests.length);
    if (queue.length < 10) {
        let randomGuest = allGuests[random];
        queue.push(randomGuest);
        orders!.innerHTML += 
        `<div class="order">
            <img class="customerImg" src="${randomGuest.img}"/>
            <p class="customerName">${randomGuest.name}</p>
        </div>`;
        console.log(queue);
    }
}

setInterval(incomingOrder, 1000); 


