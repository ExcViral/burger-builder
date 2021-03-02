import React from 'react';
import BurgerIngredient from './BurgerIngredient/BurgerIngredient.js';
import styles from './Burger.module.css';

const Burger = ({ ingredients }) => {
	// // USING ARRAYS
	// let ingredientsKeys = Object.keys(ingredients);
	// let burgerIngredients = [];
	// for (let index = 0; index < ingredientsKeys.length; index++) {
	// 	for (let qty = 1; qty < ingredients[ingredientsKeys[index]] + 1; qty++) {
	// 		burgerIngredients.push(
	// 			<BurgerIngredient
	// 				key={ingredientsKeys[index] + qty}
	// 				type={ingredientsKeys[index]}
	// 			/>
	// 		);
	// 		console.log(ingredientsKeys[index] + qty);
	// 	}
	// }
	// console.log(burgerIngredients);

	// // USING OBJECT.ENTRIES
	let burgerIngredients = [];
	Object.entries(ingredients).map(ingredient => {
		for (let i = 0; i < ingredient[1]; i++) {
			burgerIngredients.push(
				<BurgerIngredient key={ingredient[0] + i} type={ingredient[0]} />
			);
		}
	});
	// console.log(burgerIngredients);

	// Maxilillian way [will need to use the .reduce() method to flatten the final array]
	// let burgerIngredients = Object.keys(ingredients).map(ingredientKey => {
	// 	return [...Array(ingredients[ingredientKey])].map((_, index) => {
	// 		return (
	// 			<BurgerIngredient key={ingredientKey + index} type={ingredientKey} />
	// 		);
	// 	});
	// });
	// console.log(burgerIngredients);

	// If user has not added any ingredients, notify him
	if (burgerIngredients.length === 0)
		burgerIngredients = <p>Please start adding ingredients!</p>;

	return (
		<div className={styles.Burger}>
			<BurgerIngredient key='burger-top' type='bread-top' />
			{burgerIngredients}
			<BurgerIngredient key='bread-bottom' type='bread-bottom' />
		</div>
	);
};

export default Burger;
