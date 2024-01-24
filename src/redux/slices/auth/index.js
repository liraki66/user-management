import    { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import request from "../../../services/request";
import {
    keycloakLoginUrl,
    keycloakBaseUrl,
    GetBrokerList,
    BrokerSettlementBaseUrl,
    GetToken
} from "../../../services/constants";
import {message} from "antd";
import qs from "qs";
import {toast} from "react-toastify";

export const userLogin = createAsyncThunk(
    'auth/login',
    async (data)=>{
        try {
            // const response = await request.post(keycloakLoginUrl, qs.stringify({...data}),
            //     {baseURL: keycloakBaseUrl, headers: {'content-type': 'application/x-www-form-urlencoded'}});
            const response = await request.post(GetToken,data, {baseURL: BrokerSettlementBaseUrl});
            localStorage.setItem('access_token',response.data.access_token)
            localStorage.setItem('refresh_token',response.data.refresh_token)
            return response.data;
        }
        catch (e) {

            if (e.response.status===401) {
                toast.error('نام کاربری یا رمز عبور صحیح نیست')
                // message.error({
                //     content: ,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '5%',
                //     },
                //     duration: 3
                // })
            }else {
                toast.error('خطای سرور')
                // message.error({
                //     content: ,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '5%',
                //     },
                //     duration: 3
                // })
            }
        }
    }
)

export const setDecodedUserInfo = createAsyncThunk(
    'auth/setInfo',
    async (data)=>{
        return data
    }
)

export const raiseUnauthorized = createAsyncThunk(
    'auth/unauthorized',
    async (data)=>{
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        toast.error('زمان نشست شما به پایان رسید. لطفا مجددا وارد سامانه شوید')
        // message.error({
        //     content: ,
        //     className: 'custom-message-error',
        //     style: {
        //         marginTop: '6%',
        //     },
        //     duration: 3
        // })
        // history.replace('/login')
        return data
    }
)


export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userInfo: {},
        decodedUserInfo: {},
        isLoggedOut:false,
        loading: false,
    },
    reducers:{
        logoutUser:(state,action)=>{
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            state.isLoggedOut = action.payload
            state.userInfo = {}
            state.decodedUserInfo = {}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending,(state,action)=>{
            state.loading = true
        })
        builder.addCase(userLogin.fulfilled,(state,action)=>{
            state.userInfo = {...action.payload}
            state.isLoggedOut=false
            state.loading = false
        })
        builder.addCase(userLogin.rejected,(state,action)=>{
            state.loading = false
        })
        builder.addCase(setDecodedUserInfo.fulfilled,(state,action)=>{
            state.decodedUserInfo = action.payload
            state.isLoggedOut=false
        })
        builder.addCase(raiseUnauthorized.fulfilled,(state,action)=>{
            state.isLoggedOut = action.payload
            state.dedecodedUserInfo = {}
        })
    }
})

const { actions,reducer} = authSlice

export const { logoutUser } = actions

export default reducer

