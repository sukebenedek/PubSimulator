import { selectIngredient, ingredients } from './orders.js';
let div = document.getElementById("drinks");
export function displayIngredients() {
    ingredients.forEach(i => {
        div.innerHTML += `<div class="ingredientCard card m-1 ${i.name} asd" id=""  style="width: 140px;">
        <img src="${i.img}" class="card-img-top my-2 ingredient" alt="...">
        <div class="card-body m-0">
        <p class="m-0">${i.name}</p>
        </div>
        </div>`;
        if (i.name == "Sör") { //sor alapertelmezett kivalasztasa
            let a = document.querySelector(`.${i.name}`);
            a.classList.add("selected");
        }
    });
    ingredients.forEach(i => {
        let a = document.querySelector(`.${i.name}`);
        a === null || a === void 0 ? void 0 : a.addEventListener("click", () => { selectIngredient(i); });
    });
}
