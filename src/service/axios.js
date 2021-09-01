import axios from 'axios';

export default axios.create({
  // baseURL: process.env.REACT_APP_API_URL
  baseURL: 'http://192.168.20.217:3000',
  // baseURL: 'http://192.168.20.63:8000',
  // baseURL: 'http://47.243.61.40:3000',
  // baseURL: 'http://192.168.20.222:3000',
  // baseURL: 'http://localhost:8000',
  // baseURL: 'http://47.243.61.40:3000',
});
