import React, {useEffect, useState} from "react";
import {Button, Col, Empty, message, Row, Select, Table} from "antd";
import List from "../../assets/images/list.svg";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import CustomButton from "../Fields/CustomButton";
import CustomTimePicker from "../Fields/CustomTimePicker";
import CSV from "../../assets/images/csv.svg";
import Excel from "../../assets/images/excel.svg";
import PDF from "../../assets/images/pdf.svg";
import {
    getSamatInquiriesDocument,
    getTransferBrokerToSamat,
    getUserActivity,
    getUserActivityDocument
} from "../../redux/slices/report";
import {useDispatch, useSelector} from "react-redux";
import {getUsersList} from "../../redux/slices/user";
import CustomTextInput from "../Fields/CustomTextInput";
import {toast} from "react-toastify";
import {currentDate, currentDateTime, yesterdayDate} from "../../services/helper";
import moment from "moment";
import CustomSelect from "../Fields/CustomSelect";
import printJS from 'print-js'
import {FilePdfOutlined} from "@ant-design/icons";
import request from "../../services/request";
import {BrokerSettlementBaseUrl, GetUserActivityReport} from "../../services/constants";

const {Option} = Select

const ReportUsersActivity = () => {

    const [userInfo, setUserInfo] = useState({
        userId: null,
        userName: '',
        personnelCode: "",
        userSystemIP: "",
        fromDateStr: yesterdayDate,
        toDateStr: currentDate,
        fromTimeStr: "",
        toTimeStr: ""
    })
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 0,
        position: ['bottomCenter'],
        showSizeChanger: false
    });
    const [loading, setLoading] = useState(false)
    const [isOpenTimePicker, setIsOpenTimePicker] = useState({
        fromTimeStr: false,
        toTimeStr: false,
    })

    const userActivityList = useSelector(state => state.reports.userActivity)
    const users = useSelector(state => state.users.usersList)

    const dispatch = useDispatch()

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = userActivityList?.response?.indexOf(record)
                return <div>{((pagination.current - 1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
        },
        {
            title: 'نام کاربری',
            dataIndex: 'fullName',
        },
        {
            title: 'IP دستگاه',
            dataIndex: 'userSystemIP',
        },
        {
            title: 'تاریخ',
            dataIndex: 'activityDateStr',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
        },
        {
            title: 'ساعت',
            dataIndex: 'activityHour',
        },
        {
            title: 'شرح فعالیت',
            dataIndex: 'actionFaName',
        },
    ];

    useEffect(() => {
        dispatch(getUsersList({}))
    }, [])

    useEffect(() => {
        setLoading(true)
        const data = {
            request: {
                ...userInfo,
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
            dispatch(getUserActivity(data)).then(res => {
                setPagination({...pagination, total: res.payload.totalRecords})
                setLoading(false)
            })
        }, 500)
    }, [pagination.current])

    const onChangeUserNameHandler = (fullName) => {
        if (fullName) {
            const selectedUser = users.find(user => fullName.includes(user.name)) || users.find(user => fullName.includes(user.family))
            setUserInfo({
                ...userInfo,
                userName: selectedUser.name + ' ' + selectedUser.family,
                userId: selectedUser.id,
                personnelCode: selectedUser.personnelCode
            })
        } else {
            setUserInfo({...userInfo, userName: '', userId: null, personnelCode: ''})
        }
    }

    const onchangePersonnelCodeHandler = (code) => {
        if (code) {
            const selectedUser = users.find(user => user.personnelCode === code)
            setUserInfo({
                ...userInfo,
                personnelCode: code,
                userName: selectedUser.name + ' ' + selectedUser.family,
                userId: selectedUser.id
            })
        } else {
            setUserInfo({...userInfo, personnelCode: '', userName: '', userId: ''})
        }

    }


    const changeSystemIP = (e) => {
        setUserInfo({...userInfo, userSystemIP: e.target.value})
    }

    const notifyFromDate = () => toast.error('تاریخ شروع بازه نمی تواند بزرگتر از پایان بازه باشد');
    const notifyToDate = () => toast.error('تاریخ پایان بازه نمی تواند کوچکتر از شروع بازه باشد')

    const userInfoDateChangeHandler = (date) => {
        if (dayjs(date).isBefore(dayjs(userInfo.toDateStr)) || dayjs(date).isSame(dayjs(userInfo.toDateStr))) {
            setUserInfo({...userInfo, fromDateStr: date})
        } else {
            notifyFromDate()
        }
    }

    const userInfoToDateChangeHandler = (date) => {
        if (dayjs(date).isAfter(dayjs(userInfo.fromDateStr)) || dayjs(date).isSame(dayjs(userInfo.fromTimeStr))) {
            setUserInfo({...userInfo, toDateStr: date})
        } else {
            notifyToDate()
        }
    }

    const selectTimeHandler = (time, name) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");
        setUserInfo({...userInfo, [name]: timeString})
    }

    const timePickerShowOnBlurHandler = (name) => {
        setIsOpenTimePicker({...isOpenTimePicker, [name]: false})
    }

    const timePickerShowOnFocusHandler = (name) => {
        setIsOpenTimePicker({...isOpenTimePicker, [name]: true})
    }

    const fromPickerFooterHandler = (name) => {
        return (
            <div style={{textAlign: 'center'}}>
                <Button type={'primary'} size={'small'}
                        onClick={() => setIsOpenTimePicker({...isOpenTimePicker, [name]: false})}>تایید</Button>
            </div>
        )
    }

    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination)
    }


    const downloadCSV = () => {
        dispatch(getUserActivityDocument({body: userInfo, param: 'csv', name: 'گزارش فعالیت کاربران'}))
        // if (userInfo.userName) {
        //     dispatch(getUserActivityDocument({body: userInfo, param: 'csv', name: 'گزارش فعالیت کاربران'}))
        // } else {
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

    const downloadExcel = () => {
        dispatch(getUserActivityDocument({body: userInfo, param: 'xlsx', name: 'گزارش فعالیت کاربران'}))
        // if (userInfo.userName) {
        //     dispatch(getUserActivityDocument({body: userInfo, param: 'xlsx', name: 'گزارش فعالیت کاربران'}))
        // } else {
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
                ...userInfo,
            },
        }
        request.post(GetUserActivityReport, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            printJS({
                printable: res?.data?.response,
                // properties: ['fullName', 'personnelCode', 'userSystemIP', 'activityDateTime', 'actionFaName'],
                properties: [
                    {field: 'fullName', displayName: 'نام کاربر '},
                    {field: 'personnelCode', displayName: 'کد پرسنلی'},
                    {field: 'userSystemIP', displayName: 'IP دستگاه'},
                    {field: 'activityDateStr', displayName: 'تاریخ'},
                    {field: 'activityHour', displayName: 'ساعت'},
                    {field: 'actionFaName', displayName: 'شرح فعالیت'},
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
                        <div style="text-align: center;margin-bottom: 1rem;direction: rtl;font-weight: bold">گزارش فعالیت کاربران</div>
                        <div style="display: flex;justify-content: space-around;align-items: center;flex-wrap: wrap;margin-bottom: 1rem;">
                        <div style="text-align: center;">نام کاربر: ${userInfo.userName}</div>
                        <div style="text-align: center;">کد پرسنلی: ${userInfo.personnelCode}</div>
                        <div style="text-align: center;">  ${userInfo.userSystemIP} IP دستگاه:</div >
                        <div style="text-align: center;">از تاریخ: ${userInfo.fromDateStr}</div>
                        <div style="text-align: center;">تا تاریخ: ${userInfo.toDateStr}</div>
                        <div style="text-align: center;">از ساعت: ${userInfo.fromTimeStr}</div>
                        <div style="text-align: center;"> تا ساعت: ${userInfo.toTimeStr}</div>
                        </div>  
                 
            `

            })
        })
    }

    const getUserActivityReports = () => {
        setLoading(true)
        const data = {
            request: {
                ...userInfo,
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
            dispatch(getUserActivity(data)).then(res => {
                setPagination({...pagination, current: 1, total: res.payload.totalRecords})
                setLoading(false)
            })
        }, 500)
    }


    return (
        <div className={'inquiry-content-container'}>
            <div className={'download-report-icon'}>
                <img style={{marginLeft: '15px', cursor: 'pointer'}} src={PDF} onClick={printPdf}/>
                <img style={{marginLeft: '15px', cursor: 'pointer'}} src={CSV} onClick={downloadCSV}/>
                <img style={{cursor: 'pointer'}} src={Excel} onClick={downloadExcel}/>
            </div>
            <Row gutter={[24, 24]} style={{marginBottom: '3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'userName'} label={'نام کاربری'}
                                  onChange={onChangeUserNameHandler} value={userInfo?.userName}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id: 'uid', name: '', family: ''}, ...users]?.map(item => <Option
                            value={item.name ? item.name + ' ' + item.family : ''}
                            key={item.id}>{item.name + ' ' + item.family}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'personnelCode'} label={'کد پرسنلی'}
                                  onChange={onchangePersonnelCodeHandler} value={userInfo?.personnelCode}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id: 'uid', personnelCode: ''}, ...users]?.map(item => <Option value={item.personnelCode}
                                                                                         key={item.id}>{item.personnelCode}</Option>)}
                    </CustomSelect>
                    {/*<CustomTextInput name={'personnelCode'} label={'کد پرسنلی'} value={userInfo.personnelCode} onChange={changePersonnelCode} />*/}
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput name={'userSystemIP'} label={'IP دستگاه'} value={userInfo.userSystemIP}
                                     onChange={changeSystemIP}/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>از تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={userInfo?.fromDateStr ? dayjs(userInfo?.fromDateStr, {jalali: true}) : ''}
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
                        value={userInfo?.toDateStr ? dayjs(userInfo?.toDateStr, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => userInfoToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'toDateStr'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>{'از ساعت'}</span>
                    <CustomTimePicker
                        onSelect={selectTimeHandler}
                        open={isOpenTimePicker.fromTimeStr}
                        name={'fromTimeStr'}
                        value={userInfo?.fromTimeStr ? moment(userInfo?.fromTimeStr, "HH:mm") : null}
                        onFocus={timePickerShowOnFocusHandler}
                        onBlur={timePickerShowOnBlurHandler}
                        renderExtraFooter={fromPickerFooterHandler}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>{'تا ساعت'}</span>
                    <CustomTimePicker
                        onSelect={selectTimeHandler}
                        open={isOpenTimePicker.toTimeStr}
                        name={'toTimeStr'}
                        value={userInfo?.toTimeStr ? moment(userInfo?.toTimeStr, "HH:mm") : null}
                        onFocus={timePickerShowOnFocusHandler}
                        onBlur={timePickerShowOnBlurHandler}
                        renderExtraFooter={fromPickerFooterHandler}
                    />
                </Col>
                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'گزارش جامع'} onClick={getUserActivityReports}/>
                </Col>
            </Row>
            <Table columns={columns} dataSource={userActivityList?.response} loading={loading}
                   onChange={handleTableChange}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'brokerId'}
                   pagination={pagination}
            />
            <h4>تعداد قابل نمایش: {5}</h4>
        </div>
    )
}

export default ReportUsersActivity