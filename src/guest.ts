function closePopup() {
    document.getElementById("popup")!.classList.add("d-none");
    document.getElementById("container")!.classList.remove("d-none");
}
function closePopup2() {
    document.getElementById("popup2")!.classList.add("d-none");
}

document.getElementById("okButton")?.addEventListener("click", closePopup);


function order() {
    document.getElementById("popup2")!.classList.remove("d-none");   
    document.getElementById("order")?.addEventListener("click", closePopup2); 
}

document.getElementById("counter")?.addEventListener("click", order);