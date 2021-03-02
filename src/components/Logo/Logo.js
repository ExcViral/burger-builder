import reactDom from 'react-dom';
import React from 'react';
import logoImg from '../../assets/images/burger-logo.png';
import styles from './Logo.module.css';

const Logo = props => (
	<div className={styles.Logo}>
		<img src={logoImg} alt='Application Logo' />
	</div>
);

export default Logo;
