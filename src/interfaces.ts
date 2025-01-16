interface User {
    username: string,
    password: string,
    money: number,
    drunkness: number,
    img: string,
    role: boolean
}

interface Ingredient {
    name: string,
    price: number,
    alcohol: number,
    img : string,
}

interface Drink {
    name: string,
    price: number,
    ingredients: Ingredient[],
    amounts: number[]
}

interface Guest {
    name: string,
    money: number,
    drunkness: number,
    age: number,
    stinkness: number,
    img: string
}

interface Order {
    customer: Guest,
    drinks: Drink[]
}

export async function load<T>(url: string): Promise<T> {
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


export { User, Ingredient, Drink, Guest, Order,};