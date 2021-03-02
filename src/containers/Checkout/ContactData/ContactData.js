import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Button from '../../../components/UI/Button/Button';
import styles from './ContactData.module.css';
import axiosInstance from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';

class ContactData extends Component {
	// setting reference for this component for auto scrolling when loaded
	// https://stackoverflow.com/questions/43441856/how-to-scroll-to-an-element
	myRef = React.createRef();

	state = {
		orderForm: {
			// UI: Local UI State
			name: {
				// elementType should be name of normal html tag with angular brackets
				elementType: 'input',
				// elementConfig should define configuration, the normal html attributes we want to pass to the html tag, in the end we will distribute this object as props to the given input element
				elementConfig: {
					name: 'name',
					type: 'text',
					placeholder: 'Your Name',
				},
				value: '',
				validation: {
					required: true,
					minLength: 3,
					maxLength: 30,
				},
				validationErrorMsg: '',
				isValid: false,
				touched: false,
			},
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
			street: {
				elementType: 'input',
				elementConfig: {
					name: 'street',
					type: 'text',
					placeholder: 'Your Street Address',
				},
				value: '',
				validationErrorMsg: '',
				validation: {
					required: true,
					maxLength: 50,
				},
				isValid: false,
				touched: false,
			},
			pincode: {
				elementType: 'input',
				elementConfig: {
					name: 'pincode',
					type: 'text',
					placeholder: 'Your PinCode',
				},
				value: '',
				validation: {
					required: true,
					regex: new RegExp('^[1-9][0-9]{2}\\s{0,1}[0-9]{3}$'),
				},
				validationErrorMsg: '',
				isValid: false,
				touched: false,
			},
			country: {
				elementType: 'input',
				elementConfig: {
					name: 'country',
					type: 'text',
					placeholder: 'Your Country',
				},
				value: '',
				validation: {
					required: true,
					minLength: 4, // Fact: This is actually minimum number of letters a countrys' name can have
				},
				isValid: false,
				validationErrorMsg: '',
				touched: false,
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					name: 'delivery-method',
					options: [
						{ value: 'fastest', displayName: 'Fastest' },
						{ value: 'cheapest', displayName: 'Cheapest' },
					],
					optgroupDisplay: 'Delivery Method',
				},
				// we need to set default value of the option
				value: 'fastest',
				validation: {},
				isValid: true,
				validationErrorMsg: '',
				touched: false,
			},
		},
		overallFormValidityStatus: false, // tracker to enable/disable form submit button
		// price: 50, // SHOULD BE MANAGED BY REDUX
		// name: '',
		// email: '',
		// address: {
		// 	street: '',
		// 	postalCode: '',
		// },
		loading: false,
		// redirect: false,
	};

	checkValidity = (value, rules, inputName) => {
		// assume that initially `value` is valid
		let validity = true;
		// check for required
		if (rules.required) {
			validity = value.trim() !== ''; // && validity;
			// if validity check fails no need to check others
			if (!validity) return [validity, `${inputName} cannot be empty.`];
			// instead of using the if check, we just use and operator. If any check inverts validity, it will always be false no matter what.
		}
		if (rules.minLength) {
			validity = value.trim().length >= rules.minLength; // && validity;
			// if validity check fails no need to check others
			if (!validity)
				return [
					validity,
					`${inputName} should have minimum ${rules.minLength} characters.`,
				];
		}
		if (rules.maxLength) {
			validity = value.trim().length <= rules.maxLength; // && validity;
			// if validity check fails no need to check others
			if (!validity)
				return [
					validity,
					`${inputName} can have maximum ${rules.maxLength} characters.`,
				];
		}
		if (rules.regex) {
			validity = rules.regex.test(value.trim()); // && validity;
			// if validity check fails no need to check others
			if (!validity) return [validity, `Please enter a valid ${inputName}.`];
		}
		// return truthy value depending on validity
		return [validity, ''];
	};

	inputChangeHandler = (event, targetInput) => {
		// first copy the orderForm
		const orderForm = { ...this.state.orderForm };
		// because there is nesting, we also need to copy the inner object that we need to change
		const targetInputConfig = { ...this.state.orderForm[targetInput] };
		targetInputConfig.value = event.target.value;
		// set the touched property to true (to start showing validation styles)
		targetInputConfig.touched = true;
		// check input validity
		[
			targetInputConfig.isValid,
			targetInputConfig.validationErrorMsg,
		] = this.checkValidity(
			targetInputConfig.value,
			targetInputConfig.validation,
			targetInput
		);
		// console.log(targetInputConfig.validationErrorMsg);
		// console.log(targetInputConfig.isValid);
		orderForm[targetInput] = targetInputConfig;

		// check overall form validity (to enable/disable submit button)
		let overallValidity = true;
		for (let [key, value] of Object.entries(orderForm)) {
			// console.log(value.isValid);
			// if even single input is false overallValidity=false
			if (!value.isValid) {
				overallValidity = false;
				break;
			}
		}

		this.setState({
			orderForm,
			overallFormValidityStatus: overallValidity,
		});
		// console.log(config);
	};

	orderHandler = event => {
		event.preventDefault();
		// console.log(Object.entries(this.state.orderForm));
		const contactForm = {};
		for (let [key, value] of Object.entries(this.state.orderForm)) {
			contactForm[key] = value.value;
		}
		// console.log(contactForm);
		this.setState({
			loading: true,
		});
		const order = {
			ingredients: this.props.ingredients, // SHOULD BE MANAGED BY REDUX
			price: this.props.price, // ignore the price for now, we'll come back here when we set up redux
			// We'll connect customerDetails to form later on
			customerDetails: {
				name: contactForm.name,
				email: contactForm.email,
				address: {
					street: contactForm.street,
					pincode: contactForm.pincode,
					country: contactForm.country,
				},
			},
			deliveryMethod: contactForm.deliveryMethod,
			userId: this.props.userId,
		};
		// console.log(order);
		// Note: the uri has .json at the end because firebase requires it, normally we won't have such extension in our uri

		axiosInstance
			// .post('/orders.json', order)
			.post('/orders.json?auth=' + this.props.token, order)
			.then(response => {
				// console.log('response', response);
				this.setState({
					// for closing spinner
					loading: false,
					// for closing modal
					// orderNowClicked: false,
					// redirect: true,
				});
				// redirect to /orders page
				this.props.history.replace('/orders');
			})
			.catch(error => {
				// console.log('error', error);
				this.setState({
					// for closing spinner
					loading: false,
					// for closing modal
					// orderNowClicked: false,
				});
			});
	};

	componentDidMount() {
		// this.myRef.current.scrollIntoView();
		window.scrollTo(0, this.myRef.current.offsetTop - 60); // -60 because navigation bar height is 56px so shifting 60px down
	}

	render() {
		let formInput = Object.entries(this.state.orderForm).map(el => {
			// console.log(!el[1].isValid);
			return (
				<Input
					key={el[0]}
					elementType={el[1].elementType}
					elementConfig={el[1].elementConfig}
					value={el[1].value}
					changed={event => this.inputChangeHandler(event, el[0])}
					// for showing special styles in case of invalid input
					// `&& el[1].touched` because initially all is invalid and we don't want to show invalid styles, we only want to start showing styles once user starts editing.
					invalid={!el[1].isValid && el[1].touched}
					errorMessage={el[1].validationErrorMsg}
				/>
			);
		});
		let form = (
			<form onSubmit={this.orderHandler}>
				{formInput}
				<Button
					btnType='Success'
					isDisabled={!this.state.overallFormValidityStatus}>
					Order Now
				</Button>
			</form>
		);
		if (this.state.loading) form = <Spinner />;

		return (
			<div className={styles.ContactData} ref={this.myRef}>
				{/* If order is successfully completed redirect to /orders page */}
				{/* {this.state.redirect ? <Redirect to='/orders' /> : null} */}
				<h4>Please enter your contact details</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.price,
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

export default connect(mapStateToProps)(ContactData);
