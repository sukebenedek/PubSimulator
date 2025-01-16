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
    alcohol: number
}

interface Drink {
    name: string,
    price: number,
    ingredients: Ingredient[],
    amounts: number[]
}

interface Quest {
    name: string,
    money: number,
    drunkness: number,
    age: number,
    stinkness: number,
    img: string
}

interface Order {
    customer: Quest,
    drinks: Drink[]
}

export { User, Ingredient, Drink, Quest, Order }