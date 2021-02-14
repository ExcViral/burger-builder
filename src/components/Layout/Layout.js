import React from 'react';
import Aux from '../../hoc/Aux.js';
import styles from './Layout.module.css';

const Layout = props => (
	<Aux>
		<div>Toolbar, Side Drawer, Backdrop</div>
		<main>{props.children}</main>
	</Aux>
);

export default Layout;
