import axios from 'axios';

export default axios.create({
  // baseURL: process.env.REACT_APP_API_URL
  // baseURL: 'http://192.168.20.212:3000',
  // baseURL: 'http://192.168.20.223:3000',
  // baseURL: 'http://192.168.20.222:3000',
    baseURL: 'http://203.26.189.39:8000',
  //baseURL: 'https://misapi.lcp.mn',
});
