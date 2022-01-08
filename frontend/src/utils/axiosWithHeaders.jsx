import axios from "axios";
import { authManager } from "./authManager"; 

const axiosWithHeaders = () => {
    const token = authManager.getToken();
    
    let headers = {
        'Content-Type':    'application/json',
        'Accept':          'application/json',
        'X-Authorization': process.env.REACT_APP_API_KEY
    };

    if (token !== null) {
        headers.Authorization = 'Bearer ' + token;
    }

    return axios.create({
        headers: headers,
    });
};

export default axiosWithHeaders;