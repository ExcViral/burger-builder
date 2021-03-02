import * as actionTypes from './actionTypes';
import axiosInstance from '../../axios-auth.js';

const authStart = () => ({
	type: actionTypes.AUTH_START,
});

const authSuccess = authData => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: authData.idToken,
		userId: authData.localId,
	};
};

const authFail = error => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error,
	};
};

export const logout = () => {
	// clear the token and expiration time from local storage
	localStorage.removeItem('token');
	localStorage.removeItem('expirationDate');
	localStorage.removeItem('userId');
	return {
		type: actionTypes.AUTH_LOGOUT,
	};
};

const checkAuthTimeout = expirationTime => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logout());
		}, expirationTime * 1000);
	};
};

// ASYNC ACTION CREATOR WHICH WILL HANDLE AUTHENTICATION
export const auth = (email, password, isSignIn) => {
	return dispatch => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true,
		};
		// axiosInstance.post('/accounts:signUp?key=[API_KEY]', authData); // replace [API_KEY] with web API available under project settings in firebase
		let url =
			'/accounts:signInWithPassword?key=AIzaSyCXpm2i7Hk-oMuEvcBlavSbafglJsFp5Xc';
		// if user wants to Sign Up
		if (!isSignIn)
			url = '/accounts:signUp?key=AIzaSyCXpm2i7Hk-oMuEvcBlavSbafglJsFp5Xc';

		axiosInstance
			.post(url, authData)
			.then(response => {
				// console.log('AUTH SUCCESS', response);
				// save the token to local storage
				localStorage.setItem('token', response.data.idToken);
				// However we need to store additional information because this token will expire in an hour
				// Now for that we cannot simply store 1 hour, because time is relative, we need to store exact time when the token will expire
				// So, we first calculate the date when token expires, and then store it
				const expirationDate = new Date(
					new Date().getTime() + response.data.expiresIn * 1000 // * 1000 because JS time works in milliseconds
				);
				localStorage.setItem('expirationDate', expirationDate);
				// also store the userId
				localStorage.setItem('userId', response.data.localId);

				dispatch(authSuccess(response.data)); // dispatch action to save token
				dispatch(checkAuthTimeout(response.data.expiresIn)); // activate timeout to logout user
			})
			.catch(error => {
				// console.log('AUTH FAILURE', error.response);
				dispatch(authFail(error.response.data.error));
				// `error.response.data.error` because axios wraps error inside the error.response object
			});
		// Add Code For Handling Authentication
	};
};

// Action creator to check JWT status whenever application loads/reloads
export const authCheckState = () => {
	// console.log('trying');
	// we will use redux thunk dispatch syntax so that we can dispatch multiple actions from within
	return dispatch => {
		// read local storage for token and expiration time
		const token = localStorage.getItem('token');
		// console.log('[TOKEN]', token);
		// if no token found simply return, nothing more to do
		if (!token) {
			// console.log('[NO TOKEN LOGOUT]');
			dispatch(logout());
			return;
		} else {
			const userId = localStorage.getItem('userId');
			const expirationDate = new Date(localStorage.getItem('expirationDate')); // will return a string so convert to date
			if (!userId) {
				dispatch(logout());
				return;
			}
			if (!expirationDate) {
				dispatch(logout());
				return;
			}

			// console.log(userId, expirationDate);
			if (new Date() < expirationDate) {
				// token is good if current time < expiration time so dispatch success action
				dispatch(authSuccess({ idToken: token, localId: userId }));
				// also dispatch checkAuthTimeout to automatically logout when expiration time reaches
				dispatch(checkAuthTimeout((expirationDate - new Date()) / 1000));
				// console.log((expirationDate - new Date()) / 1000);
				// console.log('[SUCCESS TIMEOUT DISPATCHED]');
			} else {
				// token is no good, simply delete it
				dispatch(logout());
				// console.log('[LOGOUT]');
			}
		}
	};
};
