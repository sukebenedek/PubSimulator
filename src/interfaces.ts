interface User {
    username: string,
    password: string,
    money: number,
    drunkness: number,
    img: string,
    role: boolean
}

interface Ingredient { //sör a csapbol
    name: string,
    price: number,
    alcohol: number,
    img : string,
    amount : number
    color : any
}

interface Drink { //rendel vodka redbul vagy tölt egy vodka redbul
    name: string,
    price: number,
    img: string,
    ingredientsRequired: Ingredient[],
    ingredientsInCup: Ingredient[],
    category: string
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

export { User, Ingredient, Drink, Guest};