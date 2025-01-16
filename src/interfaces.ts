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
    amount: number,
}

interface Drink {
    name: string,
    price: number,
    ingredientsRequired: Ingredient[],
    ingredientsInCup: Ingredient[],
    amounts: number[]
}

interface Guest {
    name: string,
    money: number,
    drunkness: number,
    age: number,
    stinkness: number,
    img: string,
    order: Drink[]
}

export { User, Ingredient, Drink, Guest,};