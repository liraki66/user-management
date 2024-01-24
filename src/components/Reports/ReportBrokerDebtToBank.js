import {Col, Empty, message, Row, Select, Spin, Table} from "antd";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import List from "../../assets/images/list.svg";
import {currentDate, currentDateTime, getBrokerList, getMarketType, yesterdayDate} from "../../services/helper";
import axios from "axios";
import {
    BrokerSettlementBaseUrl,
    GetManualSettlementWithBankDebtorsReport,
    GetTransferBrokerToBankAccount
} from "../../services/constants";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import dayjs from 'dayjs'
import {useDispatch, useSelector} from "react-redux";
import {getBrokersList} from "../../redux/slices/broker";
import {getMarketsList} from "../../redux/slices/broker-settlement";
import {
    clearReports, getSamatInquiriesDocument,
    getSamatWithdrawalsFromBankDebtors,
    getTransferBrokerToBankAccount, getTransferBrokerToBankAccountDocument
} from "../../redux/slices/report";
import CSV from "../../assets/images/csv.svg";
import Excel from "../../assets/images/excel.svg";
import {toast, ToastContainer} from "react-toastify";
import CustomSelect from "../Fields/CustomSelect";
import PDF from "../../assets/images/pdf.svg";
import request from "../../services/request";
import printJS from "print-js";

