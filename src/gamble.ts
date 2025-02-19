document.getElementById("gamble")?.addEventListener("click", showGamblePopup)
document.getElementById("closeGamble")?.addEventListener("click", closeGamblePopup)

function showGamblePopup() {
    document.getElementById("gamblePopup")!.classList.remove("d-none");
    createDeck();
}
function closeGamblePopup() {
    document.getElementById("gamblePopup")!.classList.add("d-none");
}

function createDeck() {
    let dck = document.getElementById("table")!;
    for (let i = 1; i <= 52; i++) {
        let card = document.createElement("img");
        card.src = "./img/cards/back.png";
        card.id = `card${i}`;
        card.className = "position-absolute w-10 cards";
        if (i == 52) card.classList.add("topcard");
        card.style.top = `${(window.innerHeight/2 - 227)  - i}px`;
        card.style.right = `${100 - i}px`;
        dck.appendChild(card);
    }

    document.getElementById("deck")?.addEventListener("click", animation);
}

function animation() {
    let id: any = null;
    const card = document.getElementById("card1")!;  
    const X = parseFloat(getComputedStyle(card).top);
    const Y = parseFloat(getComputedStyle(card).right);
    let x = X;
    let y = Y;
    clearInterval(id);
    id = setInterval(frame, 1);
    function frame() {
      if (x >= 400) {
        clearInterval(id);
      } else {
        x += 5; 
        y += 20;
        card.style.top = x + "px"; 
        card.style.right = y + "px"; 
      }
    }
    card.style.top = String(X);
    card.style.right = String(Y);
  }