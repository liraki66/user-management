import {Col, Empty, message, Row, Select, Spin, Table} from "antd";
import CustomTextInput from "../../Fields/CustomTextInput";
import CustomButton from "../../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import List from "../../../assets/images/list.svg";
import {DatePicker as DatePickerJalali, Calendar, JalaliLocaleListener} from "antd-jalali";
import 'moment/locale/fa';
import locale from 'antd/es/date-picker/locale/fa_IR';
import DateLogo from '../../../assets/images/date.svg'
import axios from "axios";
import {BrokerSettlementBaseUrl, GetSamatInquiries} from "../../../services/constants";
import {getBrokerList, getMarketType} from "../../../services/helper";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {getBrokersList} from "../../../redux/slices/broker";
import {getMarketsList} from "../../../redux/slices/broker-settlement";
import CustomTimePicker from "../../Fields/CustomTimePicker";
import CSV from "../../../assets/images/csv.svg";
import Excel from "../../../assets/images/excel.svg";
import {getSamatInquiriesDocument} from "../../../redux/slices/report";

const statusList = [{id:0,value:'موفق'},{id:1,value:'ناموفق'}]

const ReportBrokerAccount = (props) => {

    const [brokerInfo, setBrokerInfo] = useState({brokerName: '', brokerCode: '', marketType: '', fromDate: ''})
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 4,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: false
    });

    const marketsList = useSelector(state=>state.brokerSettlement.marketsList)
    const brokersList = useSelector(state=>state.brokers.brokersList)

    const dispatch = useDispatch()

    const {Option} = Select

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {

                ///////////// to be fixed data //////////////
                const newIndex = data.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
        },
        {
            title: 'نام شرکت کارگزار',
            dataIndex: 'brokerName',
        },
        {
            title: 'کد کارگزاری',
            dataIndex: 'brokerCode',
        },
        {
            title: 'نوع بازار',
            dataIndex: 'marketType',
        },
        {
            title: 'تاریخ',
            dataIndex: 'dateTime',
            render: (text, record, index) => {
                return <div style={{direction:'ltr'}}>{text}</div>
            },
        },
        {
            title: 'ساعت',
            dataIndex: 'marketType',
        },
        {
            title: 'نوع تسویه',
            dataIndex: 'marketType',
        },
        {
            title: 'مبلغ بدهی(ریال)',
            dataIndex: 'amount',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{Number(text).toLocaleString()}</div>
            },
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
        },
        {
            title: 'شماره سند بنکو',
            dataIndex: 'paymentIdentity',
        },
        {
            title: 'شماره تراکنش',
            dataIndex: 'paymentIdentity',
        },
        {
            title: 'وضعیت',
            dataIndex: 'status',
            render: (text, record, index) => {
                if (text === "موفق") {
                    return <div className={'auto-settlement-successful'}>موفق</div>
                } else {
                    return <div className={'auto-settlement-unsuccessful'}>ناموفق</div>
                }
            },
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
        },
    ];

    useEffect(() => {
        dispatch(getBrokersList())
        dispatch(getMarketsList())
    }, [])

    const brokerInfoChangeHandler = (market) => {
        setBrokerInfo({...brokerInfo, marketType: market})
    }

    const brokerInfoDateChangeHandler = (date) => {
        setBrokerInfo({...brokerInfo, fromDate: date})
    }

    const onChangeBrokerNameHandler = (value) => {
        let selectedBroker = brokersList.find(item => item.id === value)
        let selectedBrokerCode = ''
        let selectedBrokerName = ''
        selectedBrokerCode = selectedBroker.code
        selectedBrokerName = selectedBroker.name
        setBrokerInfo({...brokerInfo, brokerCode: selectedBrokerCode, brokerName: selectedBrokerName})
    };

    const onChangeBrokerCodeHandler = (value) => {
        let selectedBroker = brokersList.find(item => item.code === value)
        let selectedBrokerName = ''
        selectedBrokerName = selectedBroker.name
        setBrokerInfo({...brokerInfo, brokerCode: value, brokerName: selectedBrokerName})
    };

    const fetchReportsList = (pagination)=>{
        axios.post(GetSamatInquiries, {
            request: {...brokerInfo,fromDate:brokerInfo.fromDate ? brokerInfo.fromDate+' 00:00:00' :null },
            pageNumber: pagination.current - 1,
            take: pagination.pageSize
        }, {baseURL: 'http://banking.brokersettlement-development.com'})
            .then(res => {
                if (res.data.response.length < 1) {
                }
                setData(res.data.response)
                setPagination({...pagination, total: res.data.totalRecords
                })
            })
            .catch(e => {
                message.error({
                    content: e.response.data.FaErrorMessage ? e.response.data.FaErrorMessage : 'پر کردن تمام فیلدها ضروری است',
                    className: 'custom-message-error',
                    style: {
                        marginTop: '6%',
                    },
                    duration: 3
                })
            })
            .finally(() => {
                // setBrokerInfo({brokerName: '', brokerCode: '', marketType: '', fromDate: ''})
                setTimeout(()=>{
                },500)
            })
    }

    const getSamatInquiryReports = () => {
        fetchReportsList(pagination)
    }

    const handleTableChange = (newPagination, filters, sorter)=>{
        fetchReportsList(newPagination)
    }

    const downloadCSV = ()=>{
        if (brokerInfo.marketType) {
            dispatch(getSamatInquiriesDocument({body:brokerInfo,param:'csv',name:'تراکنش های برداشت از سپرده کارگزاری'}))
        }else {
            return message.error({
                content: 'انتخاب نام کاربری ضروری است',
                className: 'custom-message-error',
                style: {
                    marginTop: '6%',
                },
                duration: 3
            })
        }
    }

    const downloadExcel = ()=>{
        if (brokerInfo.marketType) {
            dispatch(getSamatInquiriesDocument({body:brokerInfo,param:'xlsx',name:'تراکنش های برداشت از سپرده کارگزاری'}))
        }else {
            return message.error({
                content: 'انتخاب نام کاربری ضروری است',
                className: 'custom-message-error',
                style: {
                    marginTop: '6%',
                },
                duration: 3
            })
        }
    }



    return (
        <div className={'inquiry-content-container'}>
            <div className={'download-report-icon'}>
                <img style={{marginLeft:'15px',cursor:'pointer'}} src={CSV} onClick={downloadCSV} />
                <img style={{cursor:'pointer'}} src={Excel} onClick={downloadExcel}  />
            </div>
            <Row gutter={[24,24]} style={{marginBottom: '3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>نام شرکت کارگزار</span>
                    <Select
                        value={brokerInfo?.brokerName}
                        showSearch
                        placeholder=""
                        onChange={onChangeBrokerNameHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {brokersList?.map(item => <Option value={item.id}
                                                          key={item.id}>{item.name}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>کد کارگزاری</span>
                    <Select
                        value={brokerInfo?.brokerCode}
                        showSearch
                        placeholder=""
                        onChange={onChangeBrokerCodeHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {brokersList?.map(item => <Option value={item.code}
                                                          key={item.code}>{item.code}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>نوع بازار</span>
                    <Select
                        value={brokerInfo?.marketType}
                        showSearch
                        placeholder=""
                        onChange={brokerInfoChangeHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {marketsList?.map(item => <Option value={item.marketName}
                                                          key={item?.marketName}>{item?.marketFaName}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.fromDate ? dayjs(brokerInfo?.fromDate,{jalali:true}): ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'fromDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>{'ساعت'}</span>
                    <CustomTimePicker
                        // onSelect={selectTimeHandler}
                        // open={isOpenTimePicker.minInquiryHour}
                        name={'minInquiryHour'}
                        // value={contractInfo?.minInquiryHour ? moment(contractInfo?.minInquiryHour, "HH:mm") : null}
                        // onFocus={timePickerShowOnFocusHandler}
                        // onBlur={timePickerShowOnBlurHandler}
                        // renderExtraFooter={fromPickerFooterHandler}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>نوع تسویه</span>
                    <Select
                        value={brokerInfo?.brokerName}
                        showSearch
                        placeholder=""
                        onChange={onChangeBrokerNameHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {statusList?.map(item => <Option value={item.id}
                                                         key={item.id}>{item.value}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} suffix={'ريال'} label={'مبلغ بدهی'} value={''} />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'شماره سند بنکو'} value={''} />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'شماره تراکنش'} value={''} />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>وضعیت</span>
                    <Select
                        value={brokerInfo?.brokerName}
                        showSearch
                        placeholder=""
                        onChange={onChangeBrokerNameHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {statusList?.map(item => <Option value={item.id}
                                                         key={item.id}>{item.value}</Option>)}
                    </Select>
                </Col>
                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'گزارش جامع'} onClick={getSamatInquiryReports}/>
                </Col>
            </Row>
            <Table columns={columns} dataSource={[]} loading={loading}
                   onChange={handleTableChange}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'brokerId'}
                   pagination={pagination}
            />
            <h4>تعداد قابل نمایش: {4}</h4>
        </div>
    )
}

export default ReportBrokerAccount