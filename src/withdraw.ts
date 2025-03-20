import { User } from './interfaces.js';
import { postData, patchData, isNumber } from './functions.js';
import { showUser, getUser, setMoney } from './user.js';

if (localStorage.getItem("user") == null || localStorage.getItem("user") == undefined || localStorage.getItem("user") == "" ) {
    window.location.replace("./login.html");
}

let user: User = JSON.parse(localStorage.getItem("user")!);
showUser(document.body, user);

document.getElementById("withdrawButton")!.addEventListener("click", withdraw);
document.getElementById("cancel")!.addEventListener("click", () => {
    window.location.replace("./index.html");
});

function withdraw() {
    if (checkInputs()) {
        setMoney(Number((<HTMLInputElement>document.getElementById("amountInput")!).value));
        window.location.replace("./index.html");
    }
}

function checkInputs() {
    let good = true;
    let cardNumber = (<HTMLInputElement>document.getElementById("carNumberInput")!).value;
    let amount = (<HTMLInputElement>document.getElementById("amountInput")!).value;

    if (!isNumber(cardNumber)) {
        document.getElementById("carNumberInput")!.classList.add("bg-danger");
        good = false;
    }
    else {
        document.getElementById("carNumberInput")!.classList.remove("bg-danger");
    }

    if (!isNumber(amount)) {
        document.getElementById("amountInput")!.classList.add("bg-danger");
        good = false;
    }
    else {
        document.getElementById("amountInput")!.classList.remove("bg-danger");
    }

    return good;
}