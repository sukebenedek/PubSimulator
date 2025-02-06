var _a, _b;
import { fetchData } from './functions.js';
let loaded = false;
let amounts = {};
function closePopup() {
    document.getElementById("popup").classList.add("d-none");
    document.getElementById("container").classList.remove("d-none");
}
function closePopup2() {
    document.getElementById("popup2").classList.add("d-none");
}
(_a = document.getElementById("okButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closePopup);
async function order() {
    var _a;
    document.getElementById("popup2").classList.remove("d-none");
    (_a = document.getElementById("cancel")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closePopup2);
    if (!loaded) {
        const drinks = await fetchData("http://localhost:3000/drinks");
        drinks.forEach(d => {
            var _a, _b;
            let li = document.createElement('li');
            li.style.listStyleType = 'none';
            li.innerHTML = `
                <div id="${d.name}" class="drinkItem">
                            <div class="shadow">
                                <img class="drinkImg" src="${d.img}" alt="${d.name}">
                            </div>
                            <span class="drinkText">${d.name} - ${d.price}Ft</span> <span id="${d.name}span" class="drinkText text-success"></span>
                </div>
            `;
            (_a = document.getElementById(d.category)) === null || _a === void 0 ? void 0 : _a.appendChild(li);
            (_b = document.getElementById(d.name)) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { orderDrink(d); });
        });
        loaded = true;
    }
    ;
}
function orderDrink(d) {
    var _a;
    if (d.name in amounts)
        amounts[d.name] += 1;
    else
        amounts[d.name] = 1;
    document.getElementById(d.name + "span").innerHTML = `X${amounts[d.name]} <svg id="${d.name}trash" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill text-danger" viewBox="0 0 16 16">
        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
    </svg>`;
    (_a = document.getElementById(d.name + "trash")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => { amounts[d.name] = 0; });
}
(_b = document.getElementById("counter")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", order);
