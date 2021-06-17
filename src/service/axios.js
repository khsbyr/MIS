import axios from 'axios';

export default axios.create({
    // baseURL: "http://47.243.54.125:8762/",
    baseURL: "http://192.168.10.18:8082/v2/api-docs",
})