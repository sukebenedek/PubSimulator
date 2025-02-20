document.getElementById("gamble")?.addEventListener("click", showGamblePopup);
document.getElementById("closeGamble")?.addEventListener("click", closeGamblePopup);
document.getElementById("startGamble")?.addEventListener("click", start);

function showGamblePopup() {
    document.getElementById("gamblePopup")!.classList.remove("d-none");
    document.getElementById("gamble")!.classList.add("d-none");
    createDeck();
}
function closeGamblePopup() {
    document.getElementById("gamblePopup")!.classList.add("d-none");
    document.getElementById("gamble")!.classList.remove("d-none");
}

const player = document.getElementById("player")!;
const dealer = document.getElementById("dealer")!;

const cardImages = [
  "2_of_clubs.png", "2_of_diamonds.png", "_of_hearts.png", "2_of_spades.png",
  "3_of_clubs.png", "3_of_diamonds.png", "3_of_hearts.png", "3_of_spades.png",
  "4_of_clubs.png", "4_of_diamonds.png", "4_of_hearts.png", "4_of_spades.png",
  "5_of_clubs.png", "5_of_diamonds.png", "5_of_hearts.png", "5_of_spades.png",
  "6_of_clubs.png", "6_of_diamonds.png", "6_of_hearts.png", "6_of_spades.png",
  "7_of_clubs.png", "7_of_diamonds.png", "7_of_hearts.png", "7_of_spades.png",
  "8_of_clubs.png", "8_of_diamonds.png", "8_of_hearts.png", "8_of_spades.png",
  "9_of_clubs.png", "9_of_diamonds.png", "9_of_hearts.png", "9_of_spades.png",
  "10_of_clubs.png", "10_of_diamonds.png", "10_of_hearts.png", "10_of_spades.png",
  "ace_of_clubs.png", "ace_of_diamonds.png", "ace_of_hearts.png", "ace_of_spades.png",
  "jack_of_clubs.png", "jack_of_diamonds.png", "jack_of_hearts.png", "jack_of_spades.png",
  "king_of_clubs.png", "king_of_diamonds.png", "king_of_hearts.png", "king_of_spades.png",
  "queen_of_clubs.png", "queen_of_diamonds.png", "queen_of_hearts.png", "queen_of_spades.png"
];

let cards = cardImages;

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

    document.getElementById("deck")?.addEventListener("click", () => {draw(1)});
}

async function draw(dir: number): Promise<boolean> {
  return new Promise((resolve) => {
      document.getElementById("deck")!.classList.add("d-none");
      const card = document.getElementById("card52")!;  
      const X = parseFloat(getComputedStyle(card).top);
      const Y = parseFloat(getComputedStyle(card).right);
      let x = X;
      let y = Y;

      const id = setInterval(frame, 1);

      function frame() {
          if ((dir == 1 && x >= 400) || (dir == -1 && x <= 75)) {
              clearInterval(id);
              card.style.top = X + "px";
              card.style.right = Y + "px";
              document.getElementById("deck")!.classList.remove("d-none");
              resolve(true);
          } else {
              x += 5 * dir; 
              y += 15;
              card.style.top = x + "px"; 
              card.style.right = y + "px"; 
          }
      }
  });
}

async function start() {
  await draw(1);
  giveCard(1);
  await draw(-1);
  giveCard(-1);
  await draw(1);
  giveCard(1);
  await draw(-1);
  giveCard(-1);
}

function giveCard(dir: number) {
  let card = cards[Math.floor(Math.random()*cards.length)];

  let cardImg = document.createElement("img");
  cardImg.src = './img/cards/' + card;
  cardImg.className = "w-10";

  if (dir == 1) player.appendChild(cardImg);
  else dealer.appendChild(cardImg);
}