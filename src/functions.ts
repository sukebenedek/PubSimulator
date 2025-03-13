import { NodeBuilderFlags, nodeModuleNameResolver } from "typescript";
import { receiveOrder } from "./orders";

async function load<T>(url: string): Promise<T> {
    const response = await fetch(url, {
        method: 'GET',
        cache: 'no-store'
    });
    if (!response.ok) {
        throw new Error("Error");
    }
    const data = await response.json();
    return data as T;
}

export async function fetchData<T>(url: string): Promise<T> {
    const data: T[] = await load<T[]>(url);
    return data as T;
}

export function randomNum(max: number){
    return Math.floor(Math.random() * max);
}

export function randomN(min: number, max: number){
    return randomNum(max - min) + min;
}

export async function postData(url: string, data: {}): Promise<boolean> {
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

export async function patchData(url: string, data: {}): Promise<boolean> {
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

export function drawRect(posX: number, posY: number, width: number, height: number, ctx: CanvasRenderingContext2D){
    ctx.beginPath(); // Start a new path
    // ctx.fillStyle = "green";

    ctx.rect(posX, posY, width, height); // Add a rectangle to the current path
    ctx.fill(); // Render the path
}

export function drawImage(imgS: string, posX: number, posY: number, width: number, height: number, ctx: CanvasRenderingContext2D ){
    const img = new Image();
    img.src = imgS

    img.onload = () => {
        ctx.drawImage(img, posX, posY, width, height);
    };
    // console.log(width + ", " + height);

}

export function sleep(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

export function isNumber(str: string) {
    return !isNaN(Number(str)) && str.trim() !== '';
}
