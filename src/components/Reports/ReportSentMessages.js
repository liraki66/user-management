import React, {useEffect, useState} from "react";
import {Col, Empty, Row, Select, Table} from "antd";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import CustomButton from "../Fields/CustomButton";
import CSV from "../../assets/images/csv.svg";
import Excel from "../../assets/images/excel.svg";
import {
    getManualSettlementWithBankDebtors,
    getNotificationReportDocument,
    getSentMessages,
    getSystemErrors
} from "../../redux/slices/report";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {currentDate, currentDateTime, yesterdayDate, yesterdayDateTime} from "../../services/helper";
import CustomSelect from "../Fields/CustomSelect";
import {getUsersList} from "../../redux/slices/user";
import PDF from "../../assets/images/pdf.svg";
import request from "../../services/request";
import {BrokerSettlementBaseUrl, GetNotificationReport, GetUserActivityReport} from "../../services/constants";
import printJS from "print-js";


const {Option}=Select


const ReportSentMessages = () =>{

    const [reportInfo,setReportInfo]=useState({
        userId:null,
        fromDate: yesterdayDate,
        toDate: currentDate,
    })
    const [username,setUsername]=useState('')

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: false
    });
    const [loading, setLoading] = useState(false)

    const sentMessagesList = useSelector(state=>state.reports.sentMessages)
    const users = useSelector(state=>state.users.usersList)

    const dispatch = useDispatch()

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = sentMessagesList?.response?.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
        },
        {
            title: 'نام کاربری',
            dataIndex: 'username',
            width:300
        },
        {
            title: 'پیغام',
            dataIndex: 'message',
            width:700
        },
        {
            title: 'تاریخ',
            dataIndex: 'datetime',
            render: (text, record, index) => {
                return <div style={{direction:'ltr'}}>{text}</div>
            },
            width:300
        }
    ];

    useEffect(()=>{
        dispatch(getUsersList({}))
    },[])


    useEffect(() => {
            setLoading(true)
            const data = {
                request: {
                    ...reportInfo,
                },
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getSentMessages(data)).then(res => {
                    setPagination({...pagination, total: res.payload.totalRecords})
                    setLoading(false)
                })
            }, 500)

    }, [pagination.current])


    const getSentMessagesReports = () => {
            setLoading(true)
            const data = {
                request: {...reportInfo},
                pageNumber: pagination.current - 1,
                take: pagination.pageSize
            }
            setTimeout(() => {
                dispatch(getSentMessages(data)).then(res => {
                    setPagination({...pagination,current: 1, total: res.payload.totalRecords})
                    setLoading(false)
                })
            }, 500)
    }


    const notifyFromDate = () => toast.error('تاریخ شروع بازه نمی تواند بزرگتر از پایان بازه باشد');
    const notifyToDate = () => toast.error('تاریخ پایان بازه نمی تواند کوچکتر از شروع بازه باشد')

    const userInfoDateChangeHandler = (date)=>{
        if (dayjs(date).isBefore(dayjs(reportInfo.toDate))|| dayjs(date).isSame(dayjs(reportInfo.toDate))){
            setReportInfo({...reportInfo, fromDate: date})
        }else{
            notifyFromDate()
        }
    }

    const userInfoToDateChangeHandler = (date)=>{
        if (dayjs(date).isAfter(dayjs(reportInfo.fromDate))|| dayjs(date).isSame(dayjs(reportInfo.toDate))){
            setReportInfo({...reportInfo, toDate: date})
        }else{
            notifyToDate()
        }
    }


    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination)
    }

    const onChangeUserNameHandler = (fullName)=>{
        if (fullName){
            const selectedUser = users.find(user=>fullName.includes(user.name)) || users.find(user=>fullName.includes(user.family))
            setReportInfo({...reportInfo,userId:selectedUser.id})
            setUsername(fullName)
        }else{
            setReportInfo({...reportInfo,userId:null})
            setUsername('')
        }
    }


    const downloadCSV = ()=>{
        // if (userInfo.userName) {
            dispatch(getNotificationReportDocument({body:reportInfo,param:'csv',name:'گزارش پیامک های ارسال شده'}))
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
        dispatch(getNotificationReportDocument({body:reportInfo,param:'xlsx',name:'گزارش پیامک های ارسال شده'}))
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

    const printPdf = () => {
        const data = {
            request: {
                ...reportInfo,
            },
        }
        request.post(GetNotificationReport, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            printJS({
                printable: res?.data?.response,
                // properties: ['fullName', 'personnelCode', 'userSystemIP', 'activityDateTime', 'actionFaName'],
                properties: [
                    {field: 'username', displayName: 'نام کاربری '},
                    {field: 'message', displayName: 'پیغام'},
                    {field: 'datetime', displayName: 'تاریخ'},
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
                        <div style="text-align: center;margin-bottom: 1rem;direction: rtl;font-weight: bold">گزارش پیامک های ارسال شده</div>
                        <div style="display: flex;justify-content: space-around;align-items: center;flex-wrap: wrap;margin-bottom: 1rem;">
                        <div style="text-align: center;">نام کاربر: ${username}</div>
                        <div style="text-align: center;">از تاریخ: ${reportInfo.fromDate}</div>
                        <div style="text-align: center;">تا تاریخ: ${reportInfo.toDate}</div>
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
                    <CustomSelect name={'userName'} label={'نام کاربری'}
                                  onChange={onChangeUserNameHandler} value={username}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id:'uid',name:'',family:''},...users]?.map(item => <Option value={item.name ? item.name+' '+item.family : ''}
                                                                                      key={item.id}>{item.name ? item.name+' '+item.family : ''}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>از تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={reportInfo?.fromDate ? dayjs(reportInfo?.fromDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => userInfoDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'fromDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>تا تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={reportInfo?.toDate ? dayjs(reportInfo?.toDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => userInfoToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'toDate'}
                    />
                </Col>
                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'گزارش جامع'} onClick={getSentMessagesReports} />
                </Col>
            </Row>
            <Table columns={columns} dataSource={sentMessagesList?.response} loading={loading}
                   onChange={handleTableChange}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'brokerId'}
                   pagination={pagination}
            />
            <h4>تعداد قابل نمایش: {5}</h4>
        </div>
    )
}

export default ReportSentMessages