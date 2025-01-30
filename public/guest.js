var _a, _b;
import { fetchData } from './functions.js';
let loaded = false;
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
            var _a;
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
            (_a = document.getElementById(d.category)) === null || _a === void 0 ? void 0 : _a.appendChild(li);
        });
        loaded = true;
    }
    ;
}
(_b = document.getElementById("counter")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", order);
