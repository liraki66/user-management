import {Col, message, Row} from "antd";
import LoginForm from "../../components/Forms/LoginForm";
import {Link, useNavigate} from "react-router-dom";
import {  } from 'react-router-dom';
import PicLogin from '../../assets/images/PicLogin.svg'
import './index.scss'
import {useEffect} from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useSelector} from "react-redux";


const LoginPage = (props) => {

    const user = useSelector(state=>state.auth.decodedUserInfo)
    const isLoggedOut = useSelector(state=>state.auth.isLoggedOut)

    const navigate = useNavigate()

    const notify = () => toast.error('زمان نشست شما به پایان رسید. لطفا مجددا وارد سامانه شوید');

    useEffect(()=>{
        if (isLoggedOut && !user?.userinfo?.personnelcode) {
           notify()
        }
    },[user?.userinfo?.personnelcode])

    const linkToForgetPassword = ()=>{
        navigate('/forget-password')
    }
    return (
        <div className={'login-page-container'}>
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
            <Row align={'middle'}>
                <Col xs={24} md={16} xl={19}>
                    <div className={'login-page-form'}>
                        <LoginForm/>
                        <div className={'login-page-footer'}>
                            {/*<div onClick={linkToForgetPassword} className={'login-page-footer-text'}>فراموشی رمز عبور</div>*/}
                        </div>
                    </div>
                </Col>
                <Col xs={24} md={8} xl={5}>
                    <div className={'login-page-image'}>
                        <img src={PicLogin} alt={'logo'} />
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default LoginPage