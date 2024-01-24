import {Col, Empty, message, Row, Select, Spin, Table} from "antd";
import CustomButton from "../../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import List from "../../../assets/images/list.svg";
import {currentDate, currentDateTime, getBrokerList, getMarketType, yesterdayDate} from "../../../services/helper";
import axios from "axios";
import {BrokerSettlementBaseUrl, GetSamatInquiries, GetYaghoutInquiries} from "../../../services/constants";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../../assets/images/date.svg";
import dayjs from 'dayjs'
import {useDispatch, useSelector} from "react-redux";
import {getBrokersList} from "../../../redux/slices/broker";
import {getMarketsList} from "../../../redux/slices/broker-settlement";
import {
    clearReports,
    getSamatInquiries,
    getSamatInquiriesDocument,
    getYaghootInquiries, getYaghootInquiriesDocument
} from "../../../redux/slices/report";
import CSV from "../../../assets/images/csv.svg";
import Excel from "../../../assets/images/excel.svg";
import {toast, ToastContainer} from "react-toastify";
import CustomSelect from "../../Fields/CustomSelect";
import request from "../../../services/request";
import printJS from "print-js";
import PDF from "../../../assets/images/pdf.svg";

const ReportYaghootInquiry = (props) => {

    const [brokerInfo, setBrokerInfo] = useState({
        brokerName: '',
        brokerCode: '',
        marketType: '',
        marketFaType: '',
        fromDate: yesterdayDate,
        toDate: currentDate
    })
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: false
    });

    const reportList = useSelector(state => state.reports.yaghootInquiries)
    const marketsList = useSelector(state => state.brokerSettlement.marketsList)
    const brokersList = useSelector(state => state.brokers.brokersList)

    const dispatch = useDispatch()

    const {Option} = Select

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = reportList?.response?.indexOf(record)
                return <div>{((pagination.current - 1) * (pagination.pageSize)) + newIndex + 1}</div>
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
            title: 'تاریخ',
            dataIndex: 'dateTime',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
        },
        {
            title: 'نوع بازار',
            dataIndex: 'marketType',
        },
        {
            title: 'موجودی سپرده(ریال)',
            dataIndex: 'depositeBalanceAmount',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{Number(text).toLocaleString()}</div>
            },
            // sorter: (a, b) => a.depositeBalanceAmount - b.depositeBalanceAmount,
        },
        {
            title: 'شماره سپرده',
            dataIndex: 'depositeNumber',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
            // sorter: (a, b) => a.depositeNumber - b.depositeNumber,
        },
        {
            title: 'شماره پیگیری',
            dataIndex: 'trackerId',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
            // sorter: (a, b) => a.trackId - b.trackId,
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
            // sorter: (a, b) => a.status - b.status,
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
                    fromDate: brokerInfo.fromDate,
                    toDate: brokerInfo.toDate
                },
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getYaghootInquiries(data)).then(res => {
                    setPagination({...pagination, total: res.payload.totalRecords})
                    setLoading(false)
                })
            }, 500)
        }
    }, [pagination.current])

    const brokerInfoChangeHandler = (market) => {
        if (market) {
            const selectedMarket = marketsList.find(item => item.marketFaName === market)
            setBrokerInfo({...brokerInfo, marketFaType: market, marketType: selectedMarket.marketName})
        } else {
            setBrokerInfo({...brokerInfo, marketFaType: '', marketType: ''})
        }
    }

    const notifyFromDate = () => toast.error('تاریخ شروع بازه نمی تواند بزرگتر از پایان بازه باشد');
    const notifyToDate = () => toast.error('تاریخ پایان بازه نمی تواند کوچکتر از شروع بازه باشد');

    const brokerInfoDateChangeHandler = (date) => {
        if (dayjs(date).isBefore(dayjs(brokerInfo.toDate)) || dayjs(date).isSame(dayjs(brokerInfo.toDate))) {
            setBrokerInfo({...brokerInfo, fromDate: date})
        } else {
            notifyFromDate()
        }
    }

    const brokerInfoToDateChangeHandler = (date) => {
        if (dayjs(date).isAfter(dayjs(brokerInfo.fromDate)) || dayjs(date).isSame(dayjs(brokerInfo.fromDate))) {
            setBrokerInfo({...brokerInfo, toDate: date})
        } else {
            notifyToDate()
        }
    }

    const onChangeBrokerNameCodeHandler = (value, name) => {
        if (value) {
            let newBroker = name === 'brokerName' ? brokersList.find(item => item.name === value) : brokersList.find(item => item.code === value)
            let selectedBrokerCode = newBroker?.code
            let selectedBrokerName = newBroker?.name
            setBrokerInfo({
                ...brokerInfo,
                brokerCode: selectedBrokerCode,
                brokerName: selectedBrokerName
            })
        } else {
            setBrokerInfo({
                ...brokerInfo,
                brokerCode: '',
                brokerName: ''
            })
        }
    };

    const notifyMarket = () => toast.error('انتخاب نوع بازار ضروری است');

    const getYaghootInquiriesReports = () => {
        if (brokerInfo.marketType) {

            setLoading(true)
            const data = {
                request: {
                    ...brokerInfo,
                    fromDate: brokerInfo.fromDate,
                    toDate: brokerInfo.toDate
                },
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getYaghootInquiries(data)).then(res => {
                    setPagination({...pagination, current: 1, total: res.payload.totalRecords})
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

    const downloadCSV = () => {
        if (brokerInfo.marketType) {
            dispatch(getYaghootInquiriesDocument({
                body: {
                    ...brokerInfo,
                    fromDate: brokerInfo.fromDate,
                    toDate: brokerInfo.toDate
                },
                param: 'csv', name: 'گزارش استعلام های یاقوت'
            }))
        } else {
            notifyMarket()
        }
    }

    const downloadExcel = () => {
        if (brokerInfo.marketType) {
            dispatch(getYaghootInquiriesDocument({
                body: {
                    ...brokerInfo,
                    fromDate: brokerInfo.fromDate,
                    toDate: brokerInfo.toDate
                },
                param: 'xlsx', name: 'گزارش استعلام های یاقوت'
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
            request.post(GetYaghoutInquiries, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
                printJS({
                    printable: res?.data?.response,
                    // properties: ['fullName', 'personnelCode', 'userSystemIP', 'activityDateTime', 'actionFaName'],
                    properties: [
                        {field: 'brokerName', displayName: 'نام شرکت کارگزار'},
                        {field: 'brokerCode', displayName: 'کد کارگزاری'},
                        {field: 'dateTime', displayName: 'تاریخ'},
                        {field: 'marketType', displayName: 'نوع بازار'},
                        {field: 'depositeBalanceAmount', displayName: 'موجودی سپرده(ریال)'},
                        {field: 'depositeNumber', displayName: 'شماره سپرده'},
                        {field: 'trackerId', displayName: 'شماره پیگیری'},
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
                        <div style="text-align: center;margin-bottom: 1rem;direction: rtl;font-weight: bold">گزارش استعلام های یاقوت</div>
                        <div style="display: flex;justify-content: flex-start;align-items: center;flex-wrap: wrap;margin-bottom: 1rem;direction: rtl;text-align: right">
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">نام شرکت کارگزار: ${brokerInfo.brokerName}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">کد کارگزاری: ${brokerInfo.brokerCode}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">نوع بازار: ${brokerInfo.marketFaType}</div >
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">از تاریخ: ${brokerInfo.fromDate}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">تا تاریخ: ${brokerInfo.toDate}</div>
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
            <div className={'download-report-icon'}>
                <img style={{marginLeft: '15px', cursor: 'pointer'}} src={PDF} onClick={printPdf}/>
                <img style={{marginLeft: '15px', cursor: 'pointer'}} src={CSV} onClick={downloadCSV}/>
                <img style={{cursor: 'pointer'}} src={Excel} onClick={downloadExcel}/>
            </div>
            <Row gutter={[24,24]} style={{marginBottom: '3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerName'} label={'نام شرکت کارگزار'}
                                  onChange={onChangeBrokerNameCodeHandler} value={brokerInfo?.brokerName}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id: 'bid', name: ''}, ...brokersList]?.map(item => <Option value={item.name}
                                                                                      key={item.id}>{item.name}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerCode'} label={'کد کارگزاری'}
                                  onChange={onChangeBrokerNameCodeHandler} value={brokerInfo?.brokerCode}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id: 'bid', code: ''}, ...brokersList]?.map(item => <Option value={item.code}
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
                        value={brokerInfo?.fromDate ? dayjs(brokerInfo?.fromDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'fromDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تا تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.toDate ? dayjs(brokerInfo?.toDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'toDate'}
                    />
                </Col>
                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'گزارش جامع'} onClick={getYaghootInquiriesReports}/>
                </Col>
            </Row>
            <Table columns={columns} dataSource={reportList?.response} loading={loading}
                   onChange={handleTableChange}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'brokerId'}
                   pagination={pagination}
            />
            <h4>تعداد قابل نمایش: {5}</h4>
        </div>
    )
}

export default ReportYaghootInquiry