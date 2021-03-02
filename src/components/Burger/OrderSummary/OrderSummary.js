import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Button from '../../UI/Button/Button';

const OrderSummary = props => {
	const ingredientsList = Object.entries(props.ingredients).map(ingredient => {
		if (ingredient[1] > 0) {
			return (
				<li key={ingredient[0]}>
					<span style={{ textTransform: 'capitalize' }}>
						<strong>{ingredient[0]}</strong>
					</span>{' '}
					x {ingredient[1]}
				</li>
			);
		} else {
			return null;
		}
	});
	return (
		<Aux>
			<h3>Please Confirm Your Order:</h3>
			<p>
				We will prepare for you a delicious Burger with the following
				ingredients:
			</p>
			<ul>{ingredientsList}</ul>
			<p>
				<strong>Total Price: {props.price.toFixed(2)}</strong>
			</p>
			<p>Continue to checkout?</p>
			<Button btnType='Danger' clicked={props.onCancelOrder}>
				CANCEL
			</Button>
			<Button btnType='Success' clicked={props.onContinueOrder}>
				CONTINUE
			</Button>
		</Aux>
	);
};

export default OrderSummary;
