import {Col, Empty, message, Row, Select, Spin, Table, Tooltip, Tree} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createBroker} from "../../redux/slices/broker";
import List from "../../assets/images/list.svg";
import {getBranchesList} from "../../redux/slices/branches";
import {createUser, editUser, getUserById} from "../../redux/slices/user";
import { useForm, Controller } from "react-hook-form";
import {createGroupAsync, editGroupAsync, getAllPermissionsAsync, getGroupByIdAsync} from "../../redux/slices/group";
import {v4 as uuidv4} from "uuid";
import {toast} from "react-toastify";

const {Option}=Select


export const isRequiredCustom = (value) => {
    return value ? true : 'This is a required input, can not escape';
}

const treeData = [
    {
        title: '0-0',
        key: '0-0',
        children: [
                    {
                        title: '0-0-0-0',
                        key: '0-0-0-0',
                    },
                    {
                        title: '0-0-0-1',
                        key: '0-0-0-1',
                    },
                    {
                        title: '0-0-0-2',
                        key: '0-0-0-2',
                    },

                    {
                        title: '0-0-1-0',
                        key: '0-0-1-0',
                    },
                    {
                        title: '0-0-1-1',
                        key: '0-0-1-1',
                    },
                    {
                        title: '0-0-1-2',
                        key: '0-0-1-2',
                    },
            {
                title: '0-0-2',
                key: '0-0-2',
            },
        ],
    },
    {
        title: '0-1',
        key: '0-1',
        children: [
            {
                title: '0-1-0-0',
                key: '0-1-0-0',
            },
            {
                title: '0-1-0-1',
                key: '0-1-0-1',
            },
            {
                title: '0-1-0-2',
                key: '0-1-0-2',
            },
        ],
    },

];

