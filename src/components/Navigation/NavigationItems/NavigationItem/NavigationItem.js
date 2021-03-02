import React from 'react';
import styles from './NavigationItem.module.css';
import { NavLink } from 'react-router-dom';

const NavigationItem = props => (
	<li className={styles.NavigationItem} onClick={props.clicked}>
		<NavLink to={props.link} activeClassName={styles.active} exact>
			{props.children}
		</NavLink>
		{/* <a href={props.link} className={props.active ? styles.active : null}>
			{props.children}
		</a> */}
	</li>
);

export default NavigationItem;
