import axios from 'axios';

axios.defaults.baseURL = `http://${window.location.hostname}:3002`;

export default axios;
