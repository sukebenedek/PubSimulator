//#region - import
import { User, Ingredient, Drink, Guest, } from './interfaces.js';
import { drawImage, drawRect, fetchData, patchData, postData, randomN, randomNum, sleep , isUser, convertUserToGuest} from "./functions.js";
import { getUser, showUser, getMoney, setMoney } from './user.js';
import { getCustomerData , declineOrder} from './customer.js';
import { calculatePrice} from './money.js';
import { displayIngredients} from './ingredients.js';
//#endregion - import

//#region - canvas valtozok
let c = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = c.getContext("2d") as CanvasRenderingContext2D
c.height = 775
c.width = 950
let height = c.height;
let width = c.width;
//#endregion - canvas valtozok

//#region - valtozok
export let glass: Drink;
const allGuests: Guest[] = await fetchData<Guest[]>("http://localhost:3000/guests");
const allDrinks: Drink[] = await fetchData<Drink[]>("http://localhost:3000/drinks");
const users: User[] = await fetchData<User[]>("http://localhost:3000/users");
export let ingredients = await fetchData<Ingredient[]>("http://localhost:3000/ingredients")
let queue: Guest[] = [];
let user: User = getUser()!;
showUser(document.body, user);
let balanceSpan = document.getElementById("balance");
let balance = users.find(user => user.id == "0")!.money;
balanceSpan!.innerHTML = balance.toString();
let servedUsers: User[] ;
let drinkFillLevels: { [key: string]: Ingredient[] } = {};
let drinkType: Ingredient = ingredients[0];
let currentDrink = 0
let interval: ReturnType<typeof setInterval>;
if (localStorage.getItem("served") ==  null || localStorage.getItem("served") == undefined || localStorage.getItem("served") == "") {
    servedUsers = [];
} else {
    servedUsers = JSON.parse(localStorage.getItem("served")!);
}
//#endregion - valtozok

//#region - pohar valtozok
drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx)
const glassConstant = 0.1;
const glassBottom = 50
const rowHeight = 14
const glassStart = 230
const cup = new Image();
cup.src = "https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png"
let liquidHeight = 0

c?.addEventListener("mousedown", (e) => {
    ctx.fillStyle = drinkType.color;
    currentDrink = 0
    let r = randomN(50, 100)
    let pre = liquidHeight
    interval = setInterval(function () {
        if (!(liquidHeight >= height - glassBottom)) {
            currentDrink++
            r = randomN(50, 100)
            liquidHeight = pre + currentDrink * rowHeight


            drawRect(glassStart - liquidHeight * glassConstant, height - glassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, rowHeight, ctx)
            ctx.drawImage(cup, 0, 0, width, height);




        } else {
        }
    }, r);
})

c?.addEventListener("mouseup", (e) => {
    clearInterval(interval);
    (drinkType.amount == undefined) ? drinkType.amount = 0 : drinkType.amount += currentDrink
   
    
    if (!glass.ingredientsInCup.some(ingredient => ingredient.name === drinkType.name)) {
        
        glass.ingredientsInCup.push(
            {
            "name": drinkType.name,
            "price": drinkType.price,
            "alcohol": drinkType.alcohol,
            "img" : drinkType.img,
            "amount" : drinkType.amount,
            "color" : drinkType.color
            }
            
        );
    }

        glass.ingredientsInCup.find((a) => a.name == drinkType.name)!.amount = drinkType.amount;
    //mitől működik félig???

    receiveOrder();
})

export function selectIngredient(i: Ingredient) { //ingredientek kozotti valtas
    const allDrinkDiv = document.getElementsByClassName("selected");
    Array.from(allDrinkDiv).forEach(div => {
        div.classList.remove("selected");
    });
    drinkType = i;

    const drinkDiv = document.querySelector(`.${i.name}`) as HTMLDivElement;
    drinkDiv.classList.add("selected")
}
//#endregion - pohar valtozok