const AddEditGroup = (props) => {

    const [group, setGroup] = useState({
        id: 0,
        faName: '',
        enName: '',
        permissions:[]
    })
    const [loadingButton, setLoadingButton] = useState(false)
    const [loading, setLoading] = useState(false)

    const [expandedKeys, setExpandedKeys] = useState([]);
    const [checkedKeys, setCheckedKeys] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };
    const onCheck = (checkedKeysValue) => {
        const newValues = checkedKeysValue.filter(item=> Number(item) == item )
        setCheckedKeys(newValues);
    };
    const onSelect = (selectedKeysValue, info) => {
        setSelectedKeys(selectedKeysValue);
    };


    let permissionsList = useSelector(state => state.groups.permissionsList)

    const dispatch = useDispatch()
    const location = useLocation()
    const navigation = useNavigate()
    const {id} = useParams()

    const { handleSubmit, control, formState:{errors,isDirty} , setValue, reset, getValues, } = useForm({
        defaultValues:{
            id: 0,
            faName: '',
            enName: '',
            permissions:[]
        }
    });

    useEffect(() => {
        dispatch(getAllPermissionsAsync())
        if (id) {
            setLoading(true)
            setTimeout(()=>{
                dispatch(getGroupByIdAsync(id)).then(res=>{
                    setGroup(res.payload)
                    const ids = res.payload.permissions.map(item=>{
                        return item.id.toString()
                    })
                    setCheckedKeys(ids)
                    setLoading(false)
                })
            },500)
        }
    }, [])

    useEffect(() => {
        reset(group);
    }, [group.faName]);


    const userOnChangeHandler = (event) => {
        setGroup({...group, [event.target.name]: event.target.value})
    }


    const renderTreeData=()=>{
        if (permissionsList.length>0){
            return  permissionsList.map((item,index)=>{
                return {...item,key:item.key}
            })
        }
    }

    const cancelUserHandler = ()=>{
        navigation('/groups')
    }

    const createGroupHandler = () => {
        setLoadingButton(true)
        let newGroup = {...group,stringPermissionIds: checkedKeys}
        if (group.faName==='ادمین'|| group.enName==='admin'|| group.enName==='Admin'){
            toast.error('نام گروه مجاز نیست')
            setLoadingButton(false)
        }else {
            if (id) {
                dispatch(editGroupAsync(newGroup)).then(res=>{
                    setLoadingButton(false)
                })
            }else {
                dispatch(createGroupAsync(newGroup)).then(res=>{
                    setLoadingButton(false)
                })
            }
        }

    }

    const onSubmit = (values) => {
        createGroupHandler(values)
    };


    if (loading) {
        return(
            <div className={'spinner-container'}>
                <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'} />
            </div>
        )
    }



    return (
        <div className={'inquiry-content-container'}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Row gutter={[24,24]} style={{marginBottom: '2rem'}}>
                    <Col lg={8} xl={7} xxl={4}>
                        <Controller
                            name="faName"
                            control={control}
                            defaultValue=""
                            rules={{required:'فیلد اجباری است'}}
                            render={({ field:{name,onChange,value} }) => (
                                <CustomTextInput name={name} type={'text'} label={'نام فارسی '}
                                                 disabled={location.pathname.includes('edit')}
                                                 value={value} onChange={(e)=>{
                                    userOnChangeHandler(e)
                                    onChange(e)
                                }}/>
                            )}
                        />
                        <small style={{color:'red'}}>
                            {errors?.faName && errors.faName.message}
                        </small>
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <Controller
                            name="enName"
                            control={control}
                            defaultValue=""
                            rules={{required:'فیلد اجباری است'}}
                            render={({ field:{name,onChange,value} }) => (
                                <CustomTextInput name={name} type={'text'} label={'نام انگلیسی'}
                                                 disabled={location.pathname.includes('edit')}
                                                 value={value} onChange={(e)=>{
                                    userOnChangeHandler(e)
                                    onChange(e)
                                }}/>
                            )}
                        />
                        <small style={{color:'red'}}>
                            {errors?.enName && errors.enName.message}
                        </small>
                    </Col>
                    {/*<Col lg={8} xl={7} xxl={4}>*/}
                    {/*    <span className={'time-picker-label'}>مجوز ها</span>*/}
                    {/*    <Controller*/}
                    {/*        name="permission"*/}
                    {/*        control={control}*/}
                    {/*        defaultValue={[]}*/}
                    {/*        rules={{required:'فیلد اجباری است'}}*/}
                    {/*        render={({ field:{name,onChange,value} }) => (*/}
                    {/*            <Select*/}
                    {/*                mode="multiple"*/}
                    {/*                allowClear*/}
                    {/*                value={value}*/}
                    {/*                name={name}*/}
                    {/*                showSearch*/}
                    {/*                placeholder=""*/}
                    {/*                onChange={(e)=>{*/}
                    {/*                    onChange(e)*/}
                    {/*                    onChangePermissionHandler(e)*/}
                    {/*                }}*/}
                    {/*                suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}*/}
                    {/*            >*/}
                    {/*                {permissionsList?.map(item => <Option value={item.id}*/}
                    {/*                                                   key={item.id}>{item.faName}</Option>)}*/}
                    {/*            </Select>*/}
                    {/*        )}*/}
                    {/*    />*/}
                    {/*    <small style={{color:'red'}}>*/}
                    {/*        {!getValues().branchName && errors?.branchName && errors.branchName.message}*/}
                    {/*    </small>*/}
                    {/*</Col>*/}
                </Row>
                <Row gutter={[24,24]} style={{marginBottom: '6rem'}}>
                    <Col lg={8} xl={7} xxl={8}>
                        <h3>دسترسی ها</h3>
                        <Tree
                            checkable
                            onExpand={onExpand}
                            expandedKeys={expandedKeys}
                            autoExpandParent={autoExpandParent}
                            onCheck={onCheck}
                            checkedKeys={checkedKeys}
                            onSelect={onSelect}
                            selectedKeys={selectedKeys}
                            treeData={renderTreeData()}
                        />
                    </Col>
                </Row>
                <Row gutter={24} justify={'end'} className={'footer-buttons'}>
                    <Col lg={3}>
                        <CustomButton type={'primary'} title={'انصراف'} onClick={cancelUserHandler}/>
                    </Col>
                    <Col lg={3}>
                        <CustomButton type={'primary'} htmlType={'submit'}
                                      title={loadingButton ? <Spin/> : id ? 'ویرایش گروه' : 'ثبت گروه'}
                            // onClick={createBrokerHandler}
                        />
                    </Col>
                </Row>
            </form>
        </div>
    )
}

export default AddEditGroup