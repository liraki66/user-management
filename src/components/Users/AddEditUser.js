import {Col, Empty, message, Row, Select, Spin, Table, Tooltip} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createBroker} from "../../redux/slices/broker";
import List from "../../assets/images/list.svg";
import {getBranchesList} from "../../redux/slices/branches";
import {createUser, editUser, getUserById} from "../../redux/slices/user";
import { useForm, Controller } from "react-hook-form";
import CustomSelect from "../Fields/CustomSelect";
import {getGroupsAsync} from "../../redux/slices/group";
import {toast} from "react-toastify";
import {onKeyPressHandler} from "../../services/helper";

const {Option}=Select


export const isRequiredCustom = (value) => {
    return value ? true : 'This is a required input, can not escape';
}

const AddEditUser = (props) => {

    const [user, setUser] = useState({
        id: 0,
        branchId: '',
        branchName:'',
        branchCode:'',
        name: '',
        family: '',
        nationalCode: '',
        personnelCode: '',
        mobile: '',
        userName:'',
        password:'',
        confirmPassword:'',
        groupId:'',
        groupFaName:''
    })
    const [loadingButton, setLoadingButton] = useState(false)
    const [loading, setLoading] = useState(false)

    const branchesList = useSelector(state => state.branches.branchesList)
    const groupsList = useSelector((state) => state.groups.groupsList)

    const dispatch = useDispatch()


    const navigation = useNavigate()
    const {id} = useParams()

    const { handleSubmit, control, formState:{errors,isDirty} , setValue, reset, getValues, } = useForm({
        defaultValues:{
            id: 0,
            branchId: '',
            branchName:'',
            branchCode:'',
            name: '',
            family: '',
            nationalCode: '',
            personnelCode: '',
            mobile: '',
            groupId:'',
            groupFaName:''
        }
    });


    useEffect(() => {
        dispatch(getGroupsAsync({request:{id:null},pageNumber: 1, take: 0}))
        dispatch(getBranchesList({}))
        if (id) {
            setLoading(true)
            setTimeout(()=>{
            dispatch(getUserById(id)).then(res=>{
                setUser(res.payload)
                setLoading(false)
            })
            },500)
        }
    }, [])

    useEffect(() => {
        reset(user);
    }, [user?.name]);

    const onChangeBranchNameHandler = (value) => {
        let code = ''
        let id = ''
        let newBranch = branchesList.find(item => item.name === value)
        code = newBranch.code
        id = newBranch.id
        setValue('branchCode',code)
        setUser({...user, branchCode: code, branchName: value,branchId:id})
    };

    const onChangeBranchCodeHandler = (value) => {
        let name = ''
        let id = ''
        let newBranch = branchesList.find(item => item.code === value)
        name = newBranch.name
        id = newBranch.id
        setValue('branchName',name)
        setUser({...user, branchCode: value, branchName: name,branchId:id})
    };

    const userOnChangeHandler = (event) => {
            setUser({...user, [event.target.name]: event.target.value})
    }

    const onchangeGroupHandler=(value)=>{
        const selectedGroupId = groupsList?.groups.find(item=>item.faName===value)?.id
        setUser({...user, groupFaName: value, groupId: selectedGroupId})
    }

    const cancelUserHandler = ()=>{
        navigation('/users')
    }

    const createUserHandler = () => {
        setLoadingButton(true)
        if (user.password !== user.confirmPassword) {
            toast.error(' رمزعبور با تکرار آن مغایرت دارد')
            setLoadingButton(false)
        }else if (user.userName==='ادمین'|| user.userName==='admin'|| user.userName==='Admin') {
            toast.error('نام کاربری مجاز نیست')
            setLoadingButton(false)
        }else {
            if (id) {
                const {userName,password,confirmPassword,groupFaName} = user
                dispatch(editUser(user)).then(res=>{
                    setLoadingButton(false)
                })
            }else {
                dispatch(createUser(user)).then(res=>{
                    setLoadingButton(false)
                })
            }
        }
    }

    const onSubmit = (values) => {
            createUserHandler(values)
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
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'نام'}
                                             value={value} onChange={(e)=>{
                                userOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.name && errors.name.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="family"
                        control={control}
                        defaultValue=""
                        rules={{required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'نام خانوادگی'}
                                             value={value} onChange={(e)=>{
                                userOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.family && errors.family.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="personnelCode"
                        control={control}
                        defaultValue=""
                        rules={{pattern:{value:/^[0-9]+$/,message:'فقط عدد مجاز است'},required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'کد پرسنلی'}
                                             onKeyPress={onKeyPressHandler}
                                             value={value} onChange={(e)=>{
                                userOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.personnelCode && errors.personnelCode.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="nationalCode"
                        control={control}
                        defaultValue=""
                        rules={{pattern:{value:/^[0-9]+$/,message:'فقط عدد مجاز است'},required:'فیلد اجباری است', maxLength:{value:10,message:'کد ملی باید 10 رقمی باشد'}, minLength:{value:10,message:'کد ملی باید 10 رقمی باشد'}}}
                        // rules={{ validate: {required: ()=>{} } }}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'کد ملی'}
                                             onKeyPress={onKeyPressHandler}
                                             value={value} onChange={(e)=>{
                                userOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.nationalCode && errors.nationalCode.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="mobile"
                        control={control}
                        defaultValue=""
                        // rules={{pattern:{value:/09(1[0-9]|3[0-9]|2[1-9]|9[0-9]|0[1-9])-?[0-9]{3}-?[0-9]{4}/,message:'شماره تلفن همراه نامعتبر است'},required:'فیلد اجباری است'}}
                        rules={{pattern:{value:/^09(0[1-5]|[1 3]\d|2[0-2]|9[0-4]|98)\d{7}$/,message:'شماره تلفن همراه نامعتبر است'},required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'شماره تلفن همراه'}
                                             onKeyPress={onKeyPressHandler}
                                             value={value} onChange={(e)=>{
                                userOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.mobile && errors.mobile.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>نام شعبه</span>
                    <Controller
                        name="branchName"
                        control={control}
                        defaultValue=''
                        rules={{required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <Select
                                value={value}
                                name={name}
                                showSearch
                                placeholder=""
                                onChange={(e)=>{
                                    onChange(e)
                                    onChangeBranchNameHandler(e)
                                }}
                                onSelect={(e)=>{
                                    onChange(e)
                                    onChangeBranchNameHandler(e)
                                }}
                                suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                            >
                                {branchesList?.map(item => <Option value={item.name}
                                                                   key={item.id}>{item.name}</Option>)}
                            </Select>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {!getValues().branchName && errors?.branchName && errors.branchName.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <span className={'time-picker-label'}>کد شعبه</span>
                    <Controller
                        name="branchCode"
                        control={control}
                        defaultValue=''
                        rules={{required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <Select
                                value={value}
                                name={name}
                                showSearch
                                placeholder=""
                                onChange={(e)=>{
                                    onChange(e)
                                    onChangeBranchCodeHandler(e)
                                }}
                                onSelect={(e)=>{
                                    onChange(e)
                                    onChangeBranchCodeHandler(e)
                                }}
                                suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                            >
                                {branchesList?.map(item => <Option value={item.code}
                                                                   key={item.id}>{item.code}</Option>)}
                            </Select>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {!getValues().branchCode &&  errors?.branchCode && errors.branchCode.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    {/*<CustomSelect name={'faName'} label={'نام گروه'}*/}
                    {/*              onChange={onchangeGroupHandler}*/}
                    {/*              value={user?.groupFaName}*/}
                    {/*              showSearch notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}*/}
                    {/*>*/}
                    {/*    {groupsList?.response?.groups.length > 0 && [{id: 'uid', enName: '',faName:''}, ...groupsList?.response?.groups]?.map(item => <Option value={item.faName}*/}
                    {/*                                                                                                                                        key={item.id}>{item.faName}</Option>)}*/}
                    {/*</CustomSelect>*/}
                    <span className={'time-picker-label'}>نام گروه</span>
                    <Controller
                        name="groupFaName"
                        control={control}
                        defaultValue=''
                        rules={{required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <Select
                                value={value}
                                name={name}
                                showSearch
                                placeholder=""
                                onChange={(e)=>{
                                    onChange(e)
                                    onchangeGroupHandler(e)
                                }}
                                onSelect={(e)=>{
                                    onChange(e)
                                    onchangeGroupHandler(e)
                                }}
                                suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                                notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                            >
                                {groupsList?.groups?.map(item => <Option value={item.faName}
                                                                                   key={item.id}>{item.faName}</Option>)}
                            </Select>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {!getValues().groupFaName &&  errors?.groupFaName && errors.groupFaName.message}
                    </small>
                </Col>
                {id ? null :<> <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="userName"
                        control={control}
                        defaultValue=""
                        rules={{required: 'فیلد اجباری است'}}
                        render={({field: {name, onChange, value}}) => (
                            <CustomTextInput name={name} type={'text'} label={'نام کاربری'}
                                             value={value} onChange={(e) => {
                                userOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color: 'red'}}>
                        {errors?.userName && errors.userName.message}
                    </small>
                </Col>
                    <Col lg={8} xl={7} xxl={4}>
                    <Controller
                    name="password"
                    control={control}
                    defaultValue=""
                    // rules={{required:'فیلد اجباری است', minLength:{value:7,message:'رمز عبور حداقل 7 کاراکتر است'}}}
                    rules={{required:'فیلد اجباری است',pattern:{value:/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/,message:'رمز عبور حداقل 8 کاراکتر و ترکیبی از حروف لاتین بزرگ و کوچک و اعداد و علاِئم ویژه(!#$...) است'}}}
                    render={({field:{name,onChange,value}}) => (
                    <CustomTextInput name={name} type={'password'} label={'رمز عبور'}
                    value={value} onChange={(e)=>{
                    userOnChangeHandler(e)
                    onChange(e)
                }}/>
                    )}
                    />
                    <small style={{color:'red'}}>
                {errors?.password && errors.password.message}
                    </small>
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                    <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{required:'فیلد اجباری است'}}
                    render={({field:{name,onChange,value}}) => (
                    <CustomTextInput name={name} type={'password'} label={'تکرار رمز عبور'}
                    value={value} onChange={(e)=>{
                    userOnChangeHandler(e)
                    onChange(e)
                }}/>
                    )}
                    />
                    <small style={{color:'red'}}>
                {errors?.confirmPassword && errors.confirmPassword.message}
                    </small>
                    </Col></>}
            </Row>
            <Row gutter={24} justify={'end'} className={'footer-buttons'}>
                <Col lg={3}>
                    <CustomButton type={'primary'} title={'انصراف'} onClick={cancelUserHandler}/>
                </Col>
                <Col lg={3}>
                    <CustomButton type={'primary'} htmlType={'submit'}
                                  title={loadingButton ? <Spin/> : id ? 'ویرایش کاربر' : 'ثبت کاربر'}
                                  // onClick={createBrokerHandler}
                    />
                </Col>
            </Row>
            </form>
        </div>
    )
}

export default AddEditUser