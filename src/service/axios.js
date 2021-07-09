import axios from 'axios';

export default axios.create({
    baseURL: process.env.REACT_APP_API_URL
    //baseURL: "http://192.168.10.18:3000/"
})
