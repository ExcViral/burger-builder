import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';
import styles from './Toolbar.module.css';

const Toolbar = props => {
	return (
		<header className={styles.Toolbar}>
			<DrawerToggle clicked={props.toggleClicked} />
			<div style={{ height: '80%' }}>
				<Logo />
			</div>
			<nav className={styles.DesktopOnly}>
				<NavigationItems auth={props.auth} />
			</nav>
		</header>
	);
};

export default Toolbar;
