import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux.js';
import Burger from '../../components/Burger/Burger.js';
import BuildControls from '../../components/Burger/BuildControls/BuildControls.js';
import Modal from '../../components/UI/Modal/Modal.js';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary.js';
import axiosInstance from '../../axios-orders.js';
import Spinner from '../../components/UI/Spinner/Spinner.js';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/actionCreators.js';

// // We define a constant variable for price
// // In React, we use FULL_CAPS notation for global variables
// const INGREDIENT_PRICES = {
// 	meat: 50,
// 	cheese: 10,
// 	salad: 20,
// 	bacon: 80,
// };

class BurgerBuilder extends Component {
	state = {
		// ingredients: null, // Should be handed over to REDUX
		// this is bad approach, the price should be calculated on the server or the user can manipulate the price.
		// price: 50, // Should be handed over to REDUX
		// purchasable: false, // UI: To enable/disable Order Now button on /burger-builder
		orderNowClicked: false, // UI: To show/hide modal when Order Now button was clicked
		loading: false, // UI (Redundant|No longer in use): To show spinner when post request was made
		ingredientsFetchError: false, // UI: To render error message in case Ingredient Fetch request fails
	};

	orderNowHandler = () => {
		// We first check if the user is authenticated, if he is we show him modal from where he can continue
		// otherwise we forward the user to /auth for logging him in and then he can come back on this page to continue his order
		if (this.props.auth) {
			// for showing modal when ordernow button is clicked
			this.setState({
				orderNowClicked: true,
			});
		} else {
			// This is very good use of the `state` property of history.push
			// on the target component, this `state` can be accessed under `this.props.location.state.redirectTo`
			this.props.history.push({
				pathname: '/auth',
				state: { redirectTo: '/checkout' },
			});
		}
	};

	cancelOrderNowHandler = () => {
		// for closing modal
		this.setState({
			orderNowClicked: false,
		});
	};

	continueOrderHandler = () => {
		// alert('Order Passed');
		// this.setState({
		// 	loading: true,
		// });
		// const order = {
		// 	ingredients: this.state.ingredients,
		// 	price: this.state.price,
		// 	customerDetails: {
		// 		name: 'Placeholder Name',
		// 		address: 'Placeholder Address',
		// 	},
		// };
		// // Note: the uri has .json at the end because firebase requires it, normally we won't have such extension in our uri
		// axiosInstance
		// 	.post('/orders.json', order)
		// 	.then(response => {
		// 		// console.log(response);
		// 		this.setState({
		// 			// for closing spinner
		// 			loading: false,
		// 			// for closing modal
		// 			orderNowClicked: false,
		// 		});
		// 	})
		// 	.catch(error => {
		// 		// console.log(error);
		// 		this.setState({
		// 			// for closing spinner
		// 			loading: false,
		// 			// for closing modal
		// 			orderNowClicked: false,
		// 		});
		// 	});

		// once the user clicks the continue button, let's redirect him to the /checkout page
		// console.log('clicked');
		// this.props.history.push({
		// 	pathname: '/checkout',
		// 	search: new URLSearchParams(this.state.ingredients).toString(),
		// });
		// console.log(this.props);
		this.props.history.push('/checkout');
	};

	// updatePurchasableState = ingredients => {
	// 	// if atleast one ingredient is added, state should be purchasable
	// 	const quantityArr = Object.values(ingredients);
	// 	const purchasableUpdate = Boolean(
	// 		quantityArr.reduce(
	// 			(partial_sum, current_val) => partial_sum + current_val,
	// 			0
	// 		)
	// 	);
	// 	this.setState({
	// 		purchasable: purchasableUpdate,
	// 	});
	// };

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

	// burgerUpdateHandler = (ingredientType, inc, dec) => {
	// 	// update the ingredient quantity
	// 	let ingredients = { ...this.state.ingredients };
	// 	let price = this.state.price;
	// 	if (inc) {
	// 		ingredients[ingredientType]++;
	// 		// update the pricing
	// 		price = price + INGREDIENT_PRICES[ingredientType];
	// 	}
	// 	if (dec && ingredients[ingredientType] > 0) {
	// 		ingredients[ingredientType]--;
	// 		// update the pricing
	// 		price = price - INGREDIENT_PRICES[ingredientType];
	// 	}
	// 	// commit updates
	// 	this.setState({
	// 		ingredients: ingredients,
	// 		price: price,
	// 	});
	// 	// update state of order button
	// 	this.updatePurchasableState(ingredients);
	// };

	componentDidMount() {
		// Since we are using REDUX we will check if the state.ingredients is null
		// If it is null, that means we are starting afresh => make get request
		// If ingredients already present, that means user was already building burger => restore state
		// NOTE: There are two approaches possible:
		//     First: Fetch Ingredients in component and set it up in redux using action dispatchers
		//     Second: Dispatch an action from component and execute async request in action creator and then set it up in redux store
		//     Both approaches are fine
		if (!this.props.ingredients) {
			axiosInstance
				.get('/ingredients.json')
				.then(response => {
					this.props.setIngredients(response.data);
					// this.setState({
					// 	ingredients: response.data,
					// });
				})
				.catch(error => {
					this.setState({
						ingredientsFetchError: true,
					});
				});
		}
	}

	// componentDidUpdate() {
	// 	// update state of order button
	// 	if (this.props.ingredients) {
	// 		this.updatePurchasableState(this.props.ingredients);
	// 	}
	// }

	render() {
		// console.log(this.props);
		// console.log(this.state.ingredients, this.state.price);
		let orderSummary = null;
		let burger = this.state.ingredientsFetchError ? (
			<p style={{ color: 'red', textAlign: 'center' }}>
				Oops! Something went wrong!
			</p>
		) : (
			<Spinner />
		);

		if (this.props.ingredients) {
			const purchasable = this.determineIfPurchasable(this.props.ingredients);
			burger = (
				<Aux>
					<Burger ingredients={this.props.ingredients} />;
					<BuildControls
						// control={this.burgerUpdateHandler}
						plusIngredient={this.props.plusIngredient}
						minusIngredient={this.props.minusIngredient}
						ingredients={this.props.ingredients}
						price={this.props.price}
						purchasable={purchasable}
						purchasing={this.orderNowHandler}
						auth={this.props.auth}
					/>
				</Aux>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ingredients}
					onCancelOrder={this.cancelOrderNowHandler}
					onContinueOrder={this.continueOrderHandler}
					price={this.props.price}
				/>
			);
		}

		// Redundant because now we are not making any post request from this component
		if (this.state.loading) orderSummary = <Spinner />;

		return (
			<Aux>
				<Modal
					show={this.state.orderNowClicked}
					closeModal={this.cancelOrderNowHandler}>
					{orderSummary}
				</Modal>
				{/* <Burger ingredients={this.state.ingredients} /> */}
				{burger}
				{/* <BuildControls
					control={this.burgerUpdateHandler}
					ingredients={this.state.ingredients}
					price={this.state.price}
					purchasable={this.state.purchasable}
					purchasing={this.orderNowHandler}
				/> */}
			</Aux>
		);
	}
}

// TODO: set up subscriptions
const mapStateToProps = state => {
	return {
		ingredients: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.price,
		auth: state.auth.token !== null,
	};
};

// Set up Action Dispatchers
const mapDispatchToProps = dispatch => {
	return {
		setIngredients: ingredientObj =>
			dispatch(actionCreators.setIngredients(ingredientObj)),
		plusIngredient: igType => dispatch(actionCreators.addIngredient(igType)),
		minusIngredient: igType =>
			dispatch(actionCreators.removeIngredient(igType)),
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axiosInstance));
