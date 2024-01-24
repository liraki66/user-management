import axios from 'axios';
import jwt_decode from "jwt-decode"
import {BrokerSettlementBaseUrl, keycloakBaseUrl, keycloakLoginUrl} from './constants'
import qs from "qs";
import config from "./config";
import history from "./CustomRouter";
import {message} from "antd";
import store from "../redux/store";
import {logoutUser, raiseUnauthorized, setDecodedUserInfo, userLogin} from "../redux/slices/auth";
import {toast} from "react-toastify";



const getLocalAccessToken = () => {
    const accessToken = localStorage.getItem('access_token');
    if(accessToken!=='removed') return accessToken;
}

const getLocalRefreshToken = () => {
    const refreshToken = localStorage.getItem('refresh_token');
    return refreshToken;
}

export const request = axios.create({
    baseURL: BrokerSettlementBaseUrl,
});

request.defaults.headers.common['Content-Type'] = 'application/json'


const refreshTokenHandle = async () => {
    const formData = new FormData()
    const info = {
        'client_id': 'broker-settlement',
        'grant_type': 'refresh_token',
        'client_secret': '12aa90a1-7c61-4cda-8483-a22fe83a47a2',
        'refresh_token': getLocalRefreshToken()
    }
    for (let key in info) {
        formData.append(key, info[key]);
    }
    const response = await request.post(keycloakLoginUrl, qs.stringify({...info}),
        {
            baseURL: keycloakBaseUrl, transformRequest: (data, headers) => {
                delete headers.Authorization
                return data
            }
        })

    return response
}


request.interceptors.request.use(config => {
        if (getLocalAccessToken()) {
            config.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
        } else {
            history.replace('/login')
        }
        return config
    },
    error => Promise.reject(error))

request.interceptors.response.use(response => response, error => {

    const originalRequest = error.config

    if (error.response.status === 401 && originalRequest.url !== '/auth/realms/broker-settlement/protocol/openid-connect/token') {
        // refreshTokenHandle()
        //     .then(response => {
        //         localStorage.setItem('access_token', response.data.access_token)
        //         localStorage.setItem('refresh_token', response.data.refresh_token)
        //         request.defaults.headers['Authorization'] = "Bearer " + response.access_token;
        //         originalRequest.headers['Authorization'] = "Bearer " + response.access_token;
        //         return request(originalRequest)
        //     })
        //     .catch(e => {
        // message.error({
        //     content: 'زمان نشست شما به پایان رسید. لطفا مجددا وارد سامانه شوید',
        //     className: 'custom-message-error',
        //     style: {
        //         marginTop: '6%',
        //     },
        //     duration: 3
        // })
        store.dispatch(logoutUser(true))
        history.replace('/login')
        return Promise.reject(error);
        // })
    }

    return Promise.reject(error);
})

export default request
