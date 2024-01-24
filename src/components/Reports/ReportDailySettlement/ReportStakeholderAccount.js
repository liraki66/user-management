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
import {
    BrokerSettlementBaseUrl,
    GetDailyBrokerSettlementReport,
    GetSamatInquiries,
    GetUserActivityReport
} from "../../../services/constants";
import {currentDateTime, getBrokerList, getMarketType, yesterdayDateTime} from "../../../services/helper";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {getBrokersList} from "../../../redux/slices/broker";
import {getMarketsList} from "../../../redux/slices/broker-settlement";
import CustomTimePicker from "../../Fields/CustomTimePicker";
import {
    clearReports,
    getDailyStakeholder, getDailyStakeholderDocument,
    getSamatInquiriesDocument, getSamatWithdrawalsFromBankDebtors, getSamatWithdrawalsFromBankDebtorsDocument,
    getTransferBrokerToBankAccount
} from "../../../redux/slices/report";
import CSV from "../../../assets/images/csv.svg";
import Excel from "../../../assets/images/excel.svg";
import CustomSelect from "../../Fields/CustomSelect";
import {toast} from "react-toastify";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import PDF from "../../../assets/images/pdf.svg";
import request from "../../../services/request";
import printJS from "print-js";

const statusList = [{id:1,value:'Successful',title:'موفق'},{id:2,value:'Unsuccessful',title:'ناموفق'}]

dayjs.extend(isSameOrAfter)

const ReportStakeholderAccount = (props) => {

    const [brokerInfo, setBrokerInfo] = useState(
        {
            brokerName: '',
            brokerCode: '',
            marketType: '',
            fromDate: yesterdayDateTime,
            toDate:currentDateTime,
            trackerId:'',
            status:null
        })
    const [status, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 4,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: false
    });

    const reportList = useSelector(state => state.reports.dailyStakeholder)
    const marketsList = useSelector(state => state.brokerSettlement.marketsList)
    const brokersList = useSelector(state => state.brokers.brokersList)

    const dispatch = useDispatch()

    const {Option} = Select

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = reportList?.response?.indexOf(record)
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
        // {
        //     title: 'از تاریخ',
        //     dataIndex: 'fromDate',
        //     render: (text, record, index) => {
        //         return <div style={{direction:'ltr'}}>{text}</div>
        //     },
        // },
        {
            title: 'تاریخ',
            dataIndex: 'dateTime',
            render: (text, record, index) => {
                return <div style={{direction:'ltr'}}>{text}</div>
            },
        },
        // {
        //     title: 'تا تاریخ',
        //     dataIndex: 'toDate',
        //     render: (text, record, index) => {
        //         return <div style={{direction:'ltr'}}>{text}</div>
        //     },
        // },
        // {
        //     title: 'ساعت',
        //     dataIndex: 'marketType',
        // },
        {
            title: 'مبلغ(ریال)',
            dataIndex: 'amount',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{Number(text).toLocaleString()}</div>
            },
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
        },
        {
            title: 'شماره سند بنکو',
            dataIndex: 'bankoDocumentNumber',
        },
        {
            title: 'شماره تراکنش',
            dataIndex: 'trackerId',
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
        dispatch(getBrokersList({}))
        dispatch(getMarketsList({}))

        return () => {
            dispatch(clearReports())
        }
    }, [])

    useEffect(() => {
        if (brokerInfo.marketType) {
            setLoading(true)
            const data = {
                request: {
                    ...brokerInfo,
                    status: brokerInfo.status==='موفق' ? 'Successful' : brokerInfo.status==='ناموفق' ? 'Unsuccessful' : null
                },
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getDailyStakeholder(data)).then(res => {
                    setPagination({...pagination, total: res.payload.totalRecords})
                    setLoading(false)
                })
            }, 500)
        }
    }, [pagination.current])

    const brokerInfoChangeHandler = (market) => {
        if (market){
            const selectedMarket = marketsList.find(item=>item.marketFaName===market)
            setBrokerInfo({...brokerInfo, marketFaType: market,marketType: selectedMarket.marketName})
        }else{
            setBrokerInfo({...brokerInfo, marketFaType: '',marketType: ''})
        }
    }

    const notifyFromDate = () => toast.error('تاریخ شروع بازه نمی تواند بزرگتر از پایان بازه باشد');
    const notifyToDate = () => toast.error('تاریخ پایان بازه نمی تواند کوچکتر از شروع بازه باشد');

    const brokerInfoFromDateChangeHandler = (date) => {
        if (brokerInfo.toDate){
            if (dayjs(date).isBefore(dayjs(brokerInfo.toDate)) || dayjs(date).isSame(dayjs(brokerInfo.toDate))){
                setBrokerInfo({...brokerInfo, fromDate: date+" 00:00:00"})
            }else{
                notifyFromDate()
            }
        }else {
            setBrokerInfo({...brokerInfo, fromDate: date+" 00:00:00"})
        }
    }

    const brokerInfoToDateChangeHandler = (date) => {
        if (brokerInfo.fromDate){
            if (dayjs(date).isAfter(dayjs(brokerInfo.fromDate))|| dayjs(date).isSame(dayjs(brokerInfo.fromDate))){
                setBrokerInfo({...brokerInfo, toDate: date+" 00:00:00"})
            }else{
                notifyToDate()
            }
        }else {
            setBrokerInfo({...brokerInfo, toDate: date+" 00:00:00"})
        }
    }

    const onChangeBrokerNameCodeHandler = (value,name) => {
        if (value) {
            let newBroker = name==='brokerName' ? brokersList.find(item => item.name === value) : brokersList.find(item => item.code === value)
            let selectedBrokerCode = newBroker?.code
            let selectedBrokerName = newBroker?.name
            setBrokerInfo({
                ...brokerInfo,
                brokerCode: selectedBrokerCode,
                brokerName: selectedBrokerName
            })
        }else {
            setBrokerInfo({
                ...brokerInfo,
                brokerCode: '',
                brokerName: ''
            })
        }
    };

    const notifyMarket = () => toast.error('انتخاب نوع بازار ضروری است');

    const getDailyStakeholderReports = () => {
        if (brokerInfo.marketType) {
            setLoading(true)
            const data = {
                request: {...brokerInfo,
                    fromDate: brokerInfo.fromDate,
                    toDate: brokerInfo.toDate,
                    status: brokerInfo.status==='موفق' ? 'Successful' : brokerInfo.status==='ناموفق' ? 'Unsuccessful' : null
                },
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getDailyStakeholder(data)).then(res => {
                    setPagination({...pagination,current: 1, total: res.payload.totalRecords})
                    setLoading(false)
                })
            }, 500)
        } else {
            notifyMarket()
        }
    }

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination)
    }

    const trackerIdChangeHandler = (e)=>{
        setBrokerInfo({...brokerInfo,trackerId: e.target.value})
    }

    const changeStatusHandler = (value)=>{
        if (value){
            setBrokerInfo({...brokerInfo,status: value})
        }else {
            setBrokerInfo({...brokerInfo,status: null})
        }
    }

    const downloadCSV = () => {
        if (brokerInfo.marketType) {
            dispatch(getDailyStakeholderDocument({
                body: {...brokerInfo,
                    fromDate: brokerInfo.fromDate,
                    toDate: brokerInfo.toDate,
                    status: brokerInfo.status==='موفق' ? 'Successful' : brokerInfo.status==='ناموفق' ? 'Unsuccessful' : null
                },
                param: 'csv',
                name: 'گزارش تراکنش های واریز به سپرده ذینفع'
            }))
        } else {
            notifyMarket()
        }
    }

    const downloadExcel = () => {
        if (brokerInfo.marketType) {
            dispatch(getDailyStakeholderDocument({
                body: {...brokerInfo,
                    fromDate: brokerInfo.fromDate,
                    toDate: brokerInfo.toDate,
                    status: brokerInfo.status==='موفق' ? 'Successful' : brokerInfo.status==='ناموفق' ? 'Unsuccessful' : null
                },
                param: 'xlsx',
                name: 'گزارش تراکنش های واریز به سپرده ذینفع'
            }))
        } else {
            notifyMarket()
        }
    }

    const printPdf = () => {
        if (brokerInfo.marketType) {
            const data = {
                request: {
                    ...brokerInfo,
                },
            }
            request.post(GetDailyBrokerSettlementReport, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
                printJS({
                    printable: res?.data?.response,
                    // properties: ['fullName', 'personnelCode', 'userSystemIP', 'activityDateTime', 'actionFaName'],
                    properties: [
                        {field: 'brokerName', displayName: 'نام شرکت کارگزار'},
                        {field: 'brokerCode', displayName: 'کد کارگزاری'},
                        {field: 'marketType', displayName: 'نوع بازار'},
                        {field: 'dateTime', displayName: 'تاریخ'},
                        {field: 'amount', displayName: 'مبلغ(ریال)'},
                        {field: 'trackerId', displayName: 'شماره تراکنش'},
                        {field: 'status', displayName: 'وضعیت'},

                    ],
                    type: 'json',
                    gridStyle: `
                    font-family:B Nazanin;
                         border: 1px solid #3971A5;
                         text-align: center;
                         font-size: 14px;
             `,
                    gridHeaderStyle:
                        `
                    -webkit-print-color-adjust: exact;
                    font-family:'B Nazanin';
                    border: 1px solid #000;
                    background-color: cornflowerblue;
            `,
                    style: `
                    @media print {
                         @page
                            {
                                size: auto;   /* auto is the initial value */
                                margin: 8mm;  /* this affects the margin in the printer settings */
                                
                            }
                    }
                    *{direction: rtl;font-family:B Nazanin, B Zar;}`,
                    header: `
                        <div style="text-align: center;margin-bottom: 1rem;direction: rtl;font-weight: bold">گزارش تسویه های روزانه بدهی شرکت کارگزاری</div>
                        <div style="display: flex;justify-content: flex-start;align-items: center;flex-wrap: wrap;margin-bottom: 1rem;direction: rtl;text-align: right">
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">نام شرکت کارگزار: ${brokerInfo.brokerName}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">کد کارگزاری: ${brokerInfo.brokerCode}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">نوع بازار: ${brokerInfo.marketFaType}</div >
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">از تاریخ: ${brokerInfo.fromDate.replace('00:00:00','')}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">تا تاریخ: ${brokerInfo.toDate.replace('00:00:00','')}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">شماره تراکنش: ${brokerInfo.trackerId}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">وضعیت: ${brokerInfo.status==='Successful'?'موفق' :brokerInfo.status==='Unsuccessful'?'ناموفق':''}</div>
                        </div>  
            `
                })
            })
        } else {
            notifyMarket()
        }
    }


    return (
        <div className={'inquiry-content-container'}>
            <div className={'download-report-icon'}>
                <img style={{marginLeft: '15px', cursor: 'pointer'}} src={PDF} onClick={printPdf}/>
                <img style={{marginLeft:'15px',cursor:'pointer'}} src={CSV} onClick={downloadCSV} />
                <img style={{cursor:'pointer'}} src={Excel} onClick={downloadExcel}  />
            </div>
            <Row gutter={[24,24]} style={{marginBottom: '3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerName'} label={'نام شرکت کارگزار'}
                                  onChange={onChangeBrokerNameCodeHandler} value={brokerInfo?.brokerName}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id:'bid',name:''},...brokersList]?.map(item => <Option value={item.name}
                                                                                  key={item.id}>{item.name}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerCode'} label={'کد کارگزاری'}
                                  onChange={onChangeBrokerNameCodeHandler} value={brokerInfo?.brokerCode}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id:'bid',code:''},...brokersList]?.map(item => <Option value={item.code}
                                                                                  key={item.id}>{item.code}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>نوع بازار</span>
                    <Select
                        value={brokerInfo?.marketFaType}
                        showSearch
                        placeholder=""
                        onChange={brokerInfoChangeHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {marketsList?.map(item => <Option value={item.marketFaName}
                                                          key={item?.marketName}>{item?.marketFaName}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>از تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.fromDate ? dayjs(brokerInfo?.fromDate,{jalali:true}): ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoFromDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'fromDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تا تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.toDate ? dayjs(brokerInfo?.toDate,{jalali:true}): ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'toDate'}
                    />
                </Col>
                {/*<Col lg={8} xl={7} xxl={4}>*/}
                {/*    <span className={'time-picker-label'}>{'ساعت'}</span>*/}
                {/*    <CustomTimePicker*/}
                {/*        // onSelect={selectTimeHandler}*/}
                {/*        // open={isOpenTimePicker.minInquiryHour}*/}
                {/*        name={'minInquiryHour'}*/}
                {/*        // value={contractInfo?.minInquiryHour ? moment(contractInfo?.minInquiryHour, "HH:mm") : null}*/}
                {/*        // onFocus={timePickerShowOnFocusHandler}*/}
                {/*        // onBlur={timePickerShowOnBlurHandler}*/}
                {/*        // renderExtraFooter={fromPickerFooterHandler}*/}
                {/*    />*/}
                {/*</Col>*/}
                {/*<Col lg={8} xl={7} xxl={4}>*/}
                {/*    <CustomTextInput type={'text'} suffix={'ريال'} label={'مبلغ'} value={''} />*/}
                {/*</Col>*/}
                {/*<Col lg={8} xl={7} xxl={4}>*/}
                {/*    <CustomTextInput type={'text'} label={'شماره سند بنکو'} value={''} />*/}
                {/*</Col>*/}
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} label={'شماره تراکنش'} value={brokerInfo?.trackerId} onChange={trackerIdChangeHandler} />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>وضعیت</span>
                    <Select
                        value={brokerInfo?.status}
                        showSearch
                        placeholder=""
                        onChange={changeStatusHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {[{id:0,value:null,title:''},...statusList]?.map(item => <Option value={item.title}
                                                          key={item.id}>{item.title}</Option>)}
                    </Select>
                </Col>
                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'گزارش جامع'} onClick={getDailyStakeholderReports}/>
                </Col>
            </Row>
            <Table columns={columns} dataSource={reportList?.response} loading={loading}
                   onChange={handleTableChange}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'trackerId'}
                   pagination={pagination}
                   scroll={{x: 'max-content'}}
            />
            <h4>تعداد قابل نمایش: {4}</h4>
        </div>
    )
}

export default ReportStakeholderAccount