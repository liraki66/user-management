import {Col, Row, Spin, message, Tooltip, Collapse} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import {useParams, useNavigate} from "react-router-dom";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    brokerLoanRegistration,
    doBrokerSettlementWithBankDebtors, getBrokerLoanInfo,
    getBrokerSettlementInfoWithBankDebtors
} from "../../redux/slices/broker-settlement";
import {currentDateTime} from "../../services/helper";
import {toast, ToastContainer} from "react-toastify";
import ConfirmModal from "../General/ConfirmModal";
import {deleteStakeholder} from "../../redux/slices/stakeholders";


const {Panel} = Collapse;

const BankDebtorsSettlement = (props) => {

    let [loan, setLoan] = useState({
        loanId:'' ,
        contractId: '',
        brokerName: '',
        brokerCode: '',
        loanNumber: null,
        faBankDebtorsWithdrawalDate: '',
        loanTime: '',
        loanAmount: '',
        loanPercentage: ''
    })

    // let [loan, setLoan] = useState({
    //     brokerCode:'',
    //     brokerName:'',
    //     contractId:'',
    //     marketFaName:'',
    //     persianDate:'',
    //     faBankDebtorsWithdrawalDate:'',
    //     loanAmount:'',
    //     debtAmount:'',
    //     settlementStatus:'',
    //     loanInfo: {
    //         loanId:'' ,
    //         contractId: '',
    //         brokerName: '',
    //         brokerCode: '',
    //         loanNumber: null,
    //         faBankDebtorsWithdrawalDate: '',
    //         loanTime: '',
    //         loanAmount: '',
    //         loanPercentage: ''
    //     }
    // })


    const [loading, setLoading] = useState(false)
    const [loadingButton, setLoadingButton] = useState(false)
    const [data, setData] = useState(null)
    const [showModal,setShowModal]=useState(false)
    const [showLoanModal,setShowLoanModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)
    const [loanConfirmLoading,setLoanConfirmLoading]=useState(false)

    const bankDebtorsInfo=useSelector(state=>state.brokerSettlement.bankDebtorsSettlementInfo)
    const loanLoading = useSelector((state) => state.brokerSettlement.loading)
    // const loanInfo = useSelector((state) => state.brokerSettlement.loanInfo)
    const user = useSelector(state=>state.auth.decodedUserInfo )

    const {contractId,loanId} = useParams()
    const navigation = useNavigate()
    const dispatch = useDispatch()


    useEffect(() => {
        setLoading(true)
        setTimeout(()=>{
            dispatch(getBrokerSettlementInfoWithBankDebtors({
                contractId: contractId,
                settlementDateFa: currentDateTime
            })).then(res=>{
                setLoading(false)
            })
        },500)
        // dispatch(getBrokerLoanInfo({loanId})).then(res=>{
        //     setLoan({...loan,...res.payload})
        // })

    }, [])

    const bankDebtorsSettlementHandler = ()=>{
        if (user?.DoBrokerSettlementWithBankDebtors==='yes'){
            setShowModal(true)
        }else {
            toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
        }

    }

    const cancelHandler = ()=>{
        navigation('/inquiry')
    }

    const cancelModalHandler=()=>{
        setShowModal(false)
    }

    const onOkModalHandler = ()=>{
        setConfirmLoading(true)
        dispatch(doBrokerSettlementWithBankDebtors({
            contractId: contractId,
            settlementDateFa: currentDateTime
        }))
        setConfirmLoading(false)
        setShowModal(false)
    }

    const loanRegistrationHandler = ()=>{
        // loan = {...loan,loanId,contractId: loanInfo.contractId.toString()}
        if (user?.BrokerLoanRegistration==='yes'){
            setShowLoanModal(true)
        }else {
            toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
        }
    }

    const cancelLoanHandler = ()=>{
        // navigation(`/inquiry/settlement/bank-settlement/${loanInfo.contractId}`)
        navigation('/inquiry')
    }
    const cancelLoanModalHandler=()=>{
        setShowLoanModal(false)
    }

    const onOkLoanModalHandler = ()=> {
        setConfirmLoading(true)
        if (loan?.loanNumber) {
            dispatch(brokerLoanRegistration(loan)).then(res=>{
                setShowLoanModal(false)
                setLoanConfirmLoading(false)
            })
        }else{
            setShowLoanModal(false)
            setLoanConfirmLoading(false)
            message.error({
                content: 'شماره تسهیلات ثبت نشده است',
                className: 'custom-message-error',
                style: {
                    marginTop: '6%',
                },
                duration: 3
            })
        }
        setConfirmLoading(false)
    }

    const loanInfoChangeHandler = (event)=>{
        setLoan({...bankDebtorsInfo.loanInfo,[event.target.name]:event.target.value})
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
            <ConfirmModal visible={showLoanModal} onCancel={cancelLoanModalHandler} onOk={onOkLoanModalHandler} title={'اعطای تسهیلات'} text={'آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'تسویه با سرفصل بدهکاران'} text={'تسویه با سرفصل بدهکاران انجام می شود. آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
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
            <Collapse>
                <Panel header="اعطای تسهیلات" key="1" style={{position:'relative'}}>
                    <Row gutter={[{lg:16},24]} style={{marginBottom:'2rem'}}>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput name={'loanNumber'} type={'text'} label={'شماره تسهیلات'} value={bankDebtorsInfo?.loanInfo?.loanNumber || loan?.loanNumber} onChange={loanInfoChangeHandler} readOnly={bankDebtorsInfo?.loanInfo?.loanNumber}/>
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput type={'text'} label={'نام شرکت کارگزار'} value={bankDebtorsInfo?.loanInfo?.brokerName} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput type={'text'} label={'کد کارگزاری'} value={bankDebtorsInfo?.loanInfo?.brokerCode} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput type={'text'} label={'تاریخ اعطای تسهیلات'} value={ bankDebtorsInfo?.loanInfo?.faBankDebtorsWithdrawalDate ? bankDebtorsInfo?.loanInfo?.loanTime+' - '+bankDebtorsInfo?.loanInfo?.faBankDebtorsWithdrawalDate :'' } readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput type={'text'} suffix={'ريال'} label={'مبلغ تسهیلات'} value={bankDebtorsInfo?.loanInfo?.loanAmount?.toLocaleString()} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput type={'text'} suffix={'درصد'} label={'نرخ'} value={bankDebtorsInfo?.loanInfo?.loanPercentage?.toLocaleString()} readOnly/>
                        </Col>
                    </Row>
                    <Row gutter={24} justify={'end'}>
                        <Col lg={4} xl={3} xxl={3}>
                            <CustomButton type={'primary'} size={'large'} title={'انصراف'} onClick={cancelLoanHandler}/>
                        </Col>
                        {bankDebtorsInfo?.loanInfo?.loanNumber ? null : <Col lg={4} xl={3} xxl={3}>
                            <CustomButton type={'primary'} size={'large'} title={loadingButton ? <Spin/> : 'ثبت '}
                                          onClick={loanRegistrationHandler}/>
                        </Col>}
                    </Row>
                </Panel>
                <Panel header="تسویه با سرفصل بدهکاران بانک" key="2" style={{position:'relative'}}>
                    <Row gutter={[{lg:16},48]}  style={{marginBottom:'2rem'}}>
                        <Col lg={8} xl={7} xxl={5}>
                            <CustomTextInput type={'text'} label={'نام شرکت کارگزار'} value={bankDebtorsInfo?.brokerName} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={5}>
                            <CustomTextInput type={'text'} label={'کد کارگزاری'} value={bankDebtorsInfo?.brokerCode} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={5}>
                            <CustomTextInput type={'text'} label={'نوع بازار'} value={bankDebtorsInfo?.marketFaName} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={5}>
                            <CustomTextInput type={'text'} label={'تاریخ'} value={bankDebtorsInfo?.persianDate} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={5}>
                            <CustomTextInput type={'text'} suffix={'ريال'} label={'مبلغ'} value={bankDebtorsInfo?.debtAmount?.toLocaleString()} readOnly/>
                        </Col>
                        <Col lg={8} xl={7} xxl={5}>
                            <CustomTextInput type={'text'} label={'وضعیت'} value={bankDebtorsInfo?.settlementStatus} readOnly/>
                        </Col>
                    </Row>
                    <Row gutter={24} justify={'end'}>
                        <Col lg={4} xl={4} xxl={3}>
                            <CustomButton type={'primary'} size={'large'} title={'انصراف'} onClick={cancelHandler}/>
                        </Col>
                        <Col lg={4} xl={4} xxl={3}>
                            <CustomButton type={'primary'} size={'large'} title={loadingButton ? <Spin /> : 'تسویه '} onClick={bankDebtorsSettlementHandler}/>
                        </Col>
                    </Row>
                </Panel>
            </Collapse>

        </div>

    )
}

export default BankDebtorsSettlement