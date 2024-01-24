import { Col, Row, Spin, message, Tooltip} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import {useParams, useNavigate, useLocation} from "react-router-dom";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    brokerLoanRegistration,
    doBrokerSettlementWithBank, doUnblockBrokerAccount,
    getBrokerLoanInfo, getBrokerSettlementRecordInfoWithBank
} from "../../redux/slices/broker-settlement";
import {toast, ToastContainer} from "react-toastify";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import moment from "moment";
import ConfirmModal from "../General/ConfirmModal";


const LoanSettlement = (props) => {

    const [loadingButton, setLoadingButton] = useState(false)
    let [loan, setLoan] = useState({
        brokerCode:'',
        brokerName:'',
        contractId:'',
        faBankDebtorsWithdrawalDate:'',
        loanAmount:'',
        loanId:'',
        loanNumber: '',
        loanPercentage: '',
        loanTime: '',
        settlementDate:null,
        settlementStatusFa:''
    })
    const [showLoanSettlementModal,setShowLoanSettlementModal]=useState(false)
    const [showUnblockModal,setShowUnblockModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)

    const loading = useSelector((state) => state.brokerSettlement.loading)
    const loanInfo = useSelector((state) => state.brokerSettlement.loanInfo)
    const user = useSelector(state=>state.auth.decodedUserInfo )

    const {loanId, marketType} = useParams()
    const navigation = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    console.log('state',location)

    useEffect(() => {
        dispatch(getBrokerSettlementRecordInfoWithBank({loanId})).then(res=>{
            setLoan({...loan,...res.payload})
        })
    }, [])


    const notifyToDate = () => toast.error('تاریخ تسویه تسهیلات را انتخاب کنید');

    const loanSettlementHandler = ()=>{
        setShowLoanSettlementModal(true)
    }


    const unblockAccountHandler = ()=>{
        if (user?.UnBlockBrokerAccount==='yes'){
            setShowUnblockModal(true)
        }else {
            toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
        }
    }

    const cancelLoanHandler = ()=>{
        // navigation(`/inquiry/settlement/bank-settlement/${loanInfo.contractId}`)
        navigation(`/inquiry/settlement/bank-settlement/${loan.contractId}`)
    }


    const cancelModalHandler=()=>{
        setShowLoanSettlementModal(false)
        setShowUnblockModal(false)
    }

    const onOkUnblockModalHandler = ()=>{
        setConfirmLoading(true)
        dispatch(doUnblockBrokerAccount({loanId})).then(res=>{
            setConfirmLoading(false)
            setShowUnblockModal(false)
        })
    }

    const onOkLoanSettlementModalHandler = ()=>{
        setConfirmLoading(true)
        if (loan.settlementDateFa){
            if (user?.DoBrokerSettlementWithBank==='yes'){
                dispatch(doBrokerSettlementWithBank({loanId,settlementDateFa:loan.settlementDateFa+" "+moment().locale('en_US').format('hh:mm:ss'),contractId:loan.contractId})).then(res=>{
                    setConfirmLoading(false)
                    setShowLoanSettlementModal(false)
                    // navigation(`/inquiry/settlement/bank-settlement/${loan.contractId}`)
                })
            }else {
                setConfirmLoading(false)
                setShowLoanSettlementModal(false)
                toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
            }
        }else {
            notifyToDate()
            setConfirmLoading(false)
            setShowLoanSettlementModal(false)
        }
    }

    const loanInfoChangeHandler = (event)=>{
        setLoan({...loan,[event.target.name]:event.target.value})
    }

    const loanSettlementDateChangeHandler = (date) =>{
        setLoan({...loan,settlementDateFa: date})
    }

    if (loading) {
        return(
            <div className={'spinner-container'}>
                <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'} />
            </div>
        )
    }

    return (
        <div className={'inquiry-content-container'}>
            <ConfirmModal visible={showLoanSettlementModal} onCancel={cancelModalHandler} onOk={onOkLoanSettlementModalHandler} title={'تسویه تسهیلات'} text={'آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <ConfirmModal visible={showUnblockModal} onCancel={cancelModalHandler} onOk={onOkUnblockModalHandler} title={'رفع مسدودی وجه'} text={'آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
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
            <Row gutter={[{lg:16},24]}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput name={'loanNumber'} type={'text'} label={'شماره تسهیلات'} value={loan?.loanNumber} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'نام شرکت کارگزار'} value={loan?.brokerName} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'کد کارگزاری'} value={loan?.brokerCode} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'تاریخ اعطای تسهیلات'} value={ loan?.loanTime+' - '+loan?.faBankDebtorsWithdrawalDate } readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'تاریخ مسدودی وجه'} value={loan?.blockedDepositDateFa } readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تاریخ تسویه تسهیلات</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={loan?.settlementDateFa ? dayjs(loan?.settlementDateFa, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => loanSettlementDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'toDateStr'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} suffix={'ريال'} label={'مبلغ تسهیلات'} value={loan?.loanAmount?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} suffix={'درصد'} label={'نرخ'} value={loan?.loanPercentage?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} suffix={'ریال'} label={'مبلغ جریمه'} value={location.state?.record?.penaltyAmount?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} suffix={'درصد'} label={'درصد سود + جریمه'} value={location.state?.record?.penaltyPercentage?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'وضعیت تسویه تسهیلات'} value={loan?.settlementStatusFa} readOnly/>
                </Col>
            </Row>
            <Row gutter={[{lg:16},24]} style={{marginTop:'1rem'}}>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} style={{width:'130px'}} size={'large'} title={loadingButton ? <Spin /> : 'رفع مسدودی وجه '} onClick={unblockAccountHandler}/>
                </Col>
            </Row>
            <Row gutter={24} justify={'end'} className={'footer-buttons'}>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} size={'large'} title={'انصراف'} onClick={cancelLoanHandler}/>
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} size={'large'} title={loadingButton ? <Spin /> : 'تسویه '} onClick={loanSettlementHandler}/>
                </Col>
            </Row>
        </div>

    )
}

export default LoanSettlement