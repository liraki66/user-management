import {Col, Empty, Select, Spin, Table, Row, message} from "antd";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import Edit from "../../assets/images/edit.svg";
import Delete from "../../assets/images/delete.svg";
// import './index.scss'
import {deleteBroker, getBrokersList} from "../../redux/slices/broker";
import { useSelector, useDispatch } from 'react-redux'
import CustomTextInput from "../Fields/CustomTextInput";
import List from "../../assets/images/list.svg";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import CustomButton from "../Fields/CustomButton";
import {
    deleteStakeholder,
    getStakeholdersList,
    getStakeholdersListWithPagination
} from "../../redux/slices/stakeholders";
import ConfirmModal from "../General/ConfirmModal";

const {Option}=Select


const Stakeholders = (props) => {

    const [stakeholder,setStakeholder]=useState({stakeHolderName:'',nationalId:'',account:''})
    const [filter,setFilter]=useState({stakeHolderName:'',nationalId:'',account:''})
    const [pagination, setPagination] = useState({ pageSize: 6, position: ['bottomCenter'], current: 1,total:0,showSizeChanger:false});
    const [loading,setLoading]=useState(true)

    const stakeholdersListWithPagination = useSelector((state) => state.stakeholders.stakeholdersListWithPagination)
    const stakeholdersList = useSelector((state) => state.stakeholders.stakeholdersList)
    // const loading = useSelector((state) => state.brokers.loadingList)
    const [showModal,setShowModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)
    const [stakeholderId,setStakeholderId]=useState(null)

    const dispatch = useDispatch()
    const navigation = useNavigate()


    const deleteStakeholderHandler = (id)=>{
         setStakeholderId(id)
        setShowModal(true)
    }

    const editStakeholderHandler = (record)=>{
        navigation(`/stakeholders/edit-stakeholder/${record.id}`)
    }


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = stakeholdersListWithPagination?.response?.stakeHolderDtoList?.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex +1}</div>
            },
        },
        {
            title: 'نام',
            dataIndex: 'name',
        },
        {
            title: 'شناسه ملی',
            dataIndex: 'nationalId',
        },
        {
            title: 'شماره سپرده',
            dataIndex: 'account',
        },
        {
            title: 'شماره شبا',
            dataIndex: 'iban',
            width:350
        },
        {
            render: (text, record, index) => {
                return (
                    <div className={'brokers-options-container'}>
                        <img src={Edit} alt={'ویرایش'} onClick={()=>editStakeholderHandler(record)}/>
                        <img src={Delete} alt={'حذف'} onClick={()=>deleteStakeholderHandler(record.id)}/>
                    </div>
                )
            },
            width:150
        },
    ];

    useEffect(()=>{
        dispatch(getStakeholdersList({}))
    },[])

    useEffect(() => {
        setLoading(true)
        const data = {
            request : stakeholder,
            pageNumber: pagination.current -1,
            take:pagination.pageSize
        }
        setTimeout(()=>{
            dispatch(getStakeholdersListWithPagination(data)).then(res=>{
                setPagination({...pagination,total : res.payload.totalRecords})
                setLoading(false)
            })
        },500)

    }, [pagination.current])

    const changeSearchHandler = (event) =>{
        setFilter({...filter,[event.target.name]:event.target.value})
    }

    const onChangeStakeholderNameHandler = (value)=>{
        setFilter({...filter,stakeHolderName: value})
    }

    const tablePaginationHandler =(data)=>{
        setPagination({...pagination,current: data.current})
    }

    const onSearchHandler = ()=>{
        setLoading(true)
        setStakeholder({...filter})
        const data = {
            request : filter,
            pageNumber: 0,
            take:pagination.pageSize
        }
        setTimeout(()=>{
            dispatch(getStakeholdersListWithPagination(data)).then(res=>{
                setPagination({...pagination,current: 1, total: res.payload.totalRecords})
                setLoading(false)
                if (res.payload.totalRecords===0){
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
        },500)
    }

    const cancelModalHandler=()=>{
        setShowModal(false)
    }

    const onOkModalHandler = ()=>{
        setConfirmLoading(true)
        dispatch(deleteStakeholder(stakeholderId)).then(res=>{
            setConfirmLoading(false)
            setShowModal(false)
            dispatch(getStakeholdersList({}))
            if(stakeholdersListWithPagination.response?.stakeHolderDtoList?.length ===1 && pagination.current>1) {
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
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'حذف ذینفع'} text={'ذینفع انتخاب شده حذف می شود. آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <Row gutter={[24,24]} style={{marginBottom:'2rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>نام</span>
                    <Select
                        value={filter?.stakeHolderName}
                        showSearch
                        placeholder=""
                        onChange={onChangeStakeholderNameHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {[{id:'sid',name:''},...stakeholdersList]?.map(item => <Option value={item.id === 'sid' ? '' : item.name}
                                                 key={item.id}>{item.name}</Option>)}
                    </Select>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} value={filter?.nationalId} name={'nationalId'} label={'َشناسه ملی'} onChange={changeSearchHandler} />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} value={filter?.stakeHolderAccount} name={'stakeHolderAccount'} label={' شماره سپرده'} onChange={changeSearchHandler} />
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={ 'جست و جو'} onClick={onSearchHandler}/>
                </Col>
            </Row>
            {
                !loading ? <>
            <Table columns={columns} dataSource={stakeholdersListWithPagination?.response?.stakeHolderDtoList} loading={loading}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'id'} pagination={pagination} onChange={tablePaginationHandler}
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

export default Stakeholders