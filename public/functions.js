async function load(url) {
    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error("Error");
    }
    const data = await response.json();
    return data;
}
export async function fetchData(url) {
    const data = await load(url);
    return data;
}
export function randomNum(max) {
    return Math.floor(Math.random() * max);
}
export function randomN(min, max) {
    return randomNum(max - min) + min;
}
export async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        return false;
    }
    return true;
}
export async function patchData(url, data) {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        return false;
    }
    return true;
}
export function drawRect(posX, posY, width, height, ctx) {
    ctx.beginPath(); // Start a new path
    // ctx.fillStyle = "green";
    ctx.rect(posX, posY, width, height); // Add a rectangle to the current path
    ctx.fill(); // Render the path
}
export function drawImage(imgS, posX, posY, width, height, ctx) {
    const img = new Image();
    img.src = imgS;
    img.onload = () => {
        ctx.drawImage(img, posX, posY, width, height);
    };
    // console.log(width + ", " + height);
}
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export function isNumber(str) {
    return !isNaN(Number(str)) && str.trim() !== '';
}
export function isUser(u) {
    return typeof u == "object" && "isServed" in u;
}
export function convertUserToGuest(u) {
    return {
        "name": u.username,
        "money": u.money,
        "drunkness": u.drunkness,
        "age": randomN(18, 99),
        "stinkness": randomN(0, 100),
        "img": u.img,
        "order": u.order,
        "id": u.id,
    };
}
