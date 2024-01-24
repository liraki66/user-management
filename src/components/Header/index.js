import './index.scss'
import User from '../../assets/images/user.png'
import Notification from '../../assets/images/left_side_notification_button.svg'
import useAuth from "../../services/auth";
import {useDispatch, useSelector} from "react-redux";
import jwt_decode from "jwt-decode";
import {logoutUser} from "../../redux/slices/auth";
import history from "../../services/CustomRouter";
import ConfirmModal from "../General/ConfirmModal";
import React from "react";
import {useState} from "react";

const Header = (props) =>{

    const [showModal,setShowModal] =useState(false)
    // const user = useSelector(state=>state.auth.decodedUserInfo ) || jwt_decode(localStorage.getItem('access_token'))?.userinfo
    const user =  jwt_decode(localStorage.getItem('access_token'))


    const dispatch = useDispatch()

    const logoutHandler = ()=>{
        setShowModal(true)
    }

    const cancelModalHandler=()=>{
        setShowModal(false)
    }

    const onOkModalHandler =()=>{
        dispatch(logoutUser(true))
        history.replace('/login')
    }

    return (
        <div className={'header-container'}>
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'خروج از سامانه'} text={'از سامانه خارج می شوید. آیا مطمئن هستید؟'}/>
            <div className={'header-notification-wrapper'}>
                {/*<img src={Notification}/>*/}
                {/*<span className={'header-notification-count'}>0</span>*/}
            </div>
            <div className={'header-profile-wrapper'}>
                <div>
                    <div>{JSON.parse(user?.userinfo)?.faName + ' ' +JSON.parse(user?.userinfo)?.faLastName}</div>
                    <div>کارشناس </div>
                    {/*<div>کد پرسنلی : {auth?.userinfo?.personnelcode} </div>*/}
                    <div className={'logout-user'} onClick={logoutHandler}>خروج</div>
                </div>
                <img src={User} alt={'user'} style={{borderRadius:'50%',width:'50px',height:'50px'}}/>
            </div>
        </div>
    )
}

export default Header