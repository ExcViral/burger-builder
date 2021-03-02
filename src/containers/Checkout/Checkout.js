import styles from './Checkout.module.css';
import React, { Component } from 'react';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import { Route, Redirect } from 'react-router-dom';
import ContactData from './ContactData/ContactData';
import { connect } from 'react-redux';

class Checkout extends Component {
	state = {
		// ingredients: null, // Read Only: Should transfer control to REDUX
		// needs price too
		// redirectToBuilder: false, // We'll See
	};

	determineIfPurchasable = ingredients => {
		const quantityArr = Object.values(ingredients);
		const purchasableUpdate = Boolean(
			quantityArr.reduce(
				(partial_sum, current_val) => partial_sum + current_val,
				0
			)
		);
		return purchasableUpdate;
	};

	componentDidMount() {
		// console.log(this.props.location.search === '');
		// if no query params found, redirect to burger builder page
		// if (this.props.location.search === '') {
		// 	// console.log('SHOULD GOBACK');
		// 	this.setState({ redirectToBuilder: true });
		// }
		// const query = new URLSearchParams(this.props.location.search);
		// const ingredients = {};
		// for (let param of query.entries()) {
		// 	// console.log(param); // yields ['start', '5']
		// 	ingredients[param[0]] = param[1];
		// }
		// this.setState({ ingredients });

		// check if the ingredients are empty, if they are => Redirect to builder
		if (!this.props.ingredients) {
			this.props.history.replace('/');
		} else if (!this.determineIfPurchasable(this.props.ingredients)) {
			this.props.history.replace('/');
		}
	}

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	};

	checkoutContinuedHandler = () => {
		this.props.history.replace(`${this.props.match.url}/contact-data`);
	};

	render() {
		// console.log(this.props);
		let checkoutSummary = null;
		if (this.props.ingredients) {
			checkoutSummary = (
				<CheckoutSummary
					ingredients={this.props.ingredients}
					price={this.props.price}
					checkoutCancelled={this.checkoutCancelledHandler}
					checkoutContinued={this.checkoutContinuedHandler}
				/>
			);
		}
		// if (this.state.redirectToBuilder) {
		// 	// console.log('Should really go back');
		// 	checkoutSummary = <Redirect to='/' />;
		// }
		return (
			<div>
				{checkoutSummary}
				{/* Now how do we pass on ingredients to ContactData component? */}
				{/* TRICK: Instead of using component={ContactData} use render={() => <ContactData props />} */}
				<Route
					path={`${this.props.match.url}/contact-data`}
					component={ContactData}
					// render={() => <ContactData ingredients={this.props.ingredients} />}
				/>
				{/* Another Way: Dont use self closing tag, wrap around Contact Data */}
				{/* <Route path={`${this.props.match.url}/contact-data`}>
					<ContactData ingredients={this.state.ingredients} />
				</Route> */}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.price,
	};
};

export default connect(mapStateToProps)(Checkout);
