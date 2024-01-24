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
import {deleteGroupAsync, getGroupsAsync, getGroupsAsyncWithPagination} from "../../redux/slices/group";
import {getUserActivity} from "../../redux/slices/report";

const {Option}=Select


const Groups = (props) => {


    const [group, setGroup] = useState({enName: ''})
    const [filter, setFilter] = useState({faName:'',id: 0})
    const [pagination, setPagination] = useState({ pageSize: 6, position: ['bottomCenter'],showSizeChanger:false,current:1});
    const [loading,setLoading]=useState(false)

    const groupsList = useSelector((state) => state.groups.groupsList)
    const groupsListWithPagination = useSelector((state) => state.groups.groupsListWithPagination)
    const [showModal,setShowModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)
    const [groupId,setGroupId]=useState(null)

    const dispatch = useDispatch()
    const navigation = useNavigate()


    const deleteGroupHandler = (id)=>{
        setGroupId(id)
        setShowModal(true)
    }

    const editGroupHandler = (record)=>{
        navigation(`/groups/edit-group/${record.id}`)
    }


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = groupsListWithPagination?.response?.groups.indexOf(record)
                return <div>{ newIndex + 1}</div>
            },
        },
        {
            title: 'نام فارسی',
            dataIndex: 'faName',
        },
        {
            title: 'نام انگلیسی',
            dataIndex: 'enName',
        },
        // {
        //     title: 'شناسه',
        //     dataIndex: 'id',
        // },
        {
            render: (text, record, index) => {
                return (
                    <div className={'brokers-options-container'}>
                        <img src={Edit} alt={'ویرایش'} onClick={()=>editGroupHandler(record)}/>
                        <img src={Delete} alt={'حذف'} onClick={()=>deleteGroupHandler(record.id)}/>
                    </div>
                )
            }
        },
    ];

    // useEffect(() => {
    //     dispatch(getGroupsAsync({}))
    // }, [])



    const tablePaginationHandler =(data)=>{
        setPagination({...pagination,current: data.current})
    }

    const onchangeFilterHandler =(data,name)=>{
        const selectedGroupId = groupsList?.groups?.find(item=>item.faName===data)?.id
        console.log('test',data,selectedGroupId)
        setFilter({...filter,id:selectedGroupId,faName: data})
    }

    useEffect(()=>{
        dispatch(getGroupsAsync({id:0}))
    },[])

    useEffect(() => {
        setLoading(true)
        const data = {
            request: filter,
            pageNumber: pagination.current - 1,
            take: pagination.pageSize
        }
        setTimeout(() => {
            dispatch(getGroupsAsyncWithPagination(data)).then(res => {
                setPagination({...pagination, total: res.payload.totalRecords})
                setLoading(false)
            })
        }, 500)
    }, [pagination.current])


    const onSearchHandler = ()=>{
        setLoading(true)
        // setGroup({...filter})
        const data = {
            request : filter,
            pageNumber: 0,
            take:pagination.pageSize
        }
        setTimeout(()=>{
            dispatch(getGroupsAsyncWithPagination(data)).then(res=>{
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
        dispatch(deleteGroupAsync(groupId)).then(res=>{
            setConfirmLoading(false)
            setShowModal(false)
            dispatch(getGroupsAsync({id:0}))
            dispatch(getGroupsAsyncWithPagination({faName:'',id: 0}))
            if(groupsListWithPagination?.response?.groups?.length ===1 && pagination.current>1) {
                setPagination({...pagination,current: pagination.current-1})
            }
        })
    }


    return (
        <div className={'inquiry-content-container'}>
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'حذف گروه'} text={'گروه انتخاب شده حذف می شود. آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <Row gutter={[24,24]} style={{marginBottom:'2rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect name={'faName'} label={'نام گروه'}
                                  onChange={onchangeFilterHandler} value={filter?.faName}
                                  showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                    >
                        {groupsList?.groups?.length>0 && [{id: 'uid', enName: '',faName:''}, ...groupsList?.groups]?.map(item => <Option value={item.faName}
                                                                                         key={item.id}>{item.faName}</Option>)}
                    </CustomSelect>
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={ 'جست و جو'} onClick={onSearchHandler}/>
                </Col>
            </Row>
            {
                !loading ? <>
                        <Table columns={columns} dataSource={groupsListWithPagination?.response?.groups} loading={loading}
                               locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'enName'} pagination={{...pagination,total:groupsListWithPagination?.response?.totalRecords}}
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

export default Groups