import React from 'react';
import styles from './BuildControl.module.css';

const BuildControl = props => {
	return (
		<div className={styles.BuildControl}>
			<div className={styles.Label}>{props.label}</div>
			<button
				className={styles.More}
				// onClick={() => props.control(props.type, true, false)}>
				onClick={() => props.plusIngredient(props.type)}>
				More
			</button>
			<button
				className={styles.Less}
				// onClick={() => props.control(props.type, false, true)}
				onClick={() => props.minusIngredient(props.type)}
				disabled={props.ingredients[props.type] === 0}>
				{' '}
				Less
			</button>
			{/* <div className={styles.Label}>Qty: {props.ingredients[props.type]}</div> */}
		</div>
	);
};

export default BuildControl;
