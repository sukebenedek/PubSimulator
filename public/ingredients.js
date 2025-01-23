import { drawImage, drawRect, fetchData, randomN } from "./functions.js";
let ingredients = await fetchData("http://localhost:3000/ingredients");
let c = document.getElementById("canvas");
const ctx = c.getContext("2d");
c.height = 775;
c.width = 950;
let height = c.height;
let width = c.width;
drawImage("https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png", 0, 0, width, height, ctx);
let drinkType = ingredients[0];
let glass = { name: "pohár",
    price: 0,
    ingredientsRequired: [],
    ingredientsInCup: [],
    img: ""
};
let currentDrink = 0;
let interval;
const glassConstant = 0.1;
const glassBottom = 50;
const glassStart = 230;
const cup = new Image();
cup.src = "https://raw.githubusercontent.com/sukebenedek/PubSimulator/refs/heads/main/img/ingredients/cup3.png";
let heights = [];
let liquidHeight = 0;
c === null || c === void 0 ? void 0 : c.addEventListener("mousedown", (e) => {
    if (!(liquidHeight >= height - glassBottom)) {
        ctx.fillStyle = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        currentDrink = 0;
        let r = randomN(50, 100);
        interval = setInterval(function () {
            currentDrink++;
            r = randomN(50, 100);
            // console.log(currentDrink);
            liquidHeight = currentDrink * 14 + heights.reduce((total, num) => total + num, 0);
            glass.ingredientsInCup.forEach((ingredient) => {
                liquidHeight += ingredient.amount;
                liquidHeight -= heights.length * 1.2;
            });
            console.log(liquidHeight);
            console.log(heights);
            drawRect(glassStart - liquidHeight * glassConstant, height - glassBottom - liquidHeight, width - glassStart - glassStart + liquidHeight * glassConstant * 2, 20, ctx);
            ctx.drawImage(cup, 0, 0, width, height);
            // drawRect(10, 100, 100, 100, ctx)
        }, r);
    }
    else {
        console.log("tele van");
    }
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
    heights.push(liquidHeight - heights.reduce((total, num) => total + num, 0));
});
let div = document.getElementById("drinks");
ingredients.forEach(i => {
    // console.log(i);
    i.amount = 0;
    div.innerHTML += `<div class="card m-1 ${i.name} asd" id=""  style="width: 140px;">
    <img src="${i.img}" class="card-img-top my-2" style="border-radius: 5px" alt="...">
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
export { glass };
