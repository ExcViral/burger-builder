import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import styles from './CheckoutSummary.module.css';

const CheckoutSummary = props => {
	return (
		<div className={styles.CheckoutSummary}>
			<h1>
				<p>We hope it tastes well!</p>
			</h1>
			<div
				style={{
					width: '100%',
					// height: '300px',
					margin: 'auto',
					boxSizing: 'border-box',
					overflowY: 'scroll',
				}}>
				<Burger ingredients={props.ingredients} />
			</div>
			<p>
				<strong>Total Price: {props.price}</strong>
			</p>
			<div>
				<Button btnType='Danger' clicked={props.checkoutCancelled}>
					Cancel
				</Button>
				<Button btnType='Success' clicked={props.checkoutContinued}>
					Continue
				</Button>
			</div>
		</div>
	);
};

export default CheckoutSummary;
