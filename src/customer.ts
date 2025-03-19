import { queue, receiveOrder, emptyGlass, glass } from './orders';

export function getCustomerData() { //eppen aktualis vendeg adatainak kiirasa
    let sum = document.getElementById('sum');
    sum!.innerHTML = ""; //kiuriti a sumot hogy ne legyen benne semmi
    const customer = queue[0];

    const customerDataDiv = document.createElement('div');
    customerDataDiv.classList.add('customerData');
    customerDataDiv.innerHTML = `
        <h2>Információk</h2>
        <img style = "border-radius:20px;" src="${customer.img}"/>
        <p>Név: ${customer.name}</p>
        <p>Életkor: ${customer.age} év</p>
        <p>Vagyon: ${customer.money}Ft</p>
        <p>Részegség: ${customer.drunkness}%</p>
        <p>Büdösség: ${customer.stinkness}%</p>
        <button class="closeBtn login">[Bezár]</button>
    `;

    sum!.appendChild(customerDataDiv); //belerakja az adatgokt a sumba

    const closeBtn = customerDataDiv.querySelector('.closeBtn');
    closeBtn!.addEventListener('click', () => {
        sum!.removeChild(customerDataDiv);
        receiveOrder(); //bezaras gomb megnyomasakor meghivja a receiveordert hogy kiirja az aktualis adatokat
    });
}

export function declineOrder() { //az aktualis vasarlo eltavolitasa a sorbol es a kovetkezo kiszolgalasa
    let priceInput = document.getElementById("priceInput")! as HTMLInputElement;
    priceInput.value = ""
    queue.shift();
    let orders = document.getElementById("orders");
    orders!.innerHTML = "";
    queue.forEach(customer => {
        orders!.innerHTML +=
        `<div class="order">
        <img class="customerImg" src="${customer.img}"/>
        <p class="customerName">${customer.name}</p>
        </div>`;
    });
    emptyGlass(glass);
    receiveOrder();
}

