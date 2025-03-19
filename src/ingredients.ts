import { Ingredient } from './interfaces.js';
import { selectIngredient , ingredients} from './orders.js';

let div = document.getElementById("drinks") as HTMLDivElement

export function displayIngredients(){ //osszetevok megjelenitese es sor kivalasztasa alapertelmezetten
    ingredients.forEach(i => { //kiiras
        div.innerHTML += `<div class="ingredientCard card m-1 ${i.name} asd" id=""  style="width: 140px;">
        <img src="${i.img}" class="card-img-top my-2 ingredient" alt="...">
        <div class="card-body m-0">
        <p class="m-0">${i.name}</p>
        </div>
        </div>`
    
        if(i.name == "Sör"){ //sor alapertelmezett kivalasztasa
        let a = document.querySelector(`.${i.name}`) as HTMLDivElement
            a.classList.add("selected");
        }
    });
    ingredients.forEach(i => { //click listener ra lehet kattintani
        let a = document.querySelector(`.${i.name}`) as HTMLDivElement
        a?.addEventListener("click", () => { selectIngredient(i) })
    })
}