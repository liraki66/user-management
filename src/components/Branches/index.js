import {Col, Empty, Select, Spin, Table, Row, message} from "antd";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Edit from "../../assets/images/edit.svg";
import Delete from "../../assets/images/delete.svg";
import { useSelector, useDispatch } from 'react-redux'
import List from "../../assets/images/list.svg";
import CustomButton from "../Fields/CustomButton";
import {deleteBranch, getBranchesList, getBranchesListWithPagination} from "../../redux/slices/branches";
import {getStakeholdersListWithPagination} from "../../redux/slices/stakeholders";
import {deleteBroker} from "../../redux/slices/broker";
import ConfirmModal from "../General/ConfirmModal";
import CustomSelect from "../Fields/CustomSelect";
import {ToastContainer} from "react-toastify";

const {Option}=Select


const Branches = (props) => {

    const [branch,setBranch]=useState({branchName:'',branchCode:''})
    const [filter,setFilter]=useState({branchName:'',branchCode:''})
    const [pagination, setPagination] = useState({ pageSize: 6, position: ['bottomCenter'], current: 1,total:0,showSizeChanger:false});

    const branchesList = useSelector((state) => state.branches.branchesList)
    const branchesListWithPagination = useSelector((state) => state.branches.branchesListWithPagination)
    const [loading,setLoading]=useState(true)
    const [showModal,setShowModal]=useState(false)
    const [confirmLoading,setConfirmLoading]=useState(false)
    const [branchId,setBranchId]=useState(null)

    const dispatch = useDispatch()
    const navigation = useNavigate()


    const deleteBranchHandler = (id)=>{
        setBranchId(id)
        setShowModal(true)
    }

    const editBranchHandler = (record)=>{
        navigation(`/branches/edit-branch/${record.id}`)
    }


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = branchesListWithPagination?.response?.branchList?.indexOf(record)
                return <div>{((pagination.current-1) * (pagination.pageSize)) + newIndex + 1}</div>
            },
            width:75
        },
        {
            title: 'نام شعبه',
            dataIndex: 'name',
            width: 150
        },
        {
            title: 'کد شعبه',
            dataIndex: 'code',
            width: 100
        },
        {
            title: 'تلفن',
            dataIndex: 'phone',
            width: 150
        },
        {
            title: 'آدرس',
            dataIndex: 'address',
            width: 300,
        },
        {
            render: (text, record, index) => {
                return (
                    <div className={'brokers-options-container'}>
                        <img src={Edit} alt={'ویرایش'} onClick={()=>editBranchHandler(record)}/>
                        <img src={Delete} alt={'حذف'} onClick={()=>deleteBranchHandler(record.id)}/>
                    </div>
                )
            },
            width:150
        },
    ];


    useEffect(() => {
            dispatch(getBranchesList({}))
    }, [])

    useEffect(() => {
        setLoading(true)
        const data = {
            request : branch,
            pageNumber: pagination.current -1,
            take:pagination.pageSize
        }
        setTimeout(()=>{
            dispatch(getBranchesListWithPagination(data)).then(res=>{
                setPagination({...pagination,total : res.payload.totalRecords})
                setLoading(false)
            })
        },500)

    }, [pagination.current])


    const tablePaginationHandler =(data)=>{
        setPagination({...pagination,current: data.current})
    }

    const onChangeBranchNameCodeHandler = (value,fieldName) => {
        if (value) {
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

    const onSearchHandler = ()=>{
        setLoading(true)
        setBranch({...filter})
        const data = {
            request : filter,
            pageNumber: 0,
            take:pagination.pageSize
        }
        setTimeout(()=>{
            dispatch(getBranchesListWithPagination(data)).then(res=>{
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
        const data = {
            request : filter,
            pageNumber: 0,
            take:pagination.pageSize
        }
        dispatch(deleteBranch(branchId)).then(res=>{
            setConfirmLoading(false)
            setShowModal(false)
            dispatch(getBranchesList({}))
            dispatch(getBranchesListWithPagination(data))
            if(branchesListWithPagination.response?.branchList?.length ===1 && pagination.current>1) {
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
            <ConfirmModal visible={showModal} onCancel={cancelModalHandler} onOk={onOkModalHandler} title={'حذف شعبه'} text={'شعبه انتخاب شده حذف می شود. آیا مطمئن هستید؟'} confirmLoading={confirmLoading}/>
            <Row gutter={[24,24]} style={{marginBottom:'3rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect value={filter?.branchName} name={'branchName'} label={'نام شعبه'} onChange={onChangeBranchNameCodeHandler} notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}>
                        {[{id:'bid',name:''},...branchesList]?.map(item => <Option value={item.name}
                                                           key={item.id}>{item.name}</Option>)}
                    </CustomSelect>
                    {/*<span className={'time-picker-label'}>نام شعبه</span>*/}
                    {/*<Select*/}
                    {/*    value={branch?.branchName}*/}
                    {/*    showSearch*/}
                    {/*    placeholder=""*/}
                    {/*    onChange={onChangeBranchNameCodeHandler}*/}
                    {/*    notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}*/}
                    {/*    suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}*/}
                    {/*>*/}
                    {/*    {branchesList?.map(item => <Option value={item.name}*/}
                    {/*                                     key={item.id}>{item.name}</Option>)}*/}
                    {/*</Select>*/}
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <CustomSelect value={filter?.branchCode} name={'branchCode'} label={'کد شعبه'} onChange={onChangeBranchNameCodeHandler} notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}>
                        {[{id:'bid',code:''},...branchesList]?.map(item => <Option value={item.code}
                                                           key={item.code}>{item.code}</Option>)}
                    </CustomSelect>
                    {/*<span className={'time-picker-label'}>کد شعبه</span>*/}
                    {/*<Select*/}
                    {/*    value={branch?.branchCode}*/}
                    {/*    showSearch*/}
                    {/*    placeholder=""*/}
                    {/*    onChange={onChangeBranchNameCodeHandler}*/}
                    {/*    notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}*/}
                    {/*    suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}*/}
                    {/*>*/}
                    {/*    {branchesList?.map(item => <Option value={item.code}*/}
                    {/*                             key={item.code}>{item.code}</Option>)}*/}
                    {/*</Select>*/}
                </Col>
                <Col lg={4} xl={3} xxl={3}>
                    <CustomButton type={'primary'} title={ 'جست و جو'} onClick={onSearchHandler}/>
                </Col>
            </Row>
            {
                !loading ? <>
            <Table columns={columns} dataSource={branchesListWithPagination?.response?.branchList} loading={loading}
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

export default Branches