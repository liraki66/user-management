import {Col, Empty, Select, Spin, Table, Row, message} from "antd";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Edit from "../../assets/images/edit.svg";
import Delete from "../../assets/images/delete.svg";
import './index.scss'
import {deleteBroker, getBrokerById, getBrokersList, getBrokersListWithPagination} from "../../redux/slices/broker";
import {useSelector, useDispatch} from 'react-redux'
import CustomTextInput from "../Fields/CustomTextInput";
import List from "../../assets/images/list.svg";
import CustomButton from "../Fields/CustomButton";
import ConfirmModal from "../General/ConfirmModal";
import CustomSelect from "../Fields/CustomSelect";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const {Option} = Select


const Brokers = (props) => {

    const [brokerInfo, setBrokerInfo] = useState({brokerName: '', brokerCode: '', nationalId: '', brokerCif: ''})
    const [filter, setFilter] = useState({brokerName: '', brokerCode: '', nationalId: '', brokerCif: ''})
    const [pagination, setPagination] = useState({
        pageSize: 6,
        position: ['bottomCenter'],
        current: 1,
        total: 0,
        showSizeChanger: false
    });

    const user = useSelector(state=>state.auth.decodedUserInfo )
    const brokersListWithPagination = useSelector((state) => state.brokers.brokersListWithPagination)
    const brokersList = useSelector((state) => state.brokers.brokersList)
    // const loading = useSelector((state) => state.brokers.loadingList)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [brokerId, setBrokerId] = useState(null)

    const dispatch = useDispatch()
    const navigation = useNavigate()


    const deleteBrokerHandler = (id) => {
        setBrokerId(id)
        setShowModal(true)
    }

    const editBrokerHandler = (record) => {
        setBrokerInfo(record)
        navigation(`/brokers/edit-broker/${record.id}`)
    }


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = brokersListWithPagination?.response?.brokerList?.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
        },
        {
            title: 'نام شرکت کارگزار',
            dataIndex: 'name',
        },
        {
            title: 'کد کارگزاری',
            dataIndex: 'code',
        },
        {
            title: 'شناسه ملی',
            dataIndex: 'nationalId',
        },
        {
            title: 'شناسه مشتری',
            dataIndex: 'cif',
        },
        {
            title: 'تاریخ ثبت',
            dataIndex: 'shamsiRegistrationDate',
            render: (text, record, index) => {
                return <div style={{direction: 'ltr'}}>{text}</div>
            },
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
        },
        {
            title: 'نام شعبه',
            dataIndex: 'branchName',
        },
        {
            title: 'کد شعبه',
            dataIndex: 'branchCode',
        },
        {
            // title: 'گزینه ها',
            // dataIndex: 'automaticSettlement',
            render: (text, record, index) => {
                return (
                    <div className={'brokers-options-container'}>
                        <img src={Edit} alt={'ویرایش'} onClick={() => editBrokerHandler(record)}/>
                        <img src={Delete} alt={'حذف'} onClick={() => deleteBrokerHandler(record.id)}/>
                    </div>
                )
            }
        },
    ];


    useEffect(() => {
        dispatch(getBrokersList({}))
    }, [])

    useEffect(() => {
        setLoading(true)
        const data = {
            request: brokerInfo,
            pageNumber: pagination.current - 1,
            take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getBrokersListWithPagination(data)).then(res => {
                setPagination({...pagination, total: res.payload.totalRecords})
                setLoading(false)
            })
        }, 500)

    }, [pagination.current])

    const onChangeBrokerNameCodeHandler = (value,name) => {
        if (value) {
            let newBroker = name==='brokerName' ? brokersList.find(item => item.name === value) : brokersList.find(item => item.code === value)
            let selectedBrokerCode = newBroker?.code
            let selectedBrokerName = newBroker?.name
            setFilter({
                ...filter,
                brokerCode: selectedBrokerCode,
                brokerName: selectedBrokerName
            })
        }else {
            setFilter({
                ...filter,
                brokerCode: '',
                brokerName: ''
            })
        }
    };

    const changeSearchHandler = (event) => {
        setFilter({...brokerInfo, [event.target.name]: event.target.value})
    }

    const onSearchHandler = () => {
        setLoading(true)
        setBrokerInfo({...filter})
        const data = {
            request: filter,
            pageNumber: 0,
            take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getBrokersListWithPagination(data)).then(res => {
                setPagination({...pagination,current: 1, total: res.payload.totalRecords})
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

    const onOkModalHandler = () => {
        setConfirmLoading(true)
        const data = {
            request: filter,
            pageNumber: 0,
            take: pagination.pageSize
        }
        dispatch(deleteBroker(brokerId)).then(res => {
            setConfirmLoading(false)
            setShowModal(false)
            dispatch(getBrokersList({}))
            dispatch(getBrokersListWithPagination(data))
            if(brokersListWithPagination.response?.brokerList?.length ===1 && pagination.current>1) {
                setPagination({...pagination,current: pagination.current-1})
            }
        })
    }

    // if (loading) {
    //     return (
    //         <div className={'spinner-container'}>
    //             <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'}/>
    //         </div>
    //     )
    // }


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
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler}
                         title={'حذف شرکت کارگزاری'} text={'شرکت کارگزاری انتخاب شده حذف می شود. آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <Row gutter={[24, 24]} style={{marginBottom: '3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerName'} label={'نام شرکت کارگزار'}
                                  onChange={onChangeBrokerNameCodeHandler} value={filter?.brokerName}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id:'bid',name:''},...brokersList]?.map(item => <Option value={item.name}
                                                          key={item.id}>{item.name}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'brokerCode'} label={'کد کارگزاری'}
                                  onChange={onChangeBrokerNameCodeHandler} value={filter?.brokerCode}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {[{id:'bid',code:''},...brokersList]?.map(item => <Option value={item.code}
                                                          key={item.id}>{item.code}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput name={'nationalId'} type={'text'} label={'شناسه ملی'}
                                     value={filter?.nationalId} onChange={changeSearchHandler}/>
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={'جست و جو'} onClick={onSearchHandler}/>
                </Col>
            </Row>
            {
                !loading ? <>
                        <Table columns={columns} dataSource={brokersListWithPagination?.response?.brokerList}
                               loading={loading}
                               locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'id'} pagination={pagination}
                               onChange={tablePaginationHandler}
                               scroll={{x: 'max-content'}}
                        />
                        <h4>تعداد قابل نمایش: {6}</h4>
                    </> :
                    <div className={'spinner-container'}>
                        <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'}/>
                    </div>
            }
        </div>
    )
}

export default Brokers