import { isNumber } from "./functions.js";
import { getMoney, setMoney } from "./user.js";

document.getElementById("gamble")?.addEventListener("click", showGamblePopup);
document.getElementById("closeGamble")?.addEventListener("click", closeGamblePopup);

const button = document.getElementById("startGamble")!;
button.addEventListener("click", start);

function showGamblePopup() {
    document.getElementById("gamblePopup")!.classList.remove("d-none");
    document.getElementById("gamble")!.classList.add("d-none");
    createDeck();
}
function closeGamblePopup() {
    document.getElementById("gamblePopup")!.classList.add("d-none");
    document.getElementById("gamble")!.classList.remove("d-none");
}

const Player = document.getElementById("player")!;
let playerCards: String[] = [];
let playerValue: number[] = [];

const Dealer = document.getElementById("dealer")!;
let dealerCards: String[] = [];
let dealerValue: number[] = [];

const cardImages = [
  "2_of_clubs.png", "2_of_diamonds.png", "2_of_hearts.png", "2_of_spades.png",
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

let goodTet = true; 

let cards = cardImages;

let currentCard = 52;

//#region KEZDÉS

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

    document.getElementById("deck")?.addEventListener("click", playerDraw);
}

async function draw(dir: number): Promise<boolean> {
  const speed = 10;
  return new Promise((resolve) => {
      document.getElementById("deck")!.classList.add("d-none");
      const card = document.getElementById(`card${currentCard}`)!;  
      currentCard--;
      const X = parseFloat(getComputedStyle(card).top);
      const Y = parseFloat(getComputedStyle(card).right);
      let x = X;
      let y = Y;

      const id = setInterval(frame, 1);

      function frame() {
          if ((dir == 1 && x >= 400) || (dir == -1 && x <= 75)) {
              clearInterval(id);
              // card.style.top = X + "px";
              // card.style.right = Y + "px";
              card.remove();
              document.getElementById("deck")!.classList.remove("d-none");
              resolve(true);
          } else {
              x += 1 * speed * dir; 
              y += 3 * speed;
              card.style.top = x + "px"; 
              card.style.right = y + "px"; 
          }
      }
  });
}

async function start() {
  if (issetTet() && goodTet) {
    setTet();

    currentCard = 52;
    document.getElementById("deck")!.classList.remove("d-none");
    button.removeEventListener("click", start);
    button.classList.remove("btn-success");
    button.classList.add("btn-secondary");

    await draw(1);
    giveCard(1);
    await draw(-1);
    giveCard(-1);
    await draw(1);
    giveCard(1);
    await draw(-1);
    giveCard(-2);
    document.getElementById("dealer")!.title = value(dealerCards[0], sum(dealerValue)) + " + ?";

    button.innerHTML = "Elég"
    button.classList.remove("btn-secondary");
    button.classList.add("btn-success");
    button.addEventListener("click", dealersTurn)
  }
}
//#endregion

//#region JÁTÉK

function giveCard(dir: number) {
  let card = cards[Math.floor(Math.random()*cards.length)];
  while (playerCards.includes(card) || dealerCards.includes(card)) {
    card = cards[Math.floor(Math.random()*cards.length)];
  }

  let cardImg = document.createElement("img");
  cardImg.src = dir == -1 || dir == 1 ? './img/cards/' + card : './img/cards/back.png';
  cardImg.className = "w-20 mx-1";

  if (dir == 1) {
    Player.appendChild(cardImg);
    playerCards.push(card);
    playerValue.push(value(card, sum(playerValue)));
    bust(1);
    document.getElementById("player")!.title = String(sum(playerValue));
  }
  else {
    Dealer.appendChild(cardImg);
    dealerCards.push(card);
    dealerValue.push(value(card, sum(dealerValue)));
    bust(2);
    document.getElementById("dealer")!.title = String(sum(dealerValue));
  }
}

function value(card:String, sum:number): number {
  let value = card.split("_")[0];
  if (isNumber(value)) {
    return Number(value);
  }
  else if (value == "jack" || value == "queen" || value == "king") {
    return 10;
  }
  else {
    if (sum + 11 > 21) return 1;
    return 11;
  }
}

function sum(numbers: number[]) {
  return numbers.reduce((s, a) => s + a, 0);
}


async function playerDraw() {
  await draw(1);
  giveCard(1);
}
async function dealerDraw() {
  await draw(-1);
  giveCard(-1);
}

async function dealersTurn() {
  document.getElementById("deck")!.classList.add("d-none");
  document.getElementById("dealer")!.innerHTML = "";
  dealerCards.forEach(card => {
    let cardImg = document.createElement("img");
    cardImg.src = './img/cards/' + card;
    cardImg.className = "w-20 mx-1";
    Dealer.appendChild(cardImg);
    document.getElementById("dealer")!.title = String(sum(dealerValue));
  });

  while (sum(dealerValue) <= 16) {
    await dealerDraw();
    bust(-1);
  }
  if (sum(dealerValue) < 22) {
    result();
  }
}

function bust(dir:number) {
  if (dir == 1) {
    if (sum(playerValue) > 21) {
      if (playerValue.includes(11)) {
        let i = playerValue.indexOf(11);
        if (i !== -1) playerValue.splice(i, 1);
        bust(1);
      }
      else {
        dealersTurn()
      }
    }
  }
  else if (dir == -1) {
    if (sum(dealerValue) > 21) {
      if (dealerValue.includes(11)) {
        let i = dealerValue.indexOf(11);
        if (i !== -1) dealerValue.splice(i, 1);
        bust(-1);
      }
      else {
        result();
      }
    }
  }
}
//#endregion

//#region VÉGE

function result() { //ez a fos valamiért tovább megy az ifeken és a win kétszer lesz meghívva
  if (sum(playerValue) > 21) {
    lose();
  }
  else if (sum(dealerValue) > 21) {
    win()
  }
  else if (sum(playerValue) == sum(dealerValue)) {
    tie()
  }
  else if (sum(playerValue) == 21) {
    blackjack()
  }
  else if (sum(playerValue) > sum(dealerValue)) {
    win();
  }
  else if (sum(playerValue) < sum(dealerValue)) {
    lose();
  }
}

function lose() {
  document.getElementById("lose")!.classList.remove("d-none");
}
function win() {
  document.getElementById("win")!.classList.remove("d-none");
  console.log(tet * 2);
  setMoney(tet * 2);
}
function tie() {
  document.getElementById("tie")!.classList.remove("d-none");
  setMoney(tet);
}
function blackjack() {
  document.getElementById("blackjack")!.classList.remove("d-none");
  setMoney(tet * 3 / 2);
}
Array.from(document.getElementsByClassName("resultOkBtn")).forEach(element => {
  element.addEventListener("click", end);
});

function end() {
  clearTet();

  Array.from(document.getElementsByClassName("result")).forEach(element => {
    if (!element.classList.contains("d-none")) {
      element.classList.add("d-none");
    }
  });

  for (let i = 1; i <= 52; i++) {
    document.getElementById(`card${i}`)?.remove;
  }

  createDeck();
  button.removeEventListener("click", dealersTurn);
  button.addEventListener("click", start);
  button.innerHTML = "Játék";

  document.getElementById("dealer")!.innerHTML = "";
  document.getElementById("player")!.innerHTML = "";
  playerCards = [];
  playerValue = [];
  dealerCards = [];
  dealerValue = [];

  document.getElementById("deck")!.classList.add("d-none");

}
//#endregion

//#region TÉT

const input = <HTMLInputElement>document.getElementById("tet")!;
let tet:number;
input.addEventListener("input", enoughMoney);

function issetTet() {
  if (!isNumber(input.value) || input.value == "") {
    input.classList.add("bg-danger");
    return false;
  }
  else {
    return true;
  }    
}

function enoughMoney() {
  if (!isNumber(input.value) || Number(input.value) > getMoney()) {
    input.classList.add("bg-danger");
    goodTet = false;
  }
  else {
    input.classList.remove("bg-danger");
    goodTet = true;
  }
}

function setTet() {
  input.disabled = true;
  tet = Number(input.value);
  setMoney(-tet);
}

function clearTet() {
  input.disabled = false;
  input.value = "";
  tet = 0;
}
//#endregion