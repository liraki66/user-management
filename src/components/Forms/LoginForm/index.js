import React, {useEffect, useState} from 'react';
import {Button, Form, Input, message} from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.scss'
import CustomTextInput from "../../Fields/CustomTextInput";
import LogoLogin from '../../../assets/images/logoLogin.svg'
import useAuth  from "../../../services/auth";
import axios from "axios";
import {keycloakBaseUrl, keycloakLoginUrl} from "../../../services/constants";
import qs from "qs";
import request from "../../../services/request";
import {setDecodedUserInfo, userLogin} from "../../../redux/slices/auth";
import {useDispatch, useSelector} from "react-redux";
import jwt_decode from "jwt-decode";
import history from "../../../services/CustomRouter";
import {ToastContainer} from "react-toastify";



const LoginForm = (props) => {

    const [userName, setUSerName] = useState('')
    const [password, setPassword] = useState('')

    const isLoggedOut = useSelector(state=>state.auth.isLoggedOut)

    const dispatch = useDispatch()


    const navigate = useNavigate();


    // useEffect(()=>{
    //     if (isLoggedOut) {
    //         message.error({
    //             content: 'زمان نشست شما به پایان رسید. لطفا مجددا وارد سامانه شوید',
    //             className: 'custom-message-error',
    //             style: {
    //                 marginTop: '2%',
    //             },
    //             duration: 3
    //         })
    //     }
    // },[])


    const onFinish = (values) => {
        const data = {
            ...values,
            // client_id : 'broker-settlement',
            // grant_type : 'password',
            // client_secret : '1ea7f579-5e94-4e52-a41c-28bc40ea808b',
            // scope : 'banking-profile claims'
        }

        dispatch(userLogin(data)).then((res)=>{
            // localStorage.setItem('access_token',res.payload.access_token)
            // localStorage.setItem('refresh_token',res.payload.refresh_token)
            dispatch(setDecodedUserInfo(jwt_decode(res.payload.access_token)))
            navigate('/')
        })
    };


    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const handleUsernameInput = (event) => {
        setUSerName(event.currentTarget.value)
    }

    const handlePasswordInput = (event) => {
        setPassword(event.currentTarget.value)
    }

    return (
        <>
            <ToastContainer style={{fontFamily:'IRANSans'}}
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={true}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl
                            pauseOnFocusLoss={false}
                            draggable={false}
                            pauseOnHover={true}
                            theme="colored"/>
            <Form
                name="basic"
                wrapperCol={{span: 24}}
                initialValues={{remember: true}}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className={'login-form'}
                size={'small'}
            >
                <div className={'title'}>
                    <img src={LogoLogin} />
                    <div>ســامــانـه تســــویه</div>
                    <div>وجوه معاملات کارگزاران</div>
                </div>
                <Form.Item
                    style={{marginBottom:'2rem'}}
                    name="username"
                    rules={[{required: true, message: 'نام کاربری خود را وارد کنید'}]}
                >
                    <CustomTextInput type={'text'} label={'نام کاربری'} onChange={handleUsernameInput} value={userName}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{required: true, message: 'رمز عبور خود را وارد کنید'}]}
                >
                    <CustomTextInput type={'password'} label={'رمز عبور'} onChange={handlePasswordInput} value={password}/>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        ورود
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

export default LoginForm;