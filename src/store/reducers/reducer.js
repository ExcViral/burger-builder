import { combineReducers } from 'redux';
import burgerReducer from './burgerBuilder.js';
import authReducer from './auth.js';

const reducer = combineReducers({
	burgerBuilder: burgerReducer,
	auth: authReducer,
});

export default reducer;
