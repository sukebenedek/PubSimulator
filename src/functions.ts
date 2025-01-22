import { NodeBuilderFlags } from "typescript";

async function load<T>(url: string): Promise<T> {
    const response = await fetch(url);
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
      })
    if (!response.ok) {
        return false;
    }
    return true;
}

