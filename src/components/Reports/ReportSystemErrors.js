import React, {useEffect, useState} from "react";
import {Col, Row, Select, Table} from "antd";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import CustomButton from "../Fields/CustomButton";
import CSV from "../../assets/images/csv.svg";
import Excel from "../../assets/images/excel.svg";
import {getSystemErrors} from "../../redux/slices/report";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {currentDate, currentDateTime, yesterdayDate} from "../../services/helper";
import PDF from "../../assets/images/pdf.svg";
import request from "../../services/request";
import {BrokerSettlementBaseUrl, GetExternalApiErrorReport, GetNotificationReport} from "../../services/constants";
import printJS from "print-js";

const ReportSystemErrors = () =>{

    const [errorInfo,setErrorInfo]=useState({
        fromDateStr: yesterdayDate,
        toDateStr: currentDate,
    })
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: false
    });
    const [loading, setLoading] = useState(false)

    const systemErrorsList = useSelector(state=>state.reports.systemErrors)

    const dispatch = useDispatch()

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = systemErrorsList?.response?.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
        },
        {
            title: 'عنوان',
            dataIndex: 'methodName',
            width:400
        },
        {
            title: 'پیغام',
            dataIndex: 'exceptionMessage',
            width:600
        },
        {
            title: 'تاریخ',
            dataIndex: 'errorDateStr',
            render: (text, record, index) => {
                return <div style={{direction:'ltr'}}>{text}</div>
            },
        }
    ];


    useEffect(() => {
        setLoading(true)
        const data = {
            request: {
                ...errorInfo,
                // fromDateStr: userInfo.fromDateStr.includes(' 00:00:00') ? userInfo.fromDateStr : userInfo.fromDateStr + ' 00:00:00',
                // toDateStr: userInfo.toDateStr.includes(' 00:00:00') ? userInfo.toDateStr : userInfo.toDateStr + ' 00:00:00',
                // fromDateStr: null,
                // toDateStr: null,
                // fromTimeStr: null,
                // toTimeStr: null,
            },
            pageNumber: pagination.current - 1,
            take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getSystemErrors(data)).then(res => {
                setPagination({...pagination, total: res.payload.totalRecords})
                setLoading(false)
            })
        }, 500)
    }, [pagination.current])


    const notifyFromDate = () => toast.error('تاریخ شروع بازه نمی تواند بزرگتر از پایان بازه باشد');
    const notifyToDate = () => toast.error('تاریخ پایان بازه نمی تواند کوچکتر از شروع بازه باشد')

    const userInfoDateChangeHandler = (date)=>{
        if (dayjs(date).isBefore(dayjs(errorInfo.toDateStr))|| dayjs(date).isSame(dayjs(errorInfo.toDateStr))){
            setErrorInfo({...errorInfo, fromDateStr: date})
        }else{
            notifyFromDate()
        }
    }

    const userInfoToDateChangeHandler = (date)=>{
        if (dayjs(date).isAfter(dayjs(errorInfo.fromDateStr))|| dayjs(date).isSame(dayjs(errorInfo.fromDateStr))){
            setErrorInfo({...errorInfo, toDateStr: date})
        }else{
            notifyToDate()
        }
    }


    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination)
    }


    const downloadCSV = ()=>{
        // if (userInfo.userName) {
        //     dispatch(getSamatInquiriesDocument({body:userInfo,param:'csv',name:'گزارش فعالیت کاربران'}))
        // }else {
        //     return message.error({
        //         content: 'انتخاب نام کاربری ضروری است',
        //         className: 'custom-message-error',
        //         style: {
        //             marginTop: '6%',
        //         },
        //         duration: 3
        //     })
        // }
    }

    const downloadExcel = ()=>{
        // if (userInfo.userName) {
        //     dispatch(getSamatInquiriesDocument({body:userInfo,param:'xlsx',name:'گزارش فعالیت کاربران'}))
        // }else {
        //     return message.error({
        //         content: 'انتخاب نام کاربری ضروری است',
        //         className: 'custom-message-error',
        //         style: {
        //             marginTop: '6%',
        //         },
        //         duration: 3
        //     })
        // }
    }

    const getUserActivityReports = ()=>{
        setLoading(true)
        const data = {
            request: {
                ...errorInfo,
            },
            pageNumber: pagination.current - 1,
            take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getSystemErrors(data)).then(res => {
                setPagination({...pagination,current: 1, total: res.payload.totalRecords})
                setLoading(false)
            })
        }, 500)
    }

    const printPdf = () => {
        const data = {
            request: {
                ...errorInfo,
            },
        }
        request.post(GetExternalApiErrorReport, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            printJS({
                printable: res?.data?.response,
                // properties: ['fullName', 'personnelCode', 'userSystemIP', 'activityDateTime', 'actionFaName'],
                properties: [
                    {field: 'methodName', displayName: 'عنوان'},
                    {field: 'exceptionMessage', displayName: 'پیغام'},
                    {field: 'errorDateStr', displayName: 'تاریخ'},
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
                        <div style="text-align: center;margin-bottom: 1rem;direction: rtl;font-weight: bold">گزارش خطاهای سیستمی</div>
                        <div style="display: flex;justify-content: space-around;align-items: center;flex-wrap: wrap;margin-bottom: 1rem;">                        
                        <div style="text-align: center;">از تاریخ: ${errorInfo.fromDateStr}</div>
                        <div style="text-align: center;">تا تاریخ: ${errorInfo.toDateStr}</div>
                        </div>  
            `

            })
        })
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
                    <span className={'time-picker-label'}>از تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={errorInfo?.fromDateStr ? dayjs(errorInfo?.fromDateStr, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => userInfoDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'fromDateStr'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تا تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={errorInfo?.toDateStr ? dayjs(errorInfo?.toDateStr, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => userInfoToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'toDateStr'}
                    />
                </Col>
                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'گزارش جامع'} onClick={getUserActivityReports} />
                </Col>
            </Row>
            <Table columns={columns} dataSource={systemErrorsList?.response} loading={loading}
                   onChange={handleTableChange}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'brokerId'}
                   pagination={pagination}
            />
            <h4>تعداد قابل نمایش: {5}</h4>
        </div>
    )
}

export default ReportSystemErrors