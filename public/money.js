export function calculatePrice(u, s) {
    let price = 0;
    for (let i = 0; i < u.order.length; i++) { // végigmegy az orderen
        const drink = u.order[i];
        let totalAccuracy = 1; // Default accuracy to 100%
        for (let j = 0; j < drink.ingredientsRequired.length; j++) { // végigmegy a drink összetevőin
            const ingredient = drink.ingredientsRequired[j];
            const ingredientInCup = drink.ingredientsInCup.find(i => i.name == ingredient.name); // ezek csak azok amik benne vannak ÉS kellenek is bele
            console.log(`Kell: ${ingredient.name} ${ingredient.amount}ml`); // Kilogolja aminek benne kéne lennie
            console.log(`Van: ${ingredientInCup ? ingredientInCup.name : 'None'} ${ingredientInCup ? ingredientInCup.amount * 10 : '0'}ml`); // Kilogolja ami benne van
            if (ingredientInCup) { // ha van benne olyan összetevő ami kell bele, kiszámolja a kapott pénzt, máskülönben nem is ad
                const ingredientAmount = ingredientInCup.amount * 10;
                let accuracy = 0;
                // Összetevő mennyiség ellenőrzés
                if (ingredientAmount === ingredient.amount) {
                    accuracy = 1;
                }
                else if (ingredientAmount > ingredient.amount) {
                    accuracy = 0.8;
                }
                else {
                    accuracy = 0.5;
                }
                // Jó összetevő?
                if (ingredientInCup.name !== ingredient.name) {
                    accuracy *= 0.5;
                }
                totalAccuracy *= accuracy; // Ingredienteknetni pontossag
            }
            else {
                totalAccuracy = 0; // Ha egy összetevő hiányzik, akkor az ital értéke 0
            }
        }
        price += drink.price * totalAccuracy; // Alkalmazza az accuracy-t egyszer per ital
        console.log(`${drink.name} ára: ${drink.price} Ft`);
        console.log(`${drink.name} után kapott pénz: ${drink.price * totalAccuracy} Ft`);
    }
    if (s < price) {
        console.log("Kevesebb lett beleirva");
        price = s;
    }
    else if (s > price) {
        console.log("Több lett beleirva");
        price *= 0.5;
    }
    else {
        console.log("Pontosan beleírták");
    }
    console.log(`Kapott pénz: ${price} Ft`);
}
