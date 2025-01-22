import { drawImage, fetchData, randomN } from "./functions.js";
let ingredients = await fetchData("http://localhost:3000/ingredients");
let c = document.getElementById("canvas");
const ctx = c.getContext("2d");
let height = c.height;
let width = c.width;
// drawRect(0, 0, width, height, ctx)
drawImage("beer.png", 0, 0, 100, 100, ctx);
let drinkType = ingredients[0];
let glass = { name: "pohár",
    price: 0,
    ingredientsRequired: [],
    ingredientsInCup: [],
};
let currentDrink = 0;
let interval;
c === null || c === void 0 ? void 0 : c.addEventListener("mousedown", (e) => {
    currentDrink = 0;
    let r = randomN(50, 100);
    interval = setInterval(function () {
        currentDrink++;
        r = randomN(50, 100);
        // console.log(currentDrink);
    }, r);
});
c === null || c === void 0 ? void 0 : c.addEventListener("mouseup", (e) => {
    clearInterval(interval);
    drinkType.amount += currentDrink;
    glass.ingredientsInCup.push(drinkType);
    glass.ingredientsInCup = glass.ingredientsInCup.filter((ingredient, index, self) => {
        // Check if the name of the current ingredient exists earlier in the array
        return index === self.findIndex((i) => i.name === ingredient.name);
    });
    drawGlass(glass);
    // console.log(glass);
});
let div = document.getElementById("drinks");
ingredients.forEach(i => {
    // console.log(i);
    i.amount = 0;
    div.innerHTML += `<div class="card m-1 ${i.name} asd" id=""  style="width: 140px;">
    <img src="https://th.bing.com/th/id/R.fe0357d46886af0a2bfaa5782fcdd37b?rik=eLZv3p%2b8xr5QfQ&riu=http%3a%2f%2f1.bp.blogspot.com%2f-mXbwx67pob0%2fTVxTAPiyXYI%2fAAAAAAAAAnI%2fUCgim_IxGOo%2fs1600%2fbeer.jpg&ehk=C0FRdD66XJzbG2R1io0l1de7QbtfPWIYiqBZQVokAqo%3d&risl=&pid=ImgRaw&r=0" class="card-img-top my-2" style="border-radius: 5px" alt="...">
    <div class="card-body m-0">
    <p class="m-0">${i.name}</p>
    </div>
    </div>`;
});
ingredients.forEach(i => {
    let a = document.querySelector(`.${i.name}`);
    a === null || a === void 0 ? void 0 : a.addEventListener("click", () => { selectIngredient(i); });
});
function selectIngredient(i) {
    drinkType = i;
}
function drawGlass(g) {
    // console.log(height);
}
