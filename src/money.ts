import { User, Ingredient, Drink, Guest, } from './interfaces.js';

export function calculatePrice(u: User | Guest) { //kapott osszeg szamolasa a kitolott ital alapjan TODO!!
    let price = 0;
    u.order.forEach(drink => {
        price += drink.price;
    });

    console.log(`Osszes ital ara: ${price} Ft`);
    price = 0;
    
    for (let i = 0; i < u.order.length; i++) { //vegigmegy az orderen
        const drink = u.order[i];
        for (let j = 0; j < drink.ingredientsRequired.length; j++) { //vegigmegy a drink osszetevoin
            const ingredient = drink.ingredientsRequired[j];
            const ingredientInCup = drink.ingredientsInCup.find(i => i.name == ingredient.name); //ezek csak azok amik benne vannak ES kellenek is bele
            
            console.log(`Kell: ${ingredient.name} ${ingredient.amount}ml`); // Kilogolja aminek benne kene lennie
            console.log(`Van: ${ingredientInCup ? ingredientInCup.name : 'None'} ${ingredientInCup ? ingredientInCup.amount * 10 : '0'}ml`); // Kilogolja ami benne van
            
            if (ingredientInCup) { //ha van benne olyan osszetevo ami kell bele kiszamolja a kapott penzt maskulonben nem is ad
                const ingredientAmount = ingredientInCup.amount * 10;
                let accuracy = 0;
                // Osszetevo mennyiseg ellenorzes
                if (ingredientAmount === ingredient.amount) {
                    accuracy = 1; 
                } else if (ingredientAmount > ingredient.amount) {
                    accuracy = 0.8; 
                } else {
                    accuracy = 0.5;
                }

                // Jo osszetevo?
                if (ingredientInCup.name !== ingredient.name) {
                    accuracy *= 0.5;
                }
                // Kalkulacio
                price += drink.price * accuracy;
                console.log(`${drink.name} ara: ${drink.price} Ft`);
                console.log(`${drink.name} utan kapott penz: ${drink.price * accuracy} Ft`);
                console.log(`Eddig: ${price} Ft`);
                

                console.log(`${ingredient.name}: ${ingredientAmount}ml / ${ingredient.amount}ml, Pontossag: ${accuracy * 100}%`);
            }
        }
    }
    console.log(`Kapott penz: ${price} Ft`);
}