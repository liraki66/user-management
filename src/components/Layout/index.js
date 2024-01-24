import {Col, Input, Row} from 'antd';
import Header from "../Header";
import {ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader, SidebarContent, SidebarFooter} from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './index.scss'
import LogoLogin from '../../assets/images/logoLogin.svg'
import ToseLogo from '../../assets/images/Tose_Logo.svg'
import Pishkhon from '../../assets/images/pishkhon.svg'
import PishkhonActive from '../../assets/images/pishkhon_Active.svg'
import Kargozar from '../../assets/images/kargozar.svg'
import KargozarActive from '../../assets/images/kargozar_Active.svg'
import Garardad from '../../assets/images/garardad.svg'
import GarardadActive from '../../assets/images/garardad_active.svg'
import Tasvie from '../../assets/images/tasvie.svg'
import TasvieActive from '../../assets/images/tasvie_active.svg'
import Gozaresh from '../../assets/images/gozaresh.svg'
import GozareshActive from '../../assets/images/gozaresh_active.svg'
import Stakeholder from '../../assets/images/stakeholder.svg'
import StakeholderActive from '../../assets/images/stakeholder-active.svg'
import Branch from '../../assets/images/branch.svg'
import BranchActive from '../../assets/images/branch-active.svg'
import User from '../../assets/images/user.svg'
import UserActive from '../../assets/images/user-active.svg'
import Date from '../../assets/images/date.svg'
import DateNotActive from '../../assets/images/dateNotActive.svg'
import {useLocation, NavLink, useParams} from "react-router-dom";
import CustomButton from "../Fields/CustomButton";
import {useDispatch} from "react-redux";
import {getReleaseNote} from "../../redux/slices/report";
import {resetData} from "../../redux/slices/broker-settlement";
import {useState} from "react";

const Layout = ({children, content, title, buttonTitle, onClickButton, downloadable, downloadCSV, downloadXLSX}) => {

    const [contractNumber,setContractNumber]=useState('')

    const {pathname} = useLocation();
    const dispatch = useDispatch()

    const checkIsActive = (urlItem) => {
        if (pathname.startsWith('/' + urlItem)) {
            return true
        }
        return false
    }

    const getReleaseNoteHandler = () => {
        dispatch(getReleaseNote({param: 'pdf', name: 'تغییرات نسخه'}))
    }

    const resetChangeHandler = (e)=>{
        setContractNumber(e.target.value)
    }

    const resetDataHandler = () => {
        console.log('reset')
        if (contractNumber) {
            dispatch(resetData({contractNumber})).then(res=>setContractNumber(''))
        }
    }


    return (
        <>
            <Row>
                <Header/>
            </Row>
            <Row>
                <Col lg={4}>
                    <ProSidebar rtl={true} onToggle={(e) => console.log(e)}>
                        <SidebarHeader>
                            <div className={'layout-sidebar-header'}>
                                <img src={LogoLogin}/>
                                <div>
                                    <div>سـامـانـه تسـویه وجوه</div>
                                    <small> معاملات شرکت های کارگزاری</small>
                                </div>
                            </div>
                        </SidebarHeader>
                        <SidebarContent>
                            <Menu iconShape="square">
                                <MenuItem active={pathname.startsWith('/counter') || pathname === '/'}>
                                    <div
                                        className={`${checkIsActive('counter') || pathname === '/' ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img
                                            src={checkIsActive('counter') || pathname === '/' ? PishkhonActive : Pishkhon}/>
                                        <NavLink to={'/counter'}>پیشخوان</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/brokers')}>
                                    <div
                                        className={`${checkIsActive('brokers') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('brokers') ? KargozarActive : Kargozar}/>
                                        <NavLink to={'/brokers'}>شرکت های کارگزاری</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/contracts')}>
                                    <div
                                        className={`${checkIsActive('contracts') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('contracts') ? GarardadActive : Garardad}/>
                                        <NavLink to={'/contracts'}>قراردادها</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/inquiry')}>
                                    <div
                                        className={`${checkIsActive('inquiry') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        {/*<img src={checkIsActive('inquiry')?EstelamActive:Estelam} />*/}
                                        <img src={checkIsActive('inquiry') ? TasvieActive : Tasvie}/>
                                        <NavLink to={'/inquiry'}>استعلام و تسویه حساب</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/stakeholders')}>
                                    <div
                                        className={`${checkIsActive('stakeholders') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('stakeholders') ? StakeholderActive : Stakeholder}/>
                                        <NavLink to={'/stakeholders'}>ذینفعان</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/branches')}>
                                    <div
                                        className={`${checkIsActive('branches') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('branches') ? BranchActive : Branch}/>
                                        <NavLink to={'/branches'}>شعب</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/users')}>
                                    <div
                                        className={`${checkIsActive('users') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('users') ? UserActive : User}/>
                                        <NavLink to={'/users'}>مدیریت کاربران</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/groups')}>
                                    <div
                                        className={`${checkIsActive('groups') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('groups') ? UserActive : User}/>
                                        <NavLink to={'/groups'}>مدیریت دسترسی گروه ها</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/calendar')}>
                                    <div
                                        className={`${checkIsActive('calendar') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('calendar') ? Date : DateNotActive}/>
                                        <NavLink to={'/calendar'}>تنظیم تقویم کاری</NavLink>
                                    </div>
                                </MenuItem>
                                <MenuItem active={pathname.startsWith('/reports')}>
                                    <div
                                        className={`${checkIsActive('reports') ? 'layout-sidebar-item active' : 'layout-sidebar-item'}`}>
                                        <img src={checkIsActive('reports') ? GozareshActive : Gozaresh}/>
                                        <NavLink to={'/reports'}>گزارشات</NavLink>
                                    </div>
                                </MenuItem>
                            </Menu>
                        </SidebarContent>
                        <SidebarFooter>
                            <div style={{display:'flex',marginTop:'1rem'}}>
                                <Input placeholder={'شماره قرارداد'} onChange={resetChangeHandler} value={contractNumber}/>
                                <CustomButton style={{width:'120px'}} title={'ریست دیتا'} type={'primary'} onClick={resetDataHandler}/>
                            </div>
                            <div onClick={getReleaseNoteHandler} className={'release-note'}>تغییرات نسخه</div>
                            <div className={'layout-sidebar-footer'}>
                                <img src={ToseLogo}/>
                            </div>
                        </SidebarFooter>
                    </ProSidebar>
                </Col>
                <Col lg={20}>
                    {content ?
                        <div className={pathname.includes('-contract') ? 'layout-content-scroll' : 'layout-content'}>
                            <Row className={'layout-header-container'}>
                                <Col md={8}><h3>{title}</h3></Col>
                                <Col lg={5} xl={4} xxl={3} style={{marginLeft: '2rem'}}>{buttonTitle ?
                                    <CustomButton title={buttonTitle} onClick={onClickButton}
                                                  type={'primary'}/> : null}</Col>
                            </Row>
                            {children}
                        </div> : children}
                </Col>
            </Row>
        </>
    )
}

export default Layout
