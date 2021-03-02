import React, { Component } from 'react';
import styles from './Auth.module.css';
import Button from '../../components/UI/Button/Button';
import Input from '../../components/UI/Input/Input';
import axiosInstance from '../../axios-auth.js';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/actionCreators.js';
import Spinner from '../../components/UI/Spinner/Spinner';
import { Redirect } from 'react-router-dom';

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					name: 'email',
					type: 'email',
					placeholder: 'Your E-Mail Address',
				},
				value: '',
				validation: {
					required: true,
					regex: new RegExp('^\\S+@\\S+\\.\\S+$'),
					maxLength: 50,
				},
				validationErrorMsg: '',
				isValid: false,
				touched: false,
			},
			password: {
				elementType: 'input',
				elementConfig: {
					name: 'password',
					type: 'password',
					placeholder: 'Your Password',
				},
				value: '',
				validation: {
					required: true,
					minLength: 6, // this is required by firebase
					maxLength: 50,
				},
				validationErrorMsg: '',
				isValid: false,
				touched: false,
			},
		},
		controlsValidityStatus: false,
		isSignIn: true,
	};

	checkValidity = (value, rules, inputName) => {
		// assume that initially `value` is valid
		let validity = true;
		// check for required
		if (rules.required) {
			validity = value.trim() !== '';
			// if validity check fails no need to check others
			if (!validity) return [validity, `${inputName} cannot be empty.`];
		}
		if (rules.minLength) {
			validity = value.trim().length >= rules.minLength;
			if (!validity)
				return [
					validity,
					`${inputName} should have minimum ${rules.minLength} characters.`,
				];
		}
		if (rules.maxLength) {
			validity = value.trim().length <= rules.maxLength;
			if (!validity)
				return [
					validity,
					`${inputName} can have maximum ${rules.maxLength} characters.`,
				];
		}
		if (rules.regex) {
			validity = rules.regex.test(value.trim());
			if (!validity) return [validity, `Please enter a valid ${inputName}.`];
		}
		// return truthy value depending on validity along with empty error msg string
		return [validity, ''];
	};

	inputChangedHandler = (event, targetInput) => {
		// copy immutably [two levels]
		const controls = {
			...this.state.controls,
			[targetInput]: { ...this.state.controls[targetInput] },
		};
		// set up two way binding
		controls[targetInput].value = event.target.value;
		// switch on validation styles
		controls[targetInput].touched = true;
		// set field validity and error message
		[
			controls[targetInput].isValid,
			controls[targetInput].validationErrorMsg,
		] = this.checkValidity(
			event.target.value,
			controls[targetInput].validation,
			targetInput
		);
		// set overall validity
		let overallValidty = true;
		for (let [key, value] of Object.entries(controls)) {
			if (!value.isValid) {
				overallValidty = false;
				break;
			}
		}
		// console.log(controls);
		this.setState({
			controls,
			controlsValidityStatus: overallValidty,
		});
	};

	authHandler = event => {
		event.preventDefault();
		// console.log(this.state.isSignIn);
		this.props.onAuth(
			this.state.controls.email.value,
			this.state.controls.password.value,
			this.state.isSignIn
		);
	};

	switchAuthModeHandler = () => {
		this.setState(prevState => ({
			isSignIn: !prevState.isSignIn,
		}));
	};

	// Implementing friendly error messages for common error codes
	setAuthErrors = () => {
		// console.log('set');
		if (this.props.error) {
			// console.log('CALLED set');
			switch (this.props.error.message) {
				case 'EMAIL_EXISTS':
					return 'The email address is already in use by another account.';
				case 'OPERATION_NOT_ALLOWED':
					return 'Your account access has been disabled.';
				case 'TOO_MANY_ATTEMPTS_TRY_LATER':
					return 'We have blocked all requests from this device due to unusual activity. Try again later.';
				case 'EMAIL_NOT_FOUND':
					return 'The user does not exist. Please create a new account';
				case 'INVALID_PASSWORD':
					return 'The password is invalid.';
				case 'USER_DISABLED':
					return 'Your account has been disabled.';
				default:
					break;
			}
		}
	};

	render() {
		// console.log(this.props.location.state);
		let formElements = Object.entries(this.state.controls).map(
			([elemType, elemConfig]) => {
				// console.log(elemType, elemConfig);
				return (
					<Input
						key={elemType}
						elementType={elemConfig.elementType}
						elementConfig={elemConfig.elementConfig}
						value={elemConfig.value}
						changed={event => this.inputChangedHandler(event, elemType)}
						invalid={!elemConfig.isValid && elemConfig.touched}
						errorMessage={elemConfig.validationErrorMsg}
					/>
				);
			}
		);

		let form = (
			<form onSubmit={this.authHandler}>
				{formElements}
				<Button
					btnType='Success'
					isDisabled={!this.state.controlsValidityStatus}>
					{this.state.isSignIn ? 'Sign In' : 'Sign Up'}
				</Button>
			</form>
		);
		// console.log(this.props.loading);
		// when sign in or sign up button is clicked loading will be set to true
		if (this.props.loading) form = <Spinner />;

		// display any error messages
		const authErrMsg = this.setAuthErrors();

		// decide redirect location:
		// CASE 1: If the user came in directly to auth page (without building a burger and clicking `sign in to order`) then we simply want to redirect him to burger builder page
		// CASE 2: If the user was redirected to auth page (after building burger and clicking `sign in to order`) we want to redirect him to a location defined in the state of history.push('/auth',[state])
		let redirectLocation = '/'; // default: only CASE 1
		if (this.props.location.state)
			redirectLocation = this.props.location.state.redirectTo; // check if CASE 2 is applicable

		return (
			<div className={styles.Auth}>
				{/* Redirect to home if already logged in */}
				{this.props.auth ? <Redirect to={redirectLocation} /> : null}
				<p style={{ color: 'red' }}>{authErrMsg}</p>
				{form}
				{/* <p>
					{this.state.isSignIn
						? "Don't have an account?"
						: 'Already have an account?'}
				</p> */}
				<Button btnType='Danger' clicked={this.switchAuthModeHandler}>
					{this.state.isSignIn
						? 'Create a new account'
						: 'Click here to Log In'}
				</Button>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		auth: state.auth.token !== null, // we will redirect user to home page if he is already logged in
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onAuth: (email, password, isSignIn) =>
			dispatch(actionCreators.auth(email, password, isSignIn)),
	};
};

// export default connect(
// 	mapStateToProps,
// 	mapDispatchToProps
// )(withErrorHandler(Auth, axiosInstance));
export default connect(mapStateToProps, mapDispatchToProps)(Auth);