const ReportBrokerDebtToBank = (props) => {

    const [brokerInfo, setBrokerInfo] = useState({
        brokerName: '',
        brokerCode: '',
        marketType: '',
        marketFaType:'',
        settlementFromDate: "",
        // settlementFromDate: yesterdayDate,
        // settlementToDate: currentDate,
        settlementToDate: "",
        withdrawalFromDate: yesterdayDate,
        // withdrawalFromDate: yesterdayDate,
        withdrawalToDate: currentDate
    })
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 4,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: false
    });

    const reportList = useSelector(state => state.reports.transferBrokerToBankAccount)
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
        // {
        //     title: 'نوع بازار',
        //     dataIndex: 'marketType',
        // },
        {
            title: 'شماره قرارداد',
            dataIndex: 'contractId',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
            // sorter: (a, b) => a.ContractId - b.ContractId,
        },
        {
            title: 'تاریخ تسهیلات',
            dataIndex: 'withdrawalDate',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
        },
        {
            title: 'شماره تسهیلات',
            dataIndex: 'loanNumber',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
        },
        {
            title: 'مبلغ تسهیلات(ریال)',
            dataIndex: 'loanAmount',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{Number(text).toLocaleString()}</div>
            },
            // sorter: (a, b) => a.depositeBalanceAmount - b.depositeBalanceAmount,
        },
        {
            title: 'شماره پیگیری',
            dataIndex: 'trackId',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{record.trackId ? text : <div>-</div>}</div>
            },
            // sorter: (a, b) => a.trackId - b.trackId,
        },
        // {
        //     title: 'مبلغ سود(ریال)',
        //     dataIndex: 'interestAmount',
        //     render: (text, record, index) => {
        //         return <div style={{direction: 'ltr'}}>{Number(text).toLocaleString()}</div>
        //     },
        //     // sorter: (a, b) => a.depositeBalanceAmount - b.depositeBalanceAmount,
        // },
        {
            title: 'تاریخ تسویه',
            dataIndex: 'settlementDate',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{record.settlementDate ? text : <div>-</div>}</div>
            },
        },
        {
            title: 'مبلغ تسویه شده(ریال)',
            dataIndex: 'refundedAmount',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{Number(text).toLocaleString()}</div>
            },
        },
        {
            title: 'وضعیت',
            dataIndex: 'status',
            render: (text, record, index) => {
                if (text === "تسویه شده") {
                    return <div className={'auto-settlement-successful'}>تسویه شده</div>
                } else {
                    return <div className={'auto-settlement-unsuccessful'}>{text}</div>
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
                    settlementFromDate: brokerInfo.settlementFromDate,
                    settlementToDate: brokerInfo.settlementToDate,
                    withdrawalFromDate: brokerInfo.withdrawalFromDate,
                    withdrawalToDate: brokerInfo.withdrawalToDate,
                },
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getTransferBrokerToBankAccount(data)).then(res => {
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

    const brokerInfoDateChangeHandler = (date) => {
        if (brokerInfo.settlementToDate){
            if (dayjs(date).isBefore(dayjs(brokerInfo.settlementToDate))|| dayjs(date).isSame(dayjs(brokerInfo.settlementToDate))){
                setBrokerInfo({...brokerInfo, settlementFromDate: date})
            }else{
                notifyFromDate()
            }
        }else {
            setBrokerInfo({...brokerInfo, settlementFromDate: date})
        }
    }

    const brokerInfoToDateChangeHandler = (date) => {
        if (brokerInfo.settlementFromDate) {
            if (dayjs(date).isAfter(dayjs(brokerInfo.settlementFromDate))|| dayjs(date).isSame(dayjs(brokerInfo.settlementFromDate))) {
                setBrokerInfo({...brokerInfo, settlementToDate: date})
            } else {
                notifyToDate()
            }
        }else {
            setBrokerInfo({...brokerInfo, settlementToDate: date})
        }
    }

    const brokerInfoWithdrawalDateChangeHandler = (date) => {
        if (dayjs(date).isBefore(dayjs(brokerInfo.withdrawalToDate))){
            setBrokerInfo({...brokerInfo, withdrawalFromDate: date})
        }else{
            notifyFromDate()
        }
    }

    const brokerInfoWithdrawalToDateChangeHandler = (date) => {
        if (dayjs(date).isAfter(dayjs(brokerInfo.withdrawalFromDate))){
            setBrokerInfo({...brokerInfo, withdrawalToDate: date})
        }else{
            notifyToDate()
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

    const getBrokerDebtToBankReports = () => {
        if (brokerInfo.marketType) {
            setLoading(true)
            const data = {
                request: {
                    ...brokerInfo,
                    settlementFromDate: brokerInfo.settlementFromDate,
                    settlementToDate: brokerInfo.settlementToDate,
                    withdrawalFromDate: brokerInfo.withdrawalFromDate,
                    withdrawalToDate: brokerInfo.withdrawalToDate,
                },
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getTransferBrokerToBankAccount(data)).then(res => {
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

    const downloadCSV = () => {
        if (brokerInfo.marketType) {
            dispatch(getTransferBrokerToBankAccountDocument({
                body: {
                    ...brokerInfo,
                    settlementFromDate: brokerInfo.settlementFromDate,
                    settlementToDate: brokerInfo.settlementToDate,
                    withdrawalFromDate: brokerInfo.withdrawalFromDate,
                    withdrawalToDate: brokerInfo.withdrawalToDate,
                },
                param: 'csv', name: 'گزارش بدهی های شرکت های کارگزاری به بانک'
            }))
        } else {
            notifyMarket()
        }
    }

    const downloadExcel = () => {
        if (brokerInfo.marketType) {
            dispatch(getTransferBrokerToBankAccountDocument({
                body: {
                    ...brokerInfo,
                    settlementFromDate: brokerInfo.settlementFromDate,
                    settlementToDate: brokerInfo.settlementToDate,
                    withdrawalFromDate: brokerInfo.withdrawalFromDate,
                    withdrawalToDate: brokerInfo.withdrawalToDate,
                },
                param: 'xlsx', name: 'گزارش بدهی های شرکت های کارگزاری به بانک'
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
            request.post(GetTransferBrokerToBankAccount, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
                printJS({
                    printable: res?.data?.response,
                    // properties: ['fullName', 'personnelCode', 'userSystemIP', 'activityDateTime', 'actionFaName'],
                    properties: [
                        {field: 'brokerName', displayName: 'نام شرکت کارگزار'},
                        {field: 'brokerCode', displayName: 'کد کارگزاری'},
                        {field: 'contractId', displayName: 'شماره قرارداد'},
                        {field: 'withdrawalDate', displayName: 'تاریخ تسهیلات'},
                        {field: 'loanAmount', displayName: 'مبلغ تسهیلات(ریال)'},
                        {field: 'TrackId', displayName: 'شماره پیگیری'},
                        {field: 'SettlementDate', displayName: 'تاریخ تسویه'},
                        {field: 'refundedAmount', displayName: 'مبلغ تسویه شده'},
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
                        <div style="text-align: center;margin-bottom: 1rem;direction: rtl;font-weight: bold">گزارش بدهی های شرکت های کارگزاری به بانک</div>
                        <div style="display: flex;justify-content: flex-start;align-items: center;flex-wrap: wrap;margin-bottom: 1rem;direction: rtl;text-align: right">
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">نام شرکت کارگزار: ${brokerInfo.brokerName}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">کد کارگزاری: ${brokerInfo.brokerCode}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">نوع بازار: ${brokerInfo.marketFaType}</div >
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">تاریخ تسهیلات از: ${brokerInfo.withdrawalFromDate}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">تاریخ تسهیلات تا: ${brokerInfo.withdrawalToDate}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">تاریخ تسویه از: ${brokerInfo.settlementFromDate}</div>
                        <div style="text-align: center;margin-left: 2rem;min-width: 10%">تاریخ تسویه تا: ${brokerInfo.settlementToDate}</div>
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
            <div className={'download-report-icon'}>
                <img style={{marginLeft: '15px', cursor: 'pointer'}} src={PDF} onClick={printPdf}/>
                <img style={{marginLeft: '15px', cursor: 'pointer'}} src={CSV} onClick={downloadCSV}/>
                <img style={{cursor: 'pointer'}} src={Excel} onClick={downloadExcel}/>
            </div>
            <Row gutter={[24, 24]} style={{marginBottom: '3rem'}}>
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
                    <span className={'time-picker-label'}>تاریخ تسهیلات از</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.withdrawalFromDate ? dayjs(brokerInfo?.withdrawalFromDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoWithdrawalDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'withdrawalFromDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تاریخ تسهیلات تا</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.withdrawalToDate ? dayjs(brokerInfo?.withdrawalToDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoWithdrawalToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'withdrawalToDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تاریخ تسویه از</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.settlementFromDate ? dayjs(brokerInfo?.settlementFromDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'settlementFromDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تاریخ تسویه تا</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={brokerInfo?.settlementToDate ? dayjs(brokerInfo?.settlementToDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'settlementToDate'}
                    />
                </Col>

                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'گزارش جامع'} onClick={getBrokerDebtToBankReports}/>
                </Col>
            </Row>
            <Table columns={columns} dataSource={reportList?.response} loading={loading}
                   onChange={handleTableChange}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'withdrawalDate'}
                   pagination={pagination}
                   scroll={{x: 'max-content'}}
            />
            <h4>تعداد قابل نمایش: {4}</h4>
        </div>
    )
}

export default ReportBrokerDebtToBank