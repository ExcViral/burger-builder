import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-burger-builder-2357-default-rtdb.firebaseio.com/',
});

export default instance;
