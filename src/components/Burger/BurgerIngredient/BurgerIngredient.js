import React from 'react';
import styles from './BurgerIngredient.module.css';
import PropTypes from 'prop-types';

const BurgerIngredient = props => {
	// define a variable to store jsx for an ingredient
	let ingredient = null;
	// we will check props.type and return an appropriate ingredient jsx
	switch (props.type) {
		case 'bread-bottom':
			ingredient = <div className={styles.BreadBottom}></div>;
			break;
		case 'bread-top':
			ingredient = (
				<div className={styles.BreadTop}>
					<div className={styles.Seeds1}></div>
					<div className={styles.Seeds2}></div>
				</div>
			);
			break;
		case 'meat':
			ingredient = <div className={styles.Meat}></div>;
			break;
		case 'cheese':
			ingredient = <div className={styles.Cheese}></div>;
			break;
		case 'salad':
			ingredient = <div className={styles.Salad}></div>;
			break;
		case 'bacon':
			ingredient = <div className={styles.Bacon}></div>;
			break;
		default:
			ingredient = null;
	}
	// finally return the jsx
	return ingredient;
};

BurgerIngredient.propTypes = {
	type: PropTypes.string.isRequired,
};

export default BurgerIngredient;
