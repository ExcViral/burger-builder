import React, { useState } from 'react';
import Aux from '../../hoc/Aux/Aux';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer.js';
import Toolbar from '../Navigation/Toolbar/Toolbar.js';
import styles from './Layout.module.css';

const Layout = props => {
	const [showSideDrawer, setShowSideDrawer] = useState(false);
	return (
		<Aux>
			{/* if state update depends on previous state, pass function */}
			<Toolbar
				toggleClicked={() => setShowSideDrawer(prevState => !prevState)}
				auth={props.auth}
			/>
			<SideDrawer
				show={showSideDrawer}
				auth={props.auth}
				clicked={() => setShowSideDrawer(false)}
			/>
			<main className={styles.Content}>{props.children}</main>
		</Aux>
	);
};

export default Layout;
