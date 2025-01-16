import {User, Ingredient, Drink, Guest, Order, load, fetchData} from './interfaces.js';

const allGuests: Guest[] = await fetchData<Guest[]>("http://localhost:3000/guests");

console.log(allGuests[1]);

let queue: Guest[] = [];

function incomingOrder() {
    if (queue.length < 10) {
        let randomGuest = allGuests[Math.floor(Math.random() * allGuests.length)];
        queue.push(randomGuest);
        console.log(queue);
    }
}


setInterval(incomingOrder, 10000); 


