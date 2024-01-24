import {Col, Row, Form, Spin, message, Table, Space, Tooltip} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import './index.scss'
import CustomButton from "../Fields/CustomButton";
import CancelTerminate from '../../assets/images/cancel-terminate.svg'
import Terminate from '../../assets/images/terminate.svg'
import GiveLoan from '../../assets/images/give-loan.svg'
import LoanSettlement from '../../assets/images/loan-settlement.svg'
import MessageTick from '../../assets/images/message-tick.svg'
import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getBrokerSettlementInfoWithBank} from "../../redux/slices/broker-settlement";
import {cancelTerminateContract} from "../../redux/slices/contract";
import {toast, ToastContainer} from "react-toastify";
import ConfirmModal from "../General/ConfirmModal";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";

const BankSettlement = (props) => {

    const [filter, setFilter] = useState({contractId: 0, loanNumber: "", withdrawalDateFa: ""})
    const [loading, setLoading] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [pagination, setPagination] = useState({pageSize: 4, position: ['bottomCenter'], showSizeChanger: false});
    const [showModal, setShowModal] = useState(false)

    const bankInfo = useSelector(state => state.brokerSettlement.bankSettlementInfo.brokerSettlementInfosWithBankDto)
    const user = useSelector(state=>state.auth.decodedUserInfo )

    const {contractId, marketType} = useParams()
    const navigation = useNavigate()
    const dispatch = useDispatch()

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = bankInfo.indexOf(record)
                return <div>{newIndex + 1}</div>
            },
            width: 100
        },
        {
            title: 'نام کارگزاری',
            dataIndex: 'brokerName',
        },
        {
            title: 'کد کارگزاری',
            dataIndex: 'brokerCode',
        },
        {
            title: 'نوع بازار',
            dataIndex: 'marketFaName',
        },
        {
            title: 'روزهای بدهی معوقه',
            dataIndex: 'numberOfDebtDays',
        },
        {
            title: 'شماره تسهیلات',
            dataIndex: 'loanNumber',
            render: (text, record, index) => {
                return record.loanNumber ? record.loanNumber : '-'
            }
        },
        {
            title: 'میزان اصل بدهی(ریال)',
            dataIndex: 'loanAmount',
            // sorter: (a, b) => a.brokerDebt - b.brokerDebt,
            render: (text, record, index) => {
                return text.toLocaleString()
            }
        },
        {
            title: 'مبلغ جریمه(ریال)',
            dataIndex: 'penaltyAmount',
            // sorter: (a, b) => a.brokerDebt - b.brokerDebt,
            render: (text, record, index) => {
                return text.toLocaleString()
            }
        },
        {
            title: 'درصد سود + جریمه',
            dataIndex: 'penaltyPercentage',
        },
        {
            title: 'تاریخ اعطای تسهیلات',
            dataIndex: 'faLoanDate',
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            }
        },
        {
            title: 'وضعیت تسویه تسهیلات',
            dataIndex: 'settlementStatus',
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
        },
        {
            title: 'پیام ارسال شده',
            dataIndex: 'isNotificationSend',
            render: (text, record, index) => {
                if (record.isNotificationSend) {
                    return (
                        <Space size="middle">
                            <img src={MessageTick} alt={'message'}/>
                        </Space>
                    )
                } else {
                    return (
                        <Space size="middle">
                            -
                        </Space>
                    )
                }
            },
        },
        {
            render: (text, record, index) => {
                return (
                    <Space size="middle">
                        {/*<Tooltip title="اعطای تسهیلات"><Link*/}
                        {/*    to={`/inquiry/settlement/bank-settlement/give-loan/${record.loanId}`}><img src={GiveLoan}*/}
                        {/*                                                                               className={'settlement-icons'}*/}
                        {/*                                                                               alt={'بانک'}*/}
                        {/*                                                                               style={{cursor: 'pointer'}}/></Link></Tooltip>*/}
                        <Tooltip title="تسویه تسهیلات"><Link
                            to={`/inquiry/settlement/bank-settlement/loan-settlement/${record.loanId}`}
                            state={{record}}><img src={LoanSettlement} className={'settlement-icons'} alt={'بانک'}
                                                  style={{cursor: 'pointer'}}/></Link></Tooltip>
                        <Tooltip title="درخواست فسخ"><Link
                            to={`/contracts/edit-contract/terminate/${record.contractId}/${record.loanId}`}><img
                            src={Terminate} className={'terminate-icons'} alt={'سمات'}
                            style={{cursor: 'pointer'}}/></Link></Tooltip>
                        <Tooltip title="لغو فسخ"><img src={CancelTerminate} onClick={cancelTerminationHandler}
                                                      className={'terminate-icons'} alt={'بانک'}
                                                      style={{cursor: 'pointer'}}/></Tooltip>
                    </Space>
                )
            },
        },
    ];


    const cancelModalHandler = () => {
        setShowModal(false)
    }

    const onOkModalHandler = () => {
        setConfirmLoading(true)
        dispatch(cancelTerminateContract({contractId})).then(res=>{
            setConfirmLoading(false)
            setShowModal(false)
        })
    }

    const cancelTerminationHandler = () => {
        // dispatch(cancelTerminateContract({contractId}))
        if (user?.CancelContractTermination==='yes'){
            setShowModal(true)
        }else {
            toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
        }
    }

    const changeLoanNumberHandler = (e) => {
      setFilter({...filter,loanNumber: e.target.value})
    }

    const dateChangeHandler = (date)=>{
        setFilter({...filter, withdrawalDateFa : date})
    }

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            dispatch(getBrokerSettlementInfoWithBank({
                contractId: contractId
            })).then(res => {
                setLoading(false)
            })
        }, 500)

    }, [])

    const onSearchHandler = ()=>{
        setLoading(true)
        setTimeout(() => {
            dispatch(getBrokerSettlementInfoWithBank({
                ...filter,contractId: contractId
            })).then(res => {
                setLoading(false)
            })
        }, 500)
    }

    if (loading) {
        return (
            <div className={'spinner-container'}>
                <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'}/>
            </div>
        )
    }

    return (
        <div className={'inquiry-content-container'}>
            <ToastContainer style={{fontFamily: 'IRANSans'}}
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
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'لغو فسخ'}
                          text={'قرارداد لغو فسخ می شود. آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <Row gutter={[{lg: 16}, 24]} style={{marginBottom: '3rem'}}>
                {/*<Col  lg={8} xl={7} xxl={4}>*/}
                {/*    <CustomTextInput type={'text'} label={'نام شرکت کارگزار'} value={bankInfo?.brokerName} readOnly/>*/}
                {/*</Col>*/}
                {/*<Col  lg={8} xl={7} xxl={4}>*/}
                {/*    <CustomTextInput type={'text'} label={'کد کارگزاری'} value={bankInfo?.brokerName} readOnly/>*/}
                {/*</Col>*/}
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'شماره تسهیلات'} value={filter?.loanNumber} onChange={changeLoanNumberHandler} />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تاریخ اعطای تسهیلات</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={filter?.withdrawalDateFa ? dayjs(filter?.withdrawalDateFa,{jalali:true}): ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => dateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'fromDate'}
                    />
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={'جست و جو'} onClick={onSearchHandler}/>
                </Col>
            </Row>
            <Table columns={columns} dataSource={bankInfo} loading={false}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'id'} pagination={pagination}
                   scroll={{x: 'max-content'}}
            />
            <h4>تعداد قابل نمایش: {4}</h4>
        </div>
    )
}

export default BankSettlement