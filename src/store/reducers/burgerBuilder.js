import * as actionTypes from '../actions/actionTypes.js';

// We define a constant variable for price
// In React, we use FULL_CAPS notation for global variables
// TODO: This value should come from database
const INGREDIENT_PRICES = {
	meat: 50,
	cheese: 10,
	salad: 20,
	bacon: 80,
};

const initialState = {
	ingredients: null,
	price: 50, // base price
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.SET_INGREDIENTS: {
			const updatedState = { ...state };
			updatedState.ingredients = action.ingredients;
			// console.log(updatedState);
			return updatedState;
		}
		case actionTypes.ADD_INGREDIENT: {
			const updatedState = { ...state }; // copy state immutably
			updatedState.ingredients = { ...state.ingredients }; // copy ingredients immutably
			updatedState.ingredients[action.ingredientType]++; // increment the ingredient
			updatedState.price += INGREDIENT_PRICES[action.ingredientType]; // increment the price
			// console.log(updatedState);
			return updatedState;
		}
		case actionTypes.REMOVE_INGREDIENT: {
			const updatedState = { ...state }; // copy state immutably
			updatedState.ingredients = { ...state.ingredients }; // copy ingredients immutably
			updatedState.ingredients[action.ingredientType]--; // decrement the ingredient
			updatedState.price -= INGREDIENT_PRICES[action.ingredientType]; // decrement the price
			// console.log(updatedState);
			return updatedState;
		}

		default:
			return state;
			break;
	}
	return state;
};

export default reducer;
