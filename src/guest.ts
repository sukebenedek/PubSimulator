import { Drink } from './interfaces.js';
import { fetchData } from './functions.js';

let loaded = false;

function closePopup() {
    document.getElementById("popup")!.classList.add("d-none");
    document.getElementById("container")!.classList.remove("d-none");
}
function closePopup2() {
    document.getElementById("popup2")!.classList.add("d-none");
}

document.getElementById("okButton")?.addEventListener("click", closePopup);


async function order() {
    document.getElementById("popup2")!.classList.remove("d-none");
    document.getElementById("cancel")?.addEventListener("click", closePopup2);

    if(!loaded) {
        const drinks: Drink[] = await fetchData("http://localhost:3000/drinks");    
        drinks.forEach(d => {
            let li = document.createElement('li');
            li.style.listStyleType = 'none';
            li.innerHTML = `
                <div class="drinkItem">
                            <div class="shadow">
                                <img class="drinkImg" src="${d.img}" alt="${d.name}">
                            </div>
                            <span class="drinkText">${d.name} - ${d.price}Ft</span>
                        </div>
            `;
            document.getElementById(d.category)?.appendChild(li);
        });
        loaded = true;
    };
}

document.getElementById("counter")?.addEventListener("click", order);