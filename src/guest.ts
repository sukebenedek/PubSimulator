import { Drink } from './interfaces.js';
import { fetchData } from './functions.js';


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

    const drinks: Drink[] = await fetchData("http://localhost:3000/drinks");
    drinks.forEach(d => {
        //document.getElementById(d.category)
    });
}

document.getElementById("counter")?.addEventListener("click", order);