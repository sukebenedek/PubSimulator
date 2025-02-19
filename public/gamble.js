"use strict";
var _a, _b;
(_a = document.getElementById("gamble")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", showGamblePopup);
(_b = document.getElementById("closeGamble")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", closeGamblePopup);
function showGamblePopup() {
    document.getElementById("gamblePopup").classList.remove("d-none");
}
function closeGamblePopup() {
    document.getElementById("gamblePopup").classList.add("d-none");
}
