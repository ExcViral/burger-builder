import React from 'react';
import Aux from '../../../hoc/Aux/Aux';
import Logo from '../../Logo/Logo';
import Backdrop from '../../UI/Backdrop/Backdrop';
import NavigationItems from '../NavigationItems/NavigationItems';
import styles from './SideDrawer.module.css';

const SideDrawer = props => {
	return (
		<Aux>
			<Backdrop show={props.show} clicked={props.clicked} />
			<div
				className={[
					styles.SideDrawer,
					props.show ? styles.Open : styles.Close,
				].join(' ')}>
				<div style={{ height: '10%', marginBottom: '32px' }}>
					<Logo />
				</div>
				<nav>
					{/* in mobile whenever user clicks on navidation item side-drawer should close */}
					<NavigationItems clicked={props.clicked} auth={props.auth} />
				</nav>
			</div>
		</Aux>
	);
};

export default SideDrawer;
