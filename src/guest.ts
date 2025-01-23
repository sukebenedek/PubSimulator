function closePopup() {
    document.getElementById("popup")!.classList.add("d-none");
    document.getElementById("container")!.classList.remove("d-none");
}

document.getElementById("okButton")?.addEventListener("click", closePopup);