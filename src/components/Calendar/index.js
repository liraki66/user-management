import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Edit from "../../assets/images/edit.svg";
import Delete from "../../assets/images/delete.svg";
import {deleteBroker, getBrokersList, getBrokersListWithPagination} from "../../redux/slices/broker";
import {Col, Empty, message, Row, Select, Spin, Table} from "antd";
import {toast, ToastContainer} from "react-toastify";
import ConfirmModal from "../General/ConfirmModal";
import CustomSelect from "../Fields/CustomSelect";
import CustomTextInput from "../Fields/CustomTextInput";
import CustomButton from "../Fields/CustomButton";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import List from "../../assets/images/list.svg";
import {getCalendarData, getWeekDayNames, setHolidays, setWorkingDays} from "../../redux/slices/calendar";
import {currentDate, nextWeekDate} from "../../services/helper";
import {getUsersList} from "../../redux/slices/user";

const {Option} = Select

const holidayStatusOptions = [
    {
        label: '',
        value: null
    },
    {
        label: 'روز کاری',
        value: false
    },
    {
        label: 'تعطیل رسمی',
        value: true
    },
]

const approvedStatusOptions = [
    {
        label: '',
        value: null
    },
    {
        label: 'تایید شده',
        value: true
    },
    {
        label: 'تایید نشده',
        value: false
    },
]


const Calendar = () => {

    const [calendarInfo, setCalendarInfo] = useState(
        {
            fromDate: currentDate,
            toDate: nextWeekDate,
            isHoliday: null,
            isApproved: null,
            approvingUsername: null,
            weekDayName: null,
        }
    )
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
        total: 365,
        position: ['bottomCenter'],
        showSizeChanger: false
    });


    const calendarDataWithPagination = useSelector((state) => state?.calendar?.calendarDataWithPagination)
    const weekDayNames = useSelector((state) => state?.calendar?.weekDayNames)
    const usersList = useSelector((state) => state.users.usersList)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loadingWorkButton, setLoadingWorkButton] = useState(false)
    const [loadingHolidayButton, setLoadingHolidayButton] = useState(false)

    const dispatch = useDispatch()
    const navigation = useNavigate()


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = calendarDataWithPagination?.response?.indexOf(record)
                return <div>{ newIndex + 1}</div>
            },
        },
        {
            title: 'تاریخ',
            dataIndex: 'persianDate',
        },
        {
            title: 'روز',
            dataIndex: 'dayName',
        },
        {
            title: 'وضعیت تعطیلی',
            dataIndex: 'holidayStatus',
        },
        {
            title: 'بازبینی',
            dataIndex: 'approvedStatus',
        },
        {
            title: 'کاربر تایید کننده',
            dataIndex: 'approvingUsername',
        },
    ];


    useEffect(() => {
        dispatch(getWeekDayNames())
        dispatch(getUsersList({}))
    }, [])

    useEffect(() => {
        setLoading(true)
        const data = {
            ...calendarInfo
            // pageNumber: pagination.current - 1,
            // take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getCalendarData(data)).then(res => {
                setPagination({...pagination, total: res.payload.totalRecords})
                setLoading(false)
                if (res.payload.totalRecords === 0) {
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

    },
        // [pagination.current]
        []
    )

    const onSearchHandler = () => {
        setLoading(true)
        const data = {
            ...calendarInfo,
            // pageNumber: pagination.current - 1,
            // take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getCalendarData(data)).then(res => {
                setPagination({...pagination, total: res.payload.totalRecords})
                setLoading(false)
                if (res.payload.totalRecords === 0) {
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
    }

    const tablePaginationHandler = (data) => {
        setPagination({...pagination, current: data.current})
    }

    const cancelModalHandler = () => {
        setShowModal(false)
    }


    const notifyFromDate = () => toast.error('تاریخ شروع بازه نمی تواند بزرگتر از پایان بازه باشد');
    const notifyToDate = () => toast.error('تاریخ پایان بازه نمی تواند کوچکتر از شروع بازه باشد');

    const brokerInfoFromDateChangeHandler = (date) => {
        if (calendarInfo.toDate) {
            if (dayjs(date).isBefore(dayjs(calendarInfo.toDate))) {
                setCalendarInfo({...calendarInfo, fromDate: date})
            } else {
                notifyFromDate()
            }
        } else {
            setCalendarInfo({...calendarInfo, fromDate: date})
        }
    }

    const brokerInfoToDateChangeHandler = (date) => {
        if (calendarInfo.fromDate) {
            if (dayjs(date).isAfter(dayjs(calendarInfo.fromDate))) {
                setCalendarInfo({...calendarInfo, toDate: date})
            } else {
                notifyToDate()
            }
        } else {
            setCalendarInfo({...calendarInfo, toDate: date})
        }
    }

    const holidayStatusChangeHandler = (value) => {
        setCalendarInfo({...calendarInfo, isHoliday: value})
    }

    const approvedStatusChangeHandler = (value) => {
        setCalendarInfo({...calendarInfo, isApproved: value})
    }

    const uniqueArray =(array)=>{
       let unique= array.filter((c, index) => {
            return array.indexOf(c) === index;
        });
       return unique
    }

    const onSelectChange = (newSelectedRowKeys) => {
        console.log('selected',newSelectedRowKeys)
        // setSelectedRowKeys(uniqueArray([...selectedRowKeys,...newSelectedRowKeys]));
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;


    const handleTableChange = (newPagination, filters, sorter) => {
        setPagination(newPagination)
    }

    const changeToWorkHandler = () => {
        setLoadingWorkButton(true)
        dispatch(setWorkingDays({workDayIds: selectedRowKeys})).then(res => {
            onSearchHandler()
            setSelectedRowKeys([])
            setLoadingWorkButton(false)
        })
    }

    const changeToHolidayHandler = () => {
        setLoadingHolidayButton(true)
        dispatch(setHolidays({holidayIds: selectedRowKeys})).then(res => {
            onSearchHandler()
            setSelectedRowKeys([])
            setLoadingHolidayButton(false)
        })
    }

    const weekDayNameChangeHandler = (value)=>{
        setCalendarInfo({...calendarInfo,weekDayName: value})
    }

    const renderWeekDays = ()=>{
        let days = [...weekDayNames]
        let extracted = days.pop()
        days=[extracted,...days]
        return days
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
            <Row gutter={[24, 24]} style={{marginBottom: '1rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>از تاریخ</span>
                    <JalaliLocaleListener/>
                    <DatePickerJalali
                        value={calendarInfo?.fromDate ? dayjs(calendarInfo?.fromDate, {jalali: true}) : ''}
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
                        value={calendarInfo?.toDate ? dayjs(calendarInfo?.toDate, {jalali: true}) : ''}
                        style={{width: '100%'}}
                        locale={locale} format={'YYYY/MM/DD'}
                        onChange={(date, dateString) => brokerInfoToDateChangeHandler(dateString)}
                        suffixIcon={<img src={DateLogo}/>}
                        allowClear={false}
                        name={'toDate'}
                    />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>روز هفته</span>
                    <Select
                        value={calendarInfo?.weekDayName}
                        showSearch
                        placeholder=""
                        onChange={weekDayNameChangeHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {weekDayNames.length > 0 && [{gregorianDayName: null, persianDayName: ''}, ...renderWeekDays()]?.map(item => <Option
                            value={item.gregorianDayName}
                            key={item?.gregorianDayName}>{item?.persianDayName}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>وضعیت تعطیلی</span>
                    <Select
                        value={calendarInfo?.marketFaType}
                        showSearch
                        placeholder=""
                        onChange={holidayStatusChangeHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {holidayStatusOptions?.map(item => <Option value={item.value}
                                                                   key={item?.label}>{item?.label}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>وضعیت بازبینی</span>
                    <Select
                        value={calendarInfo?.marketFaType}
                        showSearch
                        placeholder=""
                        onChange={approvedStatusChangeHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {approvedStatusOptions?.map(item => <Option value={item.value}
                                                                    key={item?.label}>{item?.label}</Option>)}
                    </Select>
                </Col>
                {/*<Col lg={8} xl={7} xxl={4}>*/}
                {/*    <span className={'time-picker-label'}>کاربر تاییدکننده</span>*/}
                {/*    <Select*/}
                {/*        value={calendarInfo?.approvingUsername}*/}
                {/*        showSearch*/}
                {/*        placeholder=""*/}
                {/*        onChange={approvedStatusChangeHandler}*/}
                {/*        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}*/}
                {/*        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}*/}
                {/*    >*/}
                {/*        {approvedStatusOptions?.map(item => <Option value={item.value}*/}
                {/*                                                    key={item?.label}>{item?.label}</Option>)}*/}
                {/*    </Select>*/}
                {/*</Col>*/}
                <Col lg={4} xxl={3}>
                    <CustomButton type={'primary'} title={'فیلتر'} onClick={onSearchHandler}/>
                </Col>
                <Row gutter={[12, 12]} justify={'end'} style={{width: '100%'}}>
                    <Col lg={4} xxl={3}>
                        <CustomButton title={!loadingWorkButton ? 'تغییر وضعیت به روز کاری':<Spin />} onClick={changeToWorkHandler}
                                      disabled={!hasSelected} />
                    </Col>
                    <Col lg={4} xxl={3}>
                        <CustomButton title={!loadingHolidayButton ?'تغییر وضعیت به تعطیل':<Spin />} onClick={changeToHolidayHandler}
                                      disabled={!hasSelected} />
                    </Col>
                </Row>
            </Row>
            {
                !loading ? <div>
                        <div>
                            <div
                                style={{
                                    textAlign: 'right'
                                }}
                            >
                                {hasSelected ? `${selectedRowKeys.length} مورد انتخاب شده است ` : ''}
                            </div>
                        </div>
                        <Table rowSelection={rowSelection} columns={columns}
                               dataSource={calendarDataWithPagination?.response}
                               onChange={handleTableChange}
                               locale={{emptyText: 'داده ای وجود ندارد'}}
                               pagination={pagination}
                            // pagination={{total:pagination.total,pageSize:5,position:'bottomCenter'}}
                               rowKey={'id'}
                        />
                    </div> :
                    <div className={'spinner-container'}>
                        <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'}/>
                    </div>
            }
        </div>
    )
}

export default Calendar