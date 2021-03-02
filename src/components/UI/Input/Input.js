import React from 'react';
import styles from './Input.module.css';

const Input = props => {
	// handle classes logic
	const inputClasses = [styles.InputElement];
	// for showing validation error message
	let validationError = null;
	// if `props.invalid` is set to true, append invalid class (Since all instances are different, it doesn;t matter)
	if (props.invalid) {
		inputClasses.push(styles.Invalid);
		// check if any error message was received
		if (props.errorMessage) {
			validationError = (
				<p className={styles.ValidationError}>{props.errorMessage}</p>
			);
		}
	}

	let inputElement = null;
	// first we check what type of input we want.
	// We can either do this by having individual styled input components.
	// or we can style them here itself by accepting attributes from parent component.
	// We assume that all proper props will be passed for each input type, so we just distribute them.
	// We rely on the parent component to pass the correct html attributes. But if wrong attributes are passed they may cause errors.
	switch (props.elementType) {
		case 'input':
			inputElement = (
				<input
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}
				/>
			);
			break;
		case 'textarea':
			inputElement = (
				<textarea
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}
				/>
			);
			break;
		case 'select':
			inputElement = (
				<select
					className={inputClasses.join(' ')}
					name={props.elementConfig.name}
					value={props.value}
					onChange={props.changed}>
					<optgroup label={props.elementConfig.optgroupDisplay} />
					{props.elementConfig.options.map(option => (
						<option key={option.value} value={option.value}>
							{option.displayName}
						</option>
					))}
				</select>
			);
			break;
		// TODO: Add more elements like dropdown, select etc...
		default:
			inputElement = (
				<input
					className={inputClasses.join(' ')}
					{...props.elementConfig}
					value={props.value}
					onChange={props.changed}
				/>
			);
	}

	return (
		// A wrapper div element
		<div className={styles.Input}>
			{/* We expect a label to be set from parent component */}
			<label className={styles.Label}>{props.label}</label>
			{/* Then we have input element itself */}
			{inputElement}
			{validationError}
		</div>
	);
};

export default Input;
