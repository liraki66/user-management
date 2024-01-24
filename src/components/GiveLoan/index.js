import { Col, Row, Spin, message, Tooltip} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import {useParams, useNavigate} from "react-router-dom";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {brokerLoanRegistration, getBrokerLoanInfo} from "../../redux/slices/broker-settlement";
import {ToastContainer} from "react-toastify";
import ConfirmModal from "../General/ConfirmModal";


const GiveLoan = (props) => {

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
    })
    const [showModal,setShowModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)

    const loading = useSelector((state) => state.brokerSettlement.loading)
    const loanInfo = useSelector((state) => state.brokerSettlement.loanInfo)

    const {loanId, marketType} = useParams()
    const navigation = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getBrokerLoanInfo({loanId})).then(res=>{
            setLoan({...loan,...res.payload})
        })
    }, [])



    const loanRegistrationHandler = ()=>{
        // loan = {...loan,loanId,contractId: loanInfo.contractId.toString()}
       setShowModal(true)
    }

    const cancelLoanHandler = ()=>{
        navigation(`/inquiry/settlement/bank-settlement/${loanInfo.contractId}`)
    }
    const cancelModalHandler=()=>{
        setShowModal(false)
    }

    const onOkModalHandler = ()=> {
        setConfirmLoading(true)
        if (loan?.loanNumber) {
            dispatch(brokerLoanRegistration(loan)).then(res=>{
                setShowModal(false)
                setConfirmLoading(false)
            })
        }else{
            message.error({
                content: 'شماره تسهیلات ثبت نشده است',
                className: 'custom-message-error',
                style: {
                    marginTop: '6%',
                },
                duration: 3
            })
        }
    }

    const loanInfoChangeHandler = (event)=>{
        setLoan({...loan,[event.target.name]:event.target.value})
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
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'اعطای تسهیلات'} text={'آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
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
                    <CustomTextInput name={'loanNumber'} type={'text'} label={'شماره تسهیلات'} value={loan?.loanNumber} onChange={loanInfoChangeHandler} readOnly={loanInfo?.loanNumber}/>
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
                    <CustomTextInput type={'text'} suffix={'ريال'} label={'مبلغ تسهیلات'} value={loan?.loanAmount?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} suffix={'درصد'} label={'نرخ'} value={loan?.loanPercentage?.toLocaleString()} readOnly/>
                </Col>
            </Row>
            <Row gutter={24} justify={'end'} className={'footer-buttons'}>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} size={'large'} title={'انصراف'} onClick={cancelLoanHandler}/>
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} size={'large'} title={loadingButton ? <Spin /> : 'ثبت '} onClick={loanRegistrationHandler}/>
                </Col>
            </Row>
        </div>

    )
}

export default GiveLoan