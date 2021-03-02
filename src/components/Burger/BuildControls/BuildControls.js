import React from 'react';
import BuildControl from './BuildControl/BuildControl.js';
import styles from './BuildControls.module.css';

const controls = [
	{ label: 'Meat', type: 'meat' },
	{ label: 'Cheese', type: 'cheese' },
	{ label: 'Salad', type: 'salad' },
	{ label: 'Bacon', type: 'bacon' },
];

const BuildControls = props => {
	return (
		<div className={styles.BuildControls}>
			<p>
				Price: <strong>{props.price.toFixed(2)}</strong>
			</p>
			{controls.map((ctrl, index) => {
				return (
					<BuildControl
						label={ctrl.label}
						type={ctrl.type}
						key={index}
						// control={props.control}
						plusIngredient={props.plusIngredient}
						minusIngredient={props.minusIngredient}
						ingredients={props.ingredients}
					/>
				);
			})}
			<button
				className={styles.OrderButton}
				disabled={!props.purchasable}
				onClick={props.purchasing}>
				{props.auth ? 'Order Now!' : 'Sign In to Order'}
			</button>
		</div>
	);
};

export default BuildControls;
