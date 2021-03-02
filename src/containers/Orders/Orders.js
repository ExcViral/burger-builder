import React, { Component } from 'react';
import styles from './Orders.module.css';
import axiosInstance from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import Spinner from '../../components/UI/Spinner/Spinner';
import Order from '../../components/Order/Order';
import { connect } from 'react-redux';

class Orders extends Component {
	state = {
		orders: null,
		loading: true,
		error: false,
	};

	componentDidMount() {
		const queryParams =
			'?auth=' +
			this.props.token +
			'&orderBy="userId"&equalTo="' +
			this.props.userId +
			'"';
		axiosInstance
			// .get('/orders.json')
			.get('/orders.json' + queryParams)
			.then(response => {
				// console.log(response.data);
				this.setState({
					orders: response.data,
					loading: false,
				});
			})
			.catch(err => {
				this.setState({
					error: true,
				});
			});
	}
	render() {
		let orders = <Spinner />;
		if (!this.state.loading && this.state.orders) {
			// orders = this.state.orders.map(order => {
			// 	console.log(order);
			// 	return <Order />;
			// });
			orders = Object.entries(this.state.orders).map(order => {
				return (
					<Order
						key={order[0]}
						ingredients={order[1].ingredients}
						price={order[1].price}
					/>
				);
			});
		}
		if (this.state.error) {
			orders = (
				<h3 style={{ textAlign: 'center', color: 'red' }}>
					Oops! Something went wrong!
				</h3>
			);
		}
		return (
			<div>
				{/* <h1 style={{ textAlign: 'center' }}>Orders</h1> */}
				{orders}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		token: state.auth.token,
		userId: state.auth.userId,
	};
};

export default connect(mapStateToProps)(
	withErrorHandler(Orders, axiosInstance)
);
