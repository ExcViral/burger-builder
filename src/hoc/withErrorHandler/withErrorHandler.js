import React, { Component } from 'react';
import Aux from '../Aux/Aux';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
	// this component returns an anonymous class, it is like a class factory
	// we return class because we want to use axios interceptors inside componentDidMount()
	// we use global axios interceptors to catch the errors so that we can display them on modal
	return class extends Component {
		// constructor(props) {
		// 	super(props);
		// 	this.state = {
		// 		error: null,
		// 	};
		// 	axios.interceptors.request.use(
		// 		config => {
		// 			// before sending a new request, we first clear any errors that were set earlier
		// 			console.log('interceptor request config: ', config);
		// 			// this.setState({ error: null });
		// 			this.state = {
		// 				error: null,
		// 			};
		// 			return config;
		// 		},
		// 		error => {
		// 			console.log('interceptor request error: ', error);
		// 			// this.setState({ error: error });
		// 			this.state = {
		// 				error: error,
		// 			};
		// 		}
		// 	);
		// 	axios.interceptors.response.use(
		// 		response => response,
		// 		error => {
		// 			console.log('interceptor response error: ', error);
		// 			// this.setState({ error: error });
		// 			this.state = {
		// 				error: error,
		// 			};
		// 		}
		// 	);
		// 	this.closeErrorModalHandler = () => {
		// 		this.setState({
		// 			error: null,
		// 		});
		// 	};
		// }
		state = {
			error: null,
		};

		// we need to set up the iterceptors before the child component mounts so that we can catch all errors
		componentWillMount() {
			// we will store reference to these interceptors which will be used upon ejecting
			this.requestInterceptor = axios.interceptors.request.use(
				config => {
					// before sending a new request, we first clear any errors that were set earlier
					this.setState({ error: null });
					return config;
				},
				error => {
					this.setState({ error: error });
					return Promise.reject(error);
					// return Promise.reject(error.response); // correct because axios wraps error
				}
			);
			this.responseInterceptor = axios.interceptors.response.use(
				response => response,
				error => {
					this.setState({ error: error });
					return Promise.reject(error);
					// return Promise.reject(error.response); // correct because axios wraps error
				}
			);
		}

		// once the child component unmounts, we need to eject all interceptors we set up.
		// If we dont do this, there will be multiple instances of these interceptors
		// These multiple interceptors will cause errors and leak memory, so we must eject them once this component unmounts
		// So, we need to clean up these interceptors before setting up new ones
		componentWillUnmount() {
			// console.logs just to check if interceptors are getting ejected
			// console.log(
			// 	'will unmount start',
			// 	this.requestInterceptor,
			// 	this.responseInterceptor
			// );
			axios.interceptors.request.eject(this.requestInterceptor);
			axios.interceptors.response.eject(this.responseInterceptor);
		}

		closeErrorModalHandler = () => {
			this.setState({
				error: null,
			});
		};

		render() {
			return (
				<Aux>
					<Modal
						show={this.state.error}
						closeModal={this.closeErrorModalHandler}>
						{this.state.error ? this.state.error.message : null}
					</Modal>
					{/* we simply return the wrapped component and distribute any props it might have so as to not lose them */}
					<WrappedComponent {...this.props} />
				</Aux>
			);
		}
	};
};

export default withErrorHandler;
