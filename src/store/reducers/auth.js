import { act } from 'react-dom/test-utils';
import * as actionTypes from '../actions/actionTypes.js';

const initialState = {
	loading: false,
	token: null,
	userId: null,
	error: null,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START: {
			return {
				...state,
				loading: true,
				error: null,
			};
		}
		case actionTypes.AUTH_SUCCESS: {
			return {
				...state,
				loading: false,
				token: action.idToken,
				userId: action.userId,
				error: null,
			};
		}
		case actionTypes.AUTH_FAIL: {
			return {
				...state,
				loading: false,
				error: action.error,
				// token: null,
				// userId: null,
			};
		}

		case actionTypes.AUTH_LOGOUT: {
			return {
				...state,
				token: null,
				userId: null,
			};
		}

		default:
			return state;
	}
};

export default reducer;
