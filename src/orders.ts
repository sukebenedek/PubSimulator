import { User, Ingredient, Drink, Guest,} from './interfaces.js';
import { fetchData, randomNum } from './functions.js';

const allGuests: Guest[] = await fetchData<Guest[]>("http://localhost:3000/guests");
const allDrinks: Drink[] = await fetchData<Drink[]>("http://localhost:3000/drinks");

let queue: Guest[] = [];

function incomingOrder() {
    let orders = document.getElementById("orders");
    if (queue.length < 10) {
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks = [];
        for (let i = 0; i < randomNum(4); i++) {
            randomDrinks.push(allDrinks[randomNum(allDrinks.length)]);
        }

        while (queue.includes(randomGuest)) {
            randomGuest = allGuests[randomNum(allGuests.length)];
        }
        randomGuest.order = randomDrinks
        queue.push(randomGuest);

        orders!.innerHTML +=
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