//#region - rendelesfelvetel
export async function incomingOrder() { //berakja a queueba a guesteket es a usereket
    let userAdded = false;

    users.forEach((u: User) => { //userek guestte convertalasa berakasa a queueba
        if (!(queue.some(a => a.id === u.id)) && u.order.length > 0 && u.isServed === false && !servedUsers.map(u => u.id).includes(u.id)) {
            queue.push(convertUserToGuest(u));
            userAdded = true;
        }
    });

    if (!userAdded && queue.length < 10) { //guestek berakasa a queueba
        let randomGuest = allGuests[randomNum(allGuests.length)];
        let randomDrinks: Drink[] = [];

        while (randomDrinks.length < 1) { //rendeles generalasa
            for (let i = 0; i < randomNum(4); i++) {
                let r = allDrinks[randomNum(allDrinks.length)];
                randomDrinks.push(r);
                    
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

function updateOrdersUI() { //a queue alapjan megjeleniti a rendeleseket a felso savban
    let orders = document.getElementById("orders");
    orders!.innerHTML = "";
    queue.forEach(customer => {
        orders!.innerHTML += `
            <div class="order">
                <img class="customerImg" src="${customer.img}"/>
                <p class="customerName goldenGlow">${customer.name}</p>
            </div>`;
    });
}

function randomIncomingOrder() { //random delayyel meghivja az incomingordert, hogy random delayyel jojjenek a rendelesek
    const randomDelay = randomNum(10000);
    setTimeout(() => {
        incomingOrder();
        randomIncomingOrder();
    }, randomDelay);
}

export function receiveOrder() { //kiirja az aktualis rendelest es frissiti a pohar tartalmat
    let sum = document.getElementById("sum"); //ide irja ki
    let customerData = document.querySelector(".customerData");

    if (queue.length == 0) {
        sum!.innerHTML = "Nincs rendelés!";
    } else {

        if (glass == undefined) { //Ez nullazza a poharat?
            loadGlass()
        }

        let orderListHTML = `
            <h1 class="text-center whiteGlow" style="margin-top:10px">Rendelés összesítő</h1>
            <h3 id="currentOrder" class="text-center mb-4 whiteGlow login">${queue[0].name}</h3>
            <ul class="h4" id="orderList">
        `;

        //drinkek kiirása
        for (let i = 0; i < queue[0].order.length; i++) {
            const drink = queue[0].order[i];
            let state: string;
            drink.index = i

            if (drink.ingredientsInCup.length == 0) {
                state = "ÜRES"
            } else if (drink.ingredientsInCup == glass.ingredientsInCup && drink.name == glass.name) {
                state = "JELENLEGI"
            }
            else {
                state = "KÉSZ"
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

                
                const ingredientInCup = drink.ingredientsInCup.find((i )=> {
                   return i.name == ingredient.name //&& drink.index === glass.index
                });
                
                const ingredientAmout = ingredientInCup == undefined ? 0 : ingredientInCup.amount * 10 ;

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
        let priceInput = document.getElementById("priceInput") as HTMLInputElement;

        if (!priceInput || priceInput.value == "") { //ha nincs beleirva nullazza
            orderListHTML += `
                </ul>
                <input type="number" id="priceInput" class="form-control" placeholder="Fizetendő összeg" style="margin: 40px 0px 0px 70px; height: 50px; width: 300px;"> 
            `;
        } else { //ha van beleirva benenmarad
            orderListHTML += `
                </ul>
                <input type="number" id="priceInput" value="${priceInput.value}" class="form-control" placeholder="Fizetendő összeg" style="margin: 40px 0px 0px 70px; height: 50px; width: 300px;"> 
            `;
        }
        orderListHTML += `
            <button id="accept" class="btn login greenGlow" style=" margin: 30px 0px 0px 80px; width: 100px; height: 50px">igen</button>
            <button id="decline" class="btn login redGlow" style=" margin: 30px 0px 0px 80px; width: 100px; height: 50px">nem</button>
        `;

        sum!.innerHTML = orderListHTML;

        if (customerData) { //ha meg van nyitva az adatlap nem ir ki mast
            sum!.innerHTML = "";
            sum!.appendChild(customerData);
        }
        else { //ha nincs megnyitva latszodnak a gombok
            const declineBtn = document.getElementById("decline"); //elutasit
            declineBtn!.onclick = () => {
                declineOrder();
            };

            const acceptBtn = document.getElementById("accept"); //elfogad
            acceptBtn!.onclick = () => {

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

            document.getElementById("currentOrder")!.onmouseover = () => {
                document.getElementById("currentOrder")!.style.cursor = "pointer";
            };

            document.getElementById("currentOrder")!.onclick = () => { //ra lehet kattintani a guest nevere
                getCustomerData();
            };

            for (let i = 0; i < queue[0].order.length; i++) { //drinkek kozotti valtas
                const drink = queue[0].order[i];
                let drinkClick = document.getElementById(drink.name + i) as HTMLDivElement
                drinkClick?.addEventListener("click", () => {
                    if (queue[0].order[i].ingredientsInCup.length == 0) {
                        loadGlass(i);
                        emptyGlass(glass);
                    }
                });

                drinkClick!.onmouseover = () => {
                    drinkClick!.style.cursor = "pointer";
                };

            }
        }

    }

}
//#endregion - rendelesfelvetel

//#region - lehetosegek a rendeleskor

async function acceptOrder(u: User | Guest) { //rendeles elfogadasa
    let priceInput = document.getElementById("priceInput") as HTMLInputElement; //a fizetendo osszeg inputja
    let s;
    if(priceInput.value == "") { //ha ures nem enged tovabb
        alert("Kérem adja meg a fizetendő összeget!");
        return;
    }
    else{
        s = Number(priceInput.value);
    }

    if (isUser(u)) { //ha user akkor frissiti a statuszt servedre
        u.isServed = true;
        u.order = [];
        servedUsers.push(u);
        localStorage.setItem("served", JSON.stringify(servedUsers));
    }

    calculatePrice(u, s);
    declineOrder(); //az aktualis vasarlo eltavolitasa a sorbol es a kovetkezo kiszolgalasa
}

//#endregion - lehetosegek a rendeleskor

//program kezdetehez meg kell hivni
displayIngredients();
randomIncomingOrder();
receiveOrder();

function loadGlass(index = 0) {
    glass = queue[0].order[index]; 
    const savedState = drinkFillLevels[`${glass.name}_${index}`]; 
    if (savedState) {
        glass.ingredientsInCup = savedState.map(ingredient => ({ ...ingredient }));
    } else {
        glass.ingredientsInCup = []; 
    }
}

export function emptyGlass(g: Drink) {
    ctx.clearRect(0, 0, width, height);
    drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx);

    g.ingredientsInCup = [];
    liquidHeight = 0;
    currentDrink = 0;

    console.log(ingredients);
    
    ingredients.forEach(i => {
        i.amount = 0
        
    });    

    ctx.fillStyle = drinkType.color;
    ctx.drawImage(cup, 0, 0, width, height);
}

export { queue }