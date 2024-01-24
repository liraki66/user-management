import {Space, Table, Tooltip, Row, Col, Select, Empty, message, Spin} from 'antd';
import Request from "../../services/request";
import React, {useEffect, useState} from "react";
import {BrokerSettlementBaseUrl, GetMarketList} from "../../services/constants";
import axios from "axios";
import './index.scss'
import Samat from '../../assets/images/Samat.svg'
import Bank from '../../assets/images/bank.svg'
import StakeholderSettlementLogo from '../../assets/images/stakeholder-settlement.svg'
import BankDebtorsSettlementLogo from '../../assets/images/bank-debtor-settlement.svg'
import BankSettlementLogo from '../../assets/images/bank-settlement.svg'
import {Link, useLocation, useParams} from "react-router-dom";
import List from "../../assets/images/list.svg";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import CustomButton from "../Fields/CustomButton";
import {useNavigate} from 'react-router-dom'
import {useDispatch, useSelector} from "react-redux";
import {getInquiry, getMarketsList} from "../../redux/slices/broker-settlement";
import {currentDate, currentDateTime} from "../../services/helper";
import {ToastContainer} from "react-toastify";
import CustomSelect from "../Fields/CustomSelect";
import {getBrokersList} from "../../redux/slices/broker";
import {getBranchesListWithPagination} from "../../redux/slices/branches";

const {Option} = Select


const Inquiry = (props) => {

    // const [inquiry,setInquiry]=useState({inquiryDateFa:  new dayjs().locale('fa').format('YYYY/MM/DD'), marketType: ""})
    const [inquiry, setInquiry] = useState({inquiryDateFa: currentDateTime, marketType: "",brokerName:null,brokerCode:null})
    const [filter, setFilter] = useState({inquiryDateFa: currentDateTime, marketType: "",brokerName:null,brokerCode:null})
    const [pagination, setPagination] = useState({ pageSize: 6, position: ['bottomCenter'], current: 1,total:0,showSizeChanger:false});
    const [selectedMarketType, setSelectedMarketType] = useState('')
    const [selectedMarketTypeId, setSelectedMarketTypeId] = useState(null)
    const [loading, setLoading] = useState(false)

    const inquiryList = useSelector(state => state.brokerSettlement.inquiryList)
    const marketList = useSelector(state => state.brokerSettlement.marketsList)
    const brokersList = useSelector(state => state.brokers.brokersList)
    // const loading = useSelector(state=>state.brokerSettlement.loading)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {id} = useParams()

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = inquiryList.indexOf(record)
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
            title: 'میزان بدهی روز (ریال)',
            dataIndex: 'amount',
            // sorter: (a, b) => a.brokerDebt - b.brokerDebt,
            render: (text, record, index) => {
                return text.toLocaleString()
            }
        },
        {
            title: 'تاریخ استعلام',
            dataIndex: 'shamsiInquiryDate',
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            }
        },
        {
            title: 'تسویه اتوماتیک',
            dataIndex: ['automaticSettlement', 'propertyName'],
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
            render: (text, record, index) => {
                if (record.automaticSettlementStatus === 'موفق' || record.automaticSettlementStatus === 'Successful') {
                    return <div className={'auto-settlement-successful'}>{record.automaticSettlementStatus}</div>
                } else {
                    return <div
                        className={'auto-settlement-unsuccessful'}>{record.automaticSettlementStatus}</div>
                }
            }
        },
        {
            title: 'تسویه دستی',
            render: (text, record, index) => {
                if (record.automaticSettlementStatus === 'موفق' || record.automaticSettlementStatus === 'Successful') {
                    return (
                        <Space size="middle">
                            <Tooltip title="تسویه با سرفصل"><Link
                                to={`/inquiry/settlement/bank-debtors-settlement/${record.contractId}`}><img
                                className={'settlement-icons'} src={BankDebtorsSettlementLogo} alt={'تسویه با سرفصل'}
                                style={{cursor: 'pointer'}}/></Link></Tooltip>
                            <Tooltip title="تسویه با بانک"><Link
                                to={`/inquiry/settlement/bank-settlement/${record.contractId}`}><img
                                className={'settlement-icons'} src={BankSettlementLogo} alt={'تسویه با بانک'}
                                style={{cursor: 'pointer'}}/></Link></Tooltip>
                        </Space>
                    )
                } else {
                    return (
                        <Space size="middle">
                            <Tooltip title="تسویه با ذینفع"><Link
                                to={`/inquiry/settlement/stakeholder-settlement/${record.contractId}`}><img
                                className={'settlement-icons'} src={StakeholderSettlementLogo} alt={'تسویه با ذینفع'}
                                style={{cursor: 'pointer'}}/></Link></Tooltip>
                            <Tooltip title="تسویه با سرفصل"><Link
                                to={`/inquiry/settlement/bank-debtors-settlement/${record.contractId}`}><img
                                className={'settlement-icons'} src={BankDebtorsSettlementLogo} alt={'تسویه با سرفصل'}
                                style={{cursor: 'pointer'}}/></Link></Tooltip>
                            <Tooltip title="تسویه با بانک"><Link
                                to={`/inquiry/settlement/bank-settlement/${record.contractId}`}><img
                                className={'settlement-icons'} src={BankSettlementLogo} alt={'تسویه با بانک'}
                                style={{cursor: 'pointer'}}/></Link></Tooltip>
                        </Space>
                    )
                }
            },
        },
    ];

    useEffect(() => {
        dispatch(getMarketsList()).then(res=>{
            if (id) {
                const marketItem = res.payload.filter(item=>item.id == id)
                setSelectedMarketTypeId(id)
                setSelectedMarketType(marketItem[0].marketFaName)
                setInquiry({...inquiry,marketType: marketItem[0].marketName})
            }

        })
        dispatch(getBrokersList({}))
    }, [])

    // useEffect(()=>{
    //     if (inquiry.marketType) {
    //         setTimeout(() => {
    //             dispatch(getInquiry(inquiry)).finally(() => {
    //                 setLoading(false)
    //             })
    //         }, 500)
    //     }
    // },[inquiry.marketType])


    const onChange = (data, filters, sorter, extra) => {
        setPagination({...pagination,current: data.current})
    };

    const onChangeMarketHandler = (market) => {
        let newMarketSelected = marketList.find(item => item.marketFaName === market)
        setSelectedMarketType(market)
        setInquiry({...inquiry, marketType: newMarketSelected.marketName})
    }

    const inquiryDateChangeHandler = (d, date) => {
        setInquiry({...inquiry, inquiryDateFa: date})
    }

    const onChangeBrokerNameCodeHandler = (value,name) => {
        if (value) {
            let newBroker = name==='brokerName' ? brokersList.find(item => item.name === value) : brokersList.find(item => item.code === value)
            let selectedBrokerCode = newBroker?.code
            let selectedBrokerName = newBroker?.name
            setInquiry({
                ...inquiry,
                brokerCode: selectedBrokerCode,
                brokerName: selectedBrokerName
            })
        }else {
            setInquiry({
                ...inquiry,
                brokerCode: '',
                brokerName: ''
            })
        }
    };

    useEffect(() => {
        inquiry.inquiryDateFa = inquiry.inquiryDateFa.includes(' 00:00:00') ? inquiry.inquiryDateFa : inquiry.inquiryDateFa + ' 00:00:00'
        setLoading(true)

        setTimeout(()=>{
            dispatch(getInquiry(inquiry)).then(res=>{
                setPagination({...pagination,total : res.payload.totalRecords})
                setLoading(false)
            })
        },500)

    }, [pagination.current])

    const getInquiryHandler = () => {
        inquiry.inquiryDateFa = inquiry.inquiryDateFa.includes(' 00:00:00') ? inquiry.inquiryDateFa : inquiry.inquiryDateFa + ' 00:00:00'
        setLoading(true)
        if (selectedMarketType) {
            setTimeout(() => {
                dispatch(getInquiry(inquiry)).then(res=>{
                    setPagination({...pagination,current: 1, total: res.payload.totalRecords})
                    setLoading(false)
                    if (res.payload.totalRecords===0){
                        message.error({
                            content: 'موردی یافت نشد',
                            className: 'custom-message-error',
                            style: {
                                marginTop: '6%',
                            },
                            duration: 3
                        })
                    }
                })
            }, 500)
        } else {
            setLoading(false)
            message.error({
                content: 'نوع بازار را انتخاب کنید',
                className: 'custom-message-error',
                style: {
                    marginTop: '6%',
                },
                duration: 3
            })
        }
    }


    // if (loading) {
    //     return (
    //         <div className={'spinner-container'}>
    //             <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'}/>
    //         </div>
    //     )
    // }

    const disabledDate = (current) => {
        return current && current > Date.now()
    };


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
            <Row gutter={[24,24]} style={{marginBottom: '3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerName'} label={'نام شرکت کارگزار'}
                                  onChange={onChangeBrokerNameCodeHandler} value={inquiry?.brokerName}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id:'bid',name:''},...brokersList]?.map(item => <Option value={item.name}
                                                                                  key={item.id}>{item.name}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerCode'} label={'کد کارگزاری'}
                                  onChange={onChangeBrokerNameCodeHandler} value={inquiry?.brokerCode}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id:'bid',code:''},...brokersList]?.map(item => <Option value={item.code}
                                                                                  key={item.id}>{item.code}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>نوع بازار</span>
                    <Select
                        value={selectedMarketType}
                        showSearch
                        placeholder=""
                        onChange={onChangeMarketHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {marketList?.map(item => <Option value={item.marketFaName}
                                                         key={item.marketName}>{item.marketFaName}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={inquiry?.inquiryDateFa ? dayjs(inquiry.inquiryDateFa, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        disabledDate={disabledDate}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => inquiryDateChangeHandler(date, dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'fromDate'}
                        inputReadOnly={true}
                    />
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={'اخذ استعلام'}
                                  onClick={getInquiryHandler}/>
                </Col>
            </Row>
            {
                !loading ? <>
                        <Table columns={columns} dataSource={inquiryList} onChange={onChange} loading={loading}
                               locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'contractId'} pagination={pagination}
                               scroll={{x: 'max-content'}}
                        />
                        <h4>تعداد قابل نمایش: {4}</h4>
                    </> :
                    <div className={'spinner-container'}>
                        <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'}/>
                    </div>
            }
        </div>
    )
}

export default Inquiry