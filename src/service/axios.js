import axios from 'axios';

export default axios.create({
  // baseURL: process.env.REACT_APP_API_URL
  baseURL: 'http://192.168.20.222:3000',
});
