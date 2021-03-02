import React from 'react';
import styles from './Order.module.css';

const Order = props => {
	// ingredients prop should be object and price prop should be value
	const ingredients = Object.entries(props.ingredients).map(ingredient =>
		ingredient[1] > 0 ? (
			<span
				style={{
					textTransform: 'capitalize',
					display: 'inline-block',
					margin: '0 8px',
					border: '1px solid #ccc',
					padding: '5px',
				}}
				key={ingredient[0]}>
				{ingredient[0]} ({ingredient[1]}),
			</span>
		) : null
	);
	return (
		<div className={styles.Order}>
			<p>
				<strong>Ingredients: </strong>
				{ingredients}
			</p>

			<p>
				<strong>Price: </strong>Rs. {props.price}
			</p>
		</div>
	);
};

export default Order;
