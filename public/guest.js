"use strict";
var _a, _b;
function closePopup() {
    document.getElementById("popup").classList.add("d-none");
    document.getElementById("container").classList.remove("d-none");
}
(_a = document.getElementById("okButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closePopup);
function order() {
    console.log("alkohol");
}
(_b = document.getElementById("counter")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", order);
