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
import {deleteUser, getUsersList, getUsersListWithPagination} from "../../redux/slices/user";
import {deleteBranch, getBranchesList, getBranchesListWithPagination} from "../../redux/slices/branches";
import ConfirmModal from "../General/ConfirmModal";
import CustomSelect from "../Fields/CustomSelect";

const {Option}=Select


const Users = (props) => {


    const [user, setUser] = useState({userName: '', userFamily: '', personnelCode: '',nationalCode:'',branchName:'',branchCode:''})
    const [filter, setFilter] = useState({userName: '', userFamily: '', personnelCode: '',nationalCode:'',branchName:'',branchCode:''})
    const [pagination, setPagination] = useState({ pageSize: 6, position: ['bottomCenter'], current: 1,total:0,showSizeChanger:false});
    const [loading,setLoading]=useState(true)

    const usersList = useSelector((state) => state.users.usersList)
    const usersListWithPagination = useSelector((state) => state.users.usersListWithPagination)
    const branchesList = useSelector((state) => state.branches.branchesList)
    // const loading = useSelector((state) => state.brokers.loadingList)
    const [showModal,setShowModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)
    const [userId,setUserId]=useState(null)

    const dispatch = useDispatch()
    const navigation = useNavigate()


    const deleteUserHandler = (id)=>{
        setUserId(id)
        setShowModal(true)
    }

    const editUserHandler = (record)=>{
        navigation(`/users/edit-user/${record.id}`)
    }


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = usersListWithPagination?.response?.users?.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
        },
        {
            title: 'نام',
            dataIndex: 'name',
        },
        {
            title: 'نام خانوادگی',
            dataIndex: 'family',
        },
        {
            title: 'کد پرسنلی',
            dataIndex: 'personnelCode',
        },
        {
            title: 'کد ملی',
            dataIndex: 'nationalCode',
        },
        {
            title: 'شماره تلفن همراه',
            dataIndex: 'mobile',
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
            render: (text, record, index) => {
                return (
                    <div className={'brokers-options-container'}>
                        <img src={Edit} alt={'ویرایش'} onClick={()=>editUserHandler(record)}/>
                        <img src={Delete} alt={'حذف'} onClick={()=>deleteUserHandler(record.id)}/>
                    </div>
                )
            }
        },
    ];

    useEffect(() => {
            dispatch(getUsersList({}))
            dispatch(getBranchesList({}))
    }, [])

    useEffect(() => {
        setLoading(true)
        const data = {
            request : user,
            pageNumber: pagination.current -1,
            take:pagination.pageSize
        }
        setTimeout(()=>{
            dispatch(getUsersListWithPagination(data)).then(res=>{
                setPagination({...pagination,total : res.payload.totalRecords})
                setLoading(false)
            })
        },500)

    }, [pagination.current])


    const tablePaginationHandler =(data)=>{
        setPagination({...pagination,current: data.current})
    }

    const onChangeBranchNameCodeHandler = (value,fieldName) => {
        if (value){
            let newBranch = fieldName ==='branchName' ? branchesList.find(item => item.name === value) : branchesList.find(item => item.code === value)
            let code = newBranch?.code
            let name = newBranch?.name
            setFilter({
                ...filter,
                branchCode: code,
                branchName: name
            })
        }else {
            setFilter({
                ...filter,
                branchCode: '',
                branchName: ''
            })
        }

    };

    const changeSearchHandler = (event) =>{
        setFilter({...filter,[event.target.name]:event.target.value})
    }

    const onSearchHandler = ()=>{
        setLoading(true)
        setUser({...filter})
        const data = {
            request : filter,
            pageNumber: 0,
            take:pagination.pageSize
        }
        setTimeout(()=>{
            dispatch(getUsersListWithPagination(data)).then(res=>{
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
        dispatch(deleteUser(userId)).then(res=>{
            setConfirmLoading(false)
            setShowModal(false)
            dispatch(getUsersList({}))
            if(usersListWithPagination.response?.users?.length ===1 && pagination.current>1) {
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
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'حذف کاربر'} text={'کاربر انتخاب شده حذف می شود. آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <Row gutter={[24,24]} style={{marginBottom:'2rem'}}>
                    <Col lg={8} xl={7} xxl={4}>
                        <CustomTextInput type={'text'} name={'userName'} label={'نام'} value={filter?.userName} onChange={changeSearchHandler} />
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <CustomTextInput type={'text'} name={'userFamily'} label={'نام خانوادگی'} value={filter?.userFamily} onChange={changeSearchHandler} />
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <CustomTextInput type={'text'} name={'personnelCode'} label={'کد پرسنلی'} value={filter?.personnelCode} onChange={changeSearchHandler} />
                    </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomTextInput type={'text'} name={'nationalCode'} label={'کد ملی'} value={filter?.nationalCode} onChange={changeSearchHandler} />
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect value={filter?.branchName} name={'branchName'} label={'نام شعبه'} onChange={onChangeBranchNameCodeHandler} notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}>
                        {[{id:'bid',name:''},...branchesList]?.map(item => <Option value={item.name}
                                                           key={item.id}>{item.name}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect value={filter?.branchCode} name={'branchCode'} label={'کد شعبه'} onChange={onChangeBranchNameCodeHandler} notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}>
                        {[{id:'bid',code:''},...branchesList]?.map(item => <Option value={item.code}
                                                           key={item.code}>{item.code}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={ 'جست و جو'} onClick={onSearchHandler}/>
                </Col>
            </Row>
            {
                !loading ? <>
            <Table columns={columns} dataSource={usersListWithPagination?.response?.users} loading={loading}
                   locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'brokerId'} pagination={pagination} onChange={tablePaginationHandler}
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

export default Users