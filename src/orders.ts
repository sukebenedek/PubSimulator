import { User, Ingredient, Drink, Guest, } from './interfaces.js';
import { drawImage, drawRect, fetchData, patchData, postData, randomN, randomNum, sleep } from "./functions.js";
import { getUser, showUser, getMoney, setMoney } from './user.js';

let user: User = getUser()!;
showUser(document.body, user);

console.log();

export let glass: Drink;

export function loadGlass(index: number = 0) {
    glass = queue[0].order[index]
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

const allGuests: Guest[] = await fetchData<Guest[]>("http://localhost:3000/guests");
const allDrinks: Drink[] = await fetchData<Drink[]>("http://localhost:3000/drinks");
const users: User[] = await fetchData<User[]>("http://localhost:3000/users");
let balanceSpan = document.getElementById("balance");
let balance = users.find(user => user.id == "0")!.money;

balanceSpan!.innerHTML = balance.toString();
// console.log(users);

let queue: Guest[] = [];


let ingredients = await fetchData<Ingredient[]>("http://localhost:3000/ingredients")
let c = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = c.getContext("2d") as CanvasRenderingContext2D
c.height = 775
c.width = 950
let height = c.height;
let width = c.width;


// incomingOrder()

drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx)
let drinkType: Ingredient = ingredients[0];

let currentDrink = 0
let interval: ReturnType<typeof setInterval>;
const glassConstant = 0.1;
const glassBottom = 50
const rowHeight = 14
const glassStart = 230
const cup = new Image();
cup.src = "https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png"
let liquidHeight = 0
let div = document.getElementById("drinks") as HTMLDivElement

export async function incomingOrder() {
    let userAdded = false;

    users.forEach((u: User) => {
        if (!(queue.some(a => a.id === u.id)) && u.order.length > 0 && u.isServed === false) {
            queue.push(convertUserToGuest(u));
            userAdded = true;
        }
    });

    if (!userAdded && queue.length < 10) {
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks: Drink[] = [];

        while (randomDrinks.length < 1) {
            for (let i = 0; i < randomNum(4); i++) {
                let r = allDrinks[randomNum(allDrinks.length)];
                if (!randomDrinks.some(d => d.name === r.name)) {
                    randomDrinks.push(r);
                }
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
    orders!.innerHTML = "";
    queue.forEach(customer => {
        orders!.innerHTML += `
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

export function receiveOrder() { //kiírja a rendelést és frissíti az ital mennyiséget
    let sum = document.getElementById("sum");

    let customerData = document.querySelector(".customerData");

    if (queue.length == 0) {
        sum!.innerHTML = "Nincs rendelés!";
    } else {

        if (glass == undefined) {
            loadGlass()
        }
        // console.log(glass);


        let orderListHTML = `
            <h1 class="text-center" style="margin-top:10px">Rendelés összesítő</h1>
            <h3 id="currentOrder" class="text-center mb-4">${queue[0].name}</h3>
            <ul class="h4" id="orderList">
        `;


        for (let i = 0; i < queue[0].order.length; i++) {
            const drink = queue[0].order[i];
            let state: string;
            // console.log(drink);

            if (drink.ingredientsInCup.length == 0) {
                state = "empty"
            } else if (drink.ingredientsInCup == glass.ingredientsInCup && drink.name == glass.name) {
                state = "current"
            }
            else {
                state = "done"
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

        sum!.innerHTML = orderListHTML;

        if (customerData) {
            sum!.innerHTML = "";
            sum!.appendChild(customerData);
        }
        else {
            const declineBtn = document.getElementById("decline");
            declineBtn!.onclick = () => {
                declineOrder();
            };

            const acceptBtn = document.getElementById("accept");
            acceptBtn!.onclick = () => {
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

            document.getElementById("currentOrder")!.onmouseover = () => {
                document.getElementById("currentOrder")!.style.cursor = "pointer";
            };

            document.getElementById("currentOrder")!.onclick = () => {
                getCustomerData();
            };

            for (let i = 0; i < queue[0].order.length; i++) {
                const drink = queue[0].order[i];
                let drinkClick = document.getElementById(drink.name) as HTMLDivElement
                drinkClick?.addEventListener("click", () => {
                    // console.log(drink.ingredientsRequired);
                    // console.log(glass.ingredientsInCup);

                    if (queue[0].order[i].ingredientsInCup.length == 0) {
                        loadGlass(i)
                        emptyGlass(glass)
                    }
                    else {

                    }
                    receiveOrder()

                })

                drinkClick!.onmouseover = () => {
                    drinkClick!.style.cursor = "pointer";
                };

            }
        }

    }

}

function getCustomerData() {
    let sum = document.getElementById('sum');
    sum!.innerHTML = "";
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

    sum!.appendChild(customerDataDiv);

    const closeBtn = customerDataDiv.querySelector('.closeBtn');
    closeBtn!.addEventListener('click', () => {
        sum!.removeChild(customerDataDiv);
        receiveOrder();
    });
}

async function acceptOrder(u: User | Guest) {
    let orderSum = queue[0].order.reduce((sum, drink) => sum + drink.price, 0);
    let priceInput = document.getElementById("priceInput") as HTMLInputElement;

    if(priceInput.value == "") {
        alert("Kérem adja meg a fizetendő összeget!");
        return;
    }

    if (isUser(u)) {  
        u.isServed = true;
        try {
            await patchData(`http://localhost:3000/users/${u.id}`, { isServed: true,});
        } catch (error) {
            console.log(error);
        }
         localStorage.setItem("user", JSON.stringify(u));
    }

    u.order.forEach(drink => {
        for (let i = 0; i < drink.ingredientsInCup.length; i++) {
            const ingredient = drink.ingredientsRequired[i];
            const ingredientInCup = drink.ingredientsInCup.find(i => i.name == ingredient.name);
            const ingredientAmout = ingredientInCup ? ingredientInCup.amount * 10 : 0;
            console.log(ingredientInCup);
            console.log(drink.ingredientsRequired[i]);
            
            if(ingredientAmout == drink.ingredientsRequired[i].amount && ingredientInCup?.name == drink.ingredientsRequired[i].name) {
                console.log("asd");
                
            }
        }
        console.log(drink.ingredientsRequired);
         
        
    });

    declineOrder();
}

function isUser(u: any): u is User {
    return typeof u == "object" && "isServed" in u;
}

function declineOrder() {
    queue.shift();
    let orders = document.getElementById("orders");
    orders!.innerHTML = "";
    queue.forEach(customer => {
        orders!.innerHTML +=
            `<div class="order">
        <img class="customerImg" src="${customer.img}"/>
        <p class="customerName">${customer.name}</p>
    </div>`;
    });
    emptyGlass(glass);
    receiveOrder();
    // console.log("asd");
}

function convertUserToGuest(u: User): Guest {
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
    }
}


randomIncomingOrder();
receiveOrder();








c?.addEventListener("mousedown", (e) => {
    ctx.fillStyle = drinkType.color;
    currentDrink = 0
    let r = randomN(50, 100)
    let pre = liquidHeight
    interval = setInterval(function () {
        if (!(liquidHeight >= height - glassBottom)) {
            currentDrink++
            r = randomN(50, 100)
            // console.log(currentDrink);
            liquidHeight = pre + currentDrink * rowHeight
            // glass.ingredientsInCup.forEach((ingredient) => {
            //     liquidHeight += ingredient.amount
            // })

            // console.log(liquidHeight);



            drawRect(glassStart - liquidHeight * glassConstant, height - glassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, rowHeight, ctx)
            ctx.drawImage(cup, 0, 0, width, height);

            // drawRect(10, 100, 100, 100, ctx)



        } else {
            // console.log("tele van"); 
        }
    }, r);
})

c?.addEventListener("mouseup", (e) => {
    clearInterval(interval);
    drinkType.amount += currentDrink
    if (!glass.ingredientsInCup.some(ingredient => ingredient.name === drinkType.name)) {
        glass.ingredientsInCup.push(drinkType);
    }

    drawGlass(glass);
    // console.log(glass);
    receiveOrder();
})


ingredients.forEach(i => {
    // console.log(i);
    i.amount = 0
    div.innerHTML += `<div class="ingredientCard card m-1 ${i.name} asd" id=""  style="width: 140px;">
    <img src="${i.img}" class="card-img-top my-2 ingredient" alt="...">
    <div class="card-body m-0">
    <p class="m-0">${i.name}</p>
    </div>
    </div>`

    if(i.name == "Sör"){
    let a = document.querySelector(`.${i.name}`) as HTMLDivElement
        a.classList.add("selected");
    }
});
ingredients.forEach(i => {
    let a = document.querySelector(`.${i.name}`) as HTMLDivElement
    a?.addEventListener("click", () => { selectIngredient(i) })

})

function selectIngredient(i: Ingredient) {
    const allDrinkDiv = document.getElementsByClassName("selected");
    Array.from(allDrinkDiv).forEach(div => {
        div.classList.remove("selected");
    });
    drinkType = i;
    const drinkDiv = document.querySelector(`.${i.name}`) as HTMLDivElement;
    drinkDiv.classList.add("selected")
}

function drawGlass(g: Drink) {
    // console.log(height);

}

export function emptyGlass(g: Drink) {
    ctx.clearRect(0, 0, width, height);
    drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx);

    g.ingredientsInCup = [];
    liquidHeight = 0;
    currentDrink = 0;

    ingredients.forEach(i => i.amount = 0);

    ctx.fillStyle = drinkType.color;
    drawRect(glassStart - liquidHeight * glassConstant, height - glassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, rowHeight, ctx)
    ctx.drawImage(cup, 0, 0, width, height);
}



export { queue }