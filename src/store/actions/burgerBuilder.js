import * as actionTypes from './actionTypes.js';

export const setIngredients = ingredientObj => {
	return {
		type: actionTypes.SET_INGREDIENTS,
		ingredients: ingredientObj,
	};
};

export const addIngredient = igType => {
	return {
		type: actionTypes.ADD_INGREDIENT,
		ingredientType: igType,
		// ingredientPrice: INGREDIENT_PRICES[igType],
	};
};

export const removeIngredient = igType => {
	return {
		type: actionTypes.REMOVE_INGREDIENT,
		ingredientType: igType,
		// ingredientPrice: INGREDIENT_PRICES[igType],
	};
};
