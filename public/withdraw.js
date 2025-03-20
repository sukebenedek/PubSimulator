import { isNumber } from './functions.js';
import { showUser, setMoney } from './user.js';
if (localStorage.getItem("user") == null || localStorage.getItem("user") == undefined || localStorage.getItem("user") == "") {
    window.location.replace("./login.html");
}
let user = JSON.parse(localStorage.getItem("user"));
showUser(document.body, user);
document.getElementById("withdrawButton").addEventListener("click", withdraw);
document.getElementById("cancel").addEventListener("click", () => {
    window.location.replace("./index.html");
});
function withdraw() {
    if (checkInputs()) {
        setMoney(Number(document.getElementById("amountInput").value));
        window.location.replace("./index.html");
    }
}
function checkInputs() {
    let good = true;
    let cardNumber = document.getElementById("carNumberInput").value;
    let amount = document.getElementById("amountInput").value;
    if (!isNumber(cardNumber)) {
        document.getElementById("carNumberInput").classList.add("bg-danger");
        good = false;
    }
    else {
        document.getElementById("carNumberInput").classList.remove("bg-danger");
    }
    if (!isNumber(amount)) {
        document.getElementById("amountInput").classList.add("bg-danger");
        good = false;
    }
    else {
        document.getElementById("amountInput").classList.remove("bg-danger");
    }
    return good;
}
