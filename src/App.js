import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Layout from './components/Layout/Layout.js';
import Auth from './containers/Auth/Auth.js';
import Logout from './containers/Auth/Logout/Logout.js';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder.js';
import Checkout from './containers/Checkout/Checkout.js';
import Orders from './containers/Orders/Orders.js';
import { connect } from 'react-redux';
import Aux from './hoc/Aux/Aux.js';
import * as actionCreators from './store/actions/actionCreators.js';

const App = props => {
	// const protectedRoutes = (
	// 	<Aux>
	// 		<Route path='/checkout' component={Checkout} />
	// 		<Route path='/orders' component={Orders} />
	// 		<Route path='/logout' component={Logout} />
	// 	</Aux>
	// );
	props.tryAutoSignIn();
	const protectedRoutes = [
		<Route key='/checkout' path='/checkout' component={Checkout} />,
		<Route key='/orders' path='/orders' component={Orders} />,
		<Route key='/logout' path='/logout' component={Logout} />,
	];
	return (
		<div>
			<BrowserRouter>
				<Layout auth={props.token}>
					<Switch>
						<Route path='/burger-builder' component={BurgerBuilder} />
						<Route path='/auth' component={Auth} />
						{props.token ? protectedRoutes : null}
						<Route>
							<Redirect to='/burger-builder' />
						</Route>
					</Switch>
				</Layout>
			</BrowserRouter>
		</div>
	);
};

const mapStateToProps = state => {
	return {
		token: state.auth.token !== null,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		tryAutoSignIn: () => dispatch(actionCreators.authCheckState()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
