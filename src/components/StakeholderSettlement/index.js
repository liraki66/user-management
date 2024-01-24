import { Col, Row, Spin, message, Tooltip} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import {useParams, useNavigate} from "react-router-dom";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import brokerSettlement, {
    blockAccount,
    doBrokerSettlementWithStakeHolder, getMarketsList,
    getStakeholderSettlementInfo, withdrawFromBankDebtorsAccount
} from "../../redux/slices/broker-settlement";
import {currentDateTime} from "../../services/helper";
import ConfirmModal from "../General/ConfirmModal";
import {toast} from "react-toastify";


const StakeholderSettlement = (props) => {

    const [loading, setLoading] = useState(false)
    const [loadingButton, setLoadingButton] = useState(false)
    const [moneyTransferStatus,setMoneyTransferStatus] = useState('')
    const [showBlockModal,setShowBlockModal]=useState(false)
    const [showLoanModal,setShowLoanModal]=useState(false)
    const [showSettlementModal,setShowSettlementModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)

    const settlementInfo=useSelector(state=>state.brokerSettlement.stakeholderSettlementInfo)
    const marketList = useSelector(state => state.brokerSettlement.marketsList)
    const user = useSelector(state=>state.auth.decodedUserInfo )

    const navigation = useNavigate()
    const dispatch = useDispatch()
    const {contractId}=useParams()


    useEffect(() => {
        setLoading(true)
        dispatch(getMarketsList())
        setTimeout(()=>{
            dispatch(getStakeholderSettlementInfo({
                contractId: contractId,
                settlementDateFa: currentDateTime
            })).then(res=>{
                setLoading(false)
            })
        },500)

    }, [])

    const cancelModalHandler = () => {
        setShowSettlementModal(false)
        setShowBlockModal(false)
        setShowLoanModal(false)
    }

    const onOkSettlementModalHandler = ()=>{
        setConfirmLoading(true)
        dispatch(doBrokerSettlementWithStakeHolder({
            contractId: contractId,
            settlementDateFa: currentDateTime
        })).then(res=>{
            setConfirmLoading(false)
            setShowSettlementModal(false)
        })
        // navigation('/inquiry')
    }

    const onOkLoanModalHandler = ()=>{
        setConfirmLoading(true)
        dispatch(withdrawFromBankDebtorsAccount({
            contractId: contractId,
            settlementDateFa: currentDateTime
        })).then(res=>{
            dispatch(getStakeholderSettlementInfo({
                contractId: contractId,
                settlementDateFa: currentDateTime
            }))
            setConfirmLoading(false)
            setShowLoanModal(false)
        })
    }

    const onOkBlockModalHandler = ()=> {
        setConfirmLoading(true)
        dispatch(blockAccount({
            contractId: contractId,
            blockDateFa: currentDateTime
        })).then(res=>{
            dispatch(getStakeholderSettlementInfo({
                contractId: contractId,
                settlementDateFa: currentDateTime
            }))
            setConfirmLoading(false)
            setShowBlockModal(false)
        })
    }


    const needLoanHandler = ()=>{
        // navigation(`/inquiry/settlement/give-loan/${contractId}`)
        if (user?.WithdrawFromBankDebtorsAccount==='yes'){
            setShowLoanModal(true)
        }else {
            toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
        }
    }

    const blockAccountHandler = ()=>{
        if (user?.BlockBrokerAccount==='yes'){
            setShowBlockModal(true)
        }else {
            toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
        }
    }

    const cancelStakeholderSettlementHandler = ()=>{
        navigation('/inquiry')
    }

    const stakeholderSettlementHandler = ()=>{
        // const marketId = marketList.filter(item=>item.marketFaName === settlementInfo?.faMarketType)?.[0]?.id
        // dispatch(doBrokerSettlementWithStakeHolder({
        //     contractId: contractId,
        //     settlementDateFa: currentDateTime,
        //     marketId
        // }))
        // navigation('/inquiry')
        if (user?.DoBrokerSettlementWithStakeholder==='yes'){
            setShowSettlementModal(true)
        }else {
            toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
        }

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
            <ConfirmModal visible={showSettlementModal} onCancel={cancelModalHandler} onOk={onOkSettlementModalHandler} title={'تسویه با ذینفع'} text={'آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <ConfirmModal visible={showBlockModal} onCancel={cancelModalHandler} onOk={onOkBlockModalHandler} title={'مسدودی وجه'} text={'آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <ConfirmModal visible={showLoanModal} onCancel={cancelModalHandler} onOk={onOkLoanModalHandler} title={'برداشت از سرفصل'} text={'آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>

            <Row gutter={[{lg:16},48]}>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} label={'نام شرکت کارگزار'} value={settlementInfo?.brokerName} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} label={'نوع بازار'} value={settlementInfo?.faMarketType} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} label={'تاریخ'} value={settlementInfo?.settlementDate} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} label={'شماره حساب'} value={settlementInfo?.brokerAccount} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} suffix={'ريال'} label={'میزان بدهی روز'} value={settlementInfo?.brokerDebt?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} suffix={'ريال'} label={'موجودی قابل برداشت'} value={settlementInfo?.brokerAvailableBalance?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} suffix={'ريال'} label={'موجودی مسدود شده'} value={settlementInfo?.brokerBlockedAmount?.toLocaleString()} readOnly/>
                </Col>
                <Col lg={8} xl={7} xxl={5}>
                    <CustomTextInput type={'text'} suffix={'ريال'} label={'مبلغ قابل تخصیص از سرفصل بدهکاران'} value={settlementInfo?.brokerLoan?.toLocaleString()} readOnly/>
                </Col>
            </Row>
            <Row gutter={[{lg:16},48]} style={{marginTop:'2rem'}}>
                <Col lg={5} xl={4} xxl={3}>
                    <CustomButton type={'primary'} size={'large'}
                                  title={loadingButton ? <Spin /> : 'مسدودی موجودی'} onClick={blockAccountHandler}/>
                </Col>
                <Col lg={5} xl={4} xxl={3}>
                    <CustomButton type={'primary'} size={'large'}
                                  title={loadingButton ? <Spin /> : 'برداشت از سرفصل'} onClick={needLoanHandler}
                                  // disabled={settlementInfo?.needLoan === 'No' || moneyTransferStatus === 'Successful'}
                    />
                </Col>
            </Row>
            <Row gutter={24} justify={'end'} className={'footer-buttons'}>
                <Col lg={4} xl={4} xxl={3}>
                    <CustomButton type={'primary'} size={'large'} title={'انصراف'} onClick={cancelStakeholderSettlementHandler}/>
                </Col>
                <Col lg={4} xl={4} xxl={3}>
                    <CustomButton type={'primary'} size={'large'} title={loadingButton ? <Spin /> : 'تسویه با ذینفع'} onClick={stakeholderSettlementHandler}/>
                </Col>
            </Row>
        </div>

    )
}

export default StakeholderSettlement