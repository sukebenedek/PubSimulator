"use strict";
var _a;
function closePopup() {
    document.getElementById("popup").classList.add("d-none");
    document.getElementById("container").classList.remove("d-none");
}
(_a = document.getElementById("okButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closePopup);
