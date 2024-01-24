// import { Col, Row, Spin, message, Tooltip} from "antd";
// import CustomTextInput from "../Fields/CustomTextInput";
// import {useParams, useNavigate} from "react-router-dom";
// import CustomButton from "../Fields/CustomButton";
// import {useEffect, useState} from "react";
// import axios from "axios";
// import {
//     BrokerSettlementBaseUrl,
//     DoBrokerSettlementWithSamat,
//     GetBrokerSettlementWithSamatInfo,
//     GiveLoanToBroker
// } from "../../services/constants";
// import Samat from '../../assets/images/Samat.svg'
// import SamatDisabled from '../../assets/images/samat_disable.svg'
//
//
// const SamatSettlement = (props) => {
//
//     const [loadingData, setLoadingData] = useState(false)
//     const [loadingButton, setLoadingButton] = useState(false)
//     const [loadingSettlement, setLoadingSettlement] = useState(false)
//     const [data, setData] = useState(null)
//     const [settlementStatus,setSettlementStatus] = useState('')
//     const [moneyTransferStatus,setMoneyTransferStatus] = useState('')
//     const [loanStatus,setLoanStatus] = useState('')
//     const {brokerId, marketType} = useParams()
//     const navigation = useNavigate()
//
//     useEffect(() => {
//         if (!data) {
//             fetchSamatSettlementInfo()
//         }
//
//     }, [])
//
//     const fetchSamatSettlementInfo = ()=>{
//         setLoadingData(true)
//         axios.post(GetBrokerSettlementWithSamatInfo, {brokerId,marketType}, {baseURL: BrokerSettlementBaseUrl})
//             .then(res => {
//                 setLoadingData(false)
//                 setData(res.data)
//             })
//             .catch(e => {
//                 message.error({
//                     content: e.response.data.FaErrorMessage,
//                     className: 'custom-message-error',
//                     style: {
//                         marginTop: '6%',
//                     },
//                     duration: 3
//                 })
//             })
//             .finally(() => setLoadingData(false))
//     }
//
//     const needLoanHandler = ()=>{
//         setLoadingButton(true)
//         axios.post(GiveLoanToBroker, {brokerId,marketType}, {baseURL: BrokerSettlementBaseUrl})
//             .then(res => {
//                 setLoadingButton(false)
//                 setMoneyTransferStatus(res?.data?.moneyTransferStatus)
//                 fetchSamatSettlementInfo()
//                 message.success({
//                     content: 'اعطای تسهیلات با موفقیت انجام شد',
//                     className: 'custom-message-success',
//                     style: {
//                         marginTop: '6%',
//                     },
//                     duration: 3
//                 })
//             })
//             .catch(e => {
//                 console.log('e', e)
//                 message.error({
//                     content: e.response.data.FaErrorMessage,
//                     className: 'custom-message-error',
//                     style: {
//                         marginTop: '6%',
//                     },
//                     duration: 3
//                 })
//             })
//             .finally(() => setLoadingButton(false))
//     }
//
//     const brokerSettlementWithSamatHandler = ()=>{
//         setLoadingSettlement(true)
//         axios.post(DoBrokerSettlementWithSamat, {brokerId,marketType}, {baseURL: BrokerSettlementBaseUrl})
//             .then(res => {
//                 setLoadingSettlement(false)
//                 setSettlementStatus(res?.data?.settlementStatus)
//                 message.success({
//                     content: 'تسویه با سمات با موفقیت انجام شد',
//                     className: 'custom-message-success',
//                     style: {
//                         marginTop: '6%',
//                     },
//                     duration: 3
//                 })
//                 navigation(`/inquiry/settlement/bank-settlement/${brokerId}/${marketType}`)
//             })
//             .catch(e => {
//                 message.error({
//                     content: e.response.data.FaErrorMessage,
//                     className: 'custom-message-error',
//                     style: {
//                         marginTop: '6%',
//                     },
//                     duration: 3
//                 })
//             })
//             .finally(() => setLoadingSettlement(false))
//     }
//
//     if (loadingData) {
//         return(
//             <div className={'spinner-container'}>
//                 <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'} />
//             </div>
//         )
//     }
//
//     return (
//         <div className={'inquiry-content-container'}>
//             <Row gutter={24}>
//                 <Col lg={5}>
//                     <CustomTextInput type={'text'} label={'نام کارگزاری'} value={data?.brokerName} readOnly/>
//                 </Col>
//                 <Col lg={5}>
//                     <CustomTextInput type={'text'} label={'نوع بازار'} value={data?.faMarketType} readOnly/>
//                 </Col>
//                 <Col lg={5}>
//                     <CustomTextInput type={'text'} label={'تاریخ'} value={data?.settlementDate} readOnly/>
//                 </Col>
//             </Row>
//             <Row gutter={24} style={{marginTop:'3rem'}}>
//                 <Col lg={5}>
//                     <CustomTextInput type={'text'} label={'میزان بدهی روز (ریال)'} value={data?.samatBrokerDebt?.toLocaleString()} readOnly/>
//                 </Col>
//                 <Col lg={5}>
//                     <CustomTextInput type={'text'} label={'موجودی سپرده + مبلغ مسدود شده'} value={data?.brokerBalance?.toLocaleString()} readOnly/>
//                 </Col>
//                 <Col lg={5}>
//                     <CustomTextInput type={'text'} label={'مبلغ تخصیص شده از سرفصل بدهکاران'} value={data?.brokerLoan?.toLocaleString()} readOnly/>
//                 </Col>
//                 <Col lg={5}>
//                     <CustomButton type={'primary'} size={'large'}
//                                   title={loadingButton ? <Spin /> : 'اعطای وام 18 درصد'} onClick={needLoanHandler}
//                                   disabled={data?.needLoan === 'No' || moneyTransferStatus === 'Successful'} />
//                 </Col>
//                 <Col lg={4}>
//                     {((data?.needLoan === 'No' && !loadingSettlement) || (moneyTransferStatus === 'Successful' && !loadingSettlement)) ?
//                         <Tooltip title="تسویه با سمات"><img src={Samat} style={{cursor:'pointer'}} onClick={brokerSettlementWithSamatHandler}/></Tooltip>
//                         : <Tooltip title="تسویه با سمات"><img src={SamatDisabled} style={{cursor:'not-allowed'}}/>
//                             {loadingSettlement ? <Spin/> : null}</Tooltip>}
//                 </Col>
//             </Row>
//         </div>
//     )
// }
//
// export default SamatSettlement