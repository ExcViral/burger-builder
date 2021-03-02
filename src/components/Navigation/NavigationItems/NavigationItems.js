import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem.js';
import styles from './NavigationItems.module.css';

const NavigationItems = props => (
	<ul className={styles.NavigationItems}>
		{/* <NavigationItem link='/burger-builder' active={true}> */}
		<NavigationItem link='/burger-builder' clicked={props.clicked}>
			Burger Builder
		</NavigationItem>
		{props.auth ? (
			<NavigationItem link='/orders' clicked={props.clicked}>
				Orders
			</NavigationItem>
		) : null}
		{/* Conditionally show login/logout depending on authentication status */}
		{!props.auth ? (
			<NavigationItem link='/auth' clicked={props.clicked}>
				Login
			</NavigationItem>
		) : (
			<NavigationItem link='/logout' clicked={props.clicked}>
				Logout
			</NavigationItem>
		)}
	</ul>
);

export default NavigationItems;
