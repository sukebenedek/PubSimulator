document.getElementById("gamble")?.addEventListener("click", showGamblePopup)
document.getElementById("closeGamble")?.addEventListener("click", closeGamblePopup)

function showGamblePopup() {
    document.getElementById("gamblePopup")!.classList.remove("d-none");
}
function closeGamblePopup() {
    document.getElementById("gamblePopup")!.classList.add("d-none");
}