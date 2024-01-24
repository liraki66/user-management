import {Col, Empty, Select, Spin, Table, Row, message} from "antd";
import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import Delete from '../../assets/images/delete.svg'
import './index.scss'
import Edit from "../../assets/images/edit.svg";
import {useSelector, useDispatch} from 'react-redux'
import {
    deleteContract,
    getContractsList,
    getContractsListWithPagination,
    getContractStatus
} from "../../redux/slices/contract";
import CustomTextInput from "../Fields/CustomTextInput";
import List from "../../assets/images/list.svg";
import {deleteBroker, getBrokerById, getBrokersList} from "../../redux/slices/broker";
import CustomButton from "../Fields/CustomButton";
import ConfirmModal from "../General/ConfirmModal";
import {getBranchesListWithPagination} from "../../redux/slices/branches";
import {getStakeholderById, getStakeholdersList} from "../../redux/slices/stakeholders";
import CustomSelect from "../Fields/CustomSelect";
import {ToastContainer} from "react-toastify";


const {Option} = Select;


const Contracts = (props) => {

    const [contract, setContract] = useState({
        brokerName: '',
        brokerCode: '',
        contractNumber: '',
        brokerAccount: '',
        stakeHolderName: '',
        stakeHolderAccount: '',
        terminationLetterNumber: '',
        contractStatus: null
    })
    const [filter, setFilter] = useState({
        brokerName: '',
        brokerCode: '',
        contractNumber: '',
        brokerAccount: '',
        stakeHolderName: '',
        stakeHolderAccount: '',
        terminationLetterNumber: '',
        contractStatus: null
    })
    const [pagination, setPagination] = useState({
        pageSize: 4,
        position: ['bottomCenter'],
        current: 1,
        total: 0,
        showSizeChanger: false
    });
    const [loading, setLoading] = useState(false)

    const contractsList = useSelector((state) => state.contracts.contractsList)
    const brokersList = useSelector((state) => state.brokers.brokersList)
    const brokerAccountsList = useSelector(state => state.brokers.brokerInfo.brokerAccounts)
    const contractsListWithPagination = useSelector((state) => state.contracts.contractsListWithPagination)
    const stakeholdersList = useSelector(state => state.stakeholders.stakeholdersList)
    const contractStatus = useSelector(state => state.contracts.contractStatus)
    // const loading = useSelector((state) => state.contracts.loading)
    const [showModal,setShowModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)
    const [contractId,setContractId]=useState(null)

    const dispatch = useDispatch()


    const navigation = useNavigate()


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = contractsListWithPagination?.response?.contractList?.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
            width: 100
        },
        {
            title: 'شماره قرارداد',
            dataIndex: 'contractNumber',
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
            title: 'شماره سپرده کارگزار',
            dataIndex: 'brokerAccount',
        },
        // {
        //     title: 'شماره شبا',
        //     dataIndex: 'brokerIban',
        //     width: 250
        // },
        {
            title: 'نام ذینفع',
            dataIndex: 'stakeHolderName',
        },
        {
            title: 'شماره سپرده ذینفع',
            dataIndex: 'stakeHolderAccount',
        },
        // {
        //     title: 'شماره نامه فسخ',
        //     dataIndex: 'terminationLetterNumber',
        //     render: (text, record, index) => {
        //         if (text){
        //             return <div>{text}</div>
        //         }else{
        //                 return <div style={{textAlign:'center',fontSize:'18px'}}>-</div>
        //             }
        //     },
        // },
        // {
        //     title: 'تاریخ ثبت',
        //     dataIndex: 'shamsiRegistrationDate',
        //     // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
        //     render: (text, record, index) => {
        //         return <div style={{direction: 'ltr'}}>{text}</div>
        //     },
        //     width: 250
        // },
        {
            title: 'وضعیت',
            dataIndex: 'status',
            // sorter: (a, b) => a.inquiryDate - b.inquiryDate,
            render: (text, record, index) => {
                switch (record.status) {
                    case 'Active':
                        return <div className={'auto-settlement-successful'}>فعال</div>
                        break
                    case 'InitialTermination':
                        return <div className={'auto-settlement-unsuccessful'}>فسخ اولیه</div>
                        break
                    case 'FinalTermination':
                        return <div className={'auto-settlement-unsuccessful'}>فسخ نهایی</div>
                        break
                    default:
                        return <div className={'auto-settlement-unsuccessful'}>منقضی</div>
                        break
                }
            },
            width: 100
        },
        {
            render: (text, record, index) => {
                return (
                    <div className={'brokers-options-container'}>
                        <img src={Edit} alt={'ویرایش'} onClick={() => editContractHandler(record)}/>
                        <img src={Delete} alt={'حذف'} onClick={() => deleteContractHandler(record.id)}/>
                    </div>
                )
            },
            width: 100
        }
    ];


    const deleteContractHandler = (id) => {
        setContractId(id)
        setShowModal(true)
    }

    const editContractHandler = (record) => {
        navigation(`/contracts/edit-contract/${record.id}`)
    }


    useEffect(() => {
        dispatch(getContractsList({}))
        dispatch(getBrokersList({}))
        dispatch(getStakeholdersList({}))
        dispatch(getContractStatus())
    }, [])

    // useEffect(()=>{
    //     if (contract?.stakeHolderName){
    //         let stakeholderId = stakeholdersList.find(item=>item.name===contract?.stakeHolderName).id
    //         dispatch(getStakeholderById(stakeholderId))
    //     }
    // },[contract?.stakeHolderName])

    useEffect(() => {
        setLoading(true)
        const data = {
            request: contract,
            pageNumber: pagination.current - 1,
            take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getContractsListWithPagination(data)).then(res => {
                setPagination({...pagination, total: res?.payload?.totalRecords})
                setLoading(false)
            })
        }, 500)

    }, [pagination.current])

    const tablePaginationHandler = (data) => {
        setPagination({...pagination, current: data.current})
    }


    const onClickRowHandler = (record, event) => {
        event.stopPropagation()
        // navigation(`/contracts/detail/${record.id}`)
    }

    const onSearchHandler = () => {
        setLoading(true)
        setContract({...filter})
        const data = {
            request: filter,
            pageNumber: 0,
            take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getContractsListWithPagination(data)).then(res => {
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

    const onChangeBrokerNameCodeHandler = (value,name) => {
        if (value) {
            let newBroker = name==='brokerName' ? brokersList.find(item => item.name === value) : brokersList.find(item => item.code === value)
            let selectedBrokerCode = newBroker?.code
            let selectedBrokerName = newBroker?.name
            setFilter({
                ...filter,
                brokerCode: selectedBrokerCode,
                brokerName: selectedBrokerName,
                brokerAccount: ''
            })
            dispatch(getBrokerById(newBroker.id))
        }else {
            setFilter({
                ...filter,
                brokerCode: '',
                brokerName: '',
                brokerAccount: ''
            })
            dispatch(getBrokerById())
        }
    };

    const contractSearchHandler = (event, name) => {
        setFilter({...filter, [name]: event})
    }

    const cancelModalHandler=()=>{
        setShowModal(false)
    }

    const onOkModalHandler = ()=>{
        setConfirmLoading(true)
        dispatch(deleteContract(contractId)).then(res=>{
            setConfirmLoading(false)
            setShowModal(false)
            if(contractsListWithPagination.response?.contractList?.length ===1 && pagination.current>1) {
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
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'حذف قرارداد'} text={'قرارداد انتخاب شده حذف می شود . آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <Row gutter={[24, 24]} style={{marginBottom: '3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput  onChange={(event) => contractSearchHandler(event.target.value, 'contractNumber')}
                        name={'contractNumber'} type={'text'} label={'شماره قرارداد'}/>
                </Col>
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
                    <CustomSelect name={'brokerAccount'} label={'شماره سپرده کارگزار'} onChange={contractSearchHandler}
                                  value={filter?.brokerAccount}>
                        {brokerAccountsList && [{id:'aid',account:''},...brokerAccountsList]?.map(item => <Option value={item.account}
                                                                 key={item.id}>{item.account}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'stakeHolderName'} label={'نام ذینفع'} onChange={contractSearchHandler}
                                  value={filter?.stakeHolderName}>
                        {[{id:'sid',name:''},...stakeholdersList]?.map(item => <Option value={item.name}
                                                               key={item.id}>{item.name}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput name={'stakeHolderAccount'}
                                     onChange={(event) => contractSearchHandler(event.target.value, 'stakeHolderAccount')}
                                     value={filter?.stakeHolderAccount} type={'text'} label={'شماره سپرده ذینفع'}/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput name={'terminationLetterNumber'}
                                     onChange={(event) => contractSearchHandler(event.target.value, 'terminationLetterNumber')}
                                     value={filter?.terminationLetterNumber} type={'text'} label={'شماره نامه فسخ'}/>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'contractStatus'} label={'وضعیت'} onChange={contractSearchHandler}
                                  value={filter?.contractStatus}>
                        {[{id:'sid',status:null},...contractStatus]?.map(item => <Option value={item.status}
                                                               key={item.id}>{item.faStatus}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={'جست و جو'} onClick={onSearchHandler}/>
                </Col>
            </Row>
            {
                !loading ? <>
            <Table columns={columns} dataSource={contractsListWithPagination?.response?.contractList}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'id'} pagination={pagination}
                   onChange={tablePaginationHandler}
                   scroll={{x: 'max-content'}}
                   onRow={(record) => ({onClick: (event) => onClickRowHandler(record, event)})}
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

export default Contracts