import {Col, message, Row, Spin} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createStakeholder, editStakeholder, getStakeholderById} from "../../redux/slices/stakeholders";
import { useForm, Controller } from "react-hook-form";
import {onKeyPressHandler, removeIR} from "../../services/helper";



const AddEditUser = (props) => {

    const [stakeholder, setStakeholder] = useState({
        id: 0,
        name: '',
        account: '',
        iban:'',
        nationalId: '',
    })
    const [loadingButton, setLoadingButton] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()
    const navigation = useNavigate()
    const {id} = useParams()

    const { handleSubmit, control, formState:{errors,isDirty} , setValue, reset } = useForm();


    useEffect(() => {
        if (id) {
            setLoading(true)
            setTimeout(()=>{
            dispatch(getStakeholderById(id)).then(res=>{
                setStakeholder(res.payload)
                setLoading(false)
            })
            },500)
        }
    }, [])

    useEffect(() => {
        let newIban = removeIR(stakeholder.iban)
        reset({...stakeholder,iban:newIban});
    }, [stakeholder.name]);

    const stakeholderInfoChangeHandler = (e) => {
        setStakeholder({...stakeholder,[e.target.name]:e.target.value})
    }

    const createStakeholderHandler = () => {
        setLoadingButton(true)
        let newIban = stakeholder.iban.includes('IR') ? stakeholder.iban : `IR${stakeholder.iban}`
        // stakeholder.iban = `IR${stakeholder.iban}`
        if (id) {
            dispatch(editStakeholder({...stakeholder,iban:newIban})).then(()=>setLoadingButton(false))
        }else{
            dispatch(createStakeholder({...stakeholder,iban:newIban})).then(()=>setLoadingButton(false))
        }
    }

    const cancelStakeholderHandler = ()=>{
        navigation('/stakeholders')
    }

    const onSubmit = (values) => {
        createStakeholderHandler(values)
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
                            <CustomTextInput name={name} type={'text'} label={'نام ذینفع'}
                                             value={value} onChange={(e)=>{
                                stakeholderInfoChangeHandler(e)
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
                        name="nationalId"
                        control={control}
                        defaultValue=""
                        rules={{pattern:{value:/^[0-9]+$/,message:'فقط عدد مجاز است'},required:'فیلد اجباری است',maxLength:{value:11,message:'شناسه ملی باید 11 رقمی باشد'}, minLength:{value:11,message:'شناسه ملی باید 11 رقمی باشد'}}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'شناسه ملی'}
                                             onKeyPress={onKeyPressHandler}
                                             value={value} onChange={(e)=>{
                                stakeholderInfoChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.nationalId && errors.nationalId.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="account"
                        control={control}
                        defaultValue=""
                        rules={{pattern:{value:/^[0-9]+$/,message:'فقط عدد مجاز است'},required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'شماره سپرده'}
                                             onKeyPress={onKeyPressHandler}
                                             value={value} onChange={(e)=>{
                                stakeholderInfoChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.account && errors.account.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                    name="iban"
                    control={control}
                    defaultValue=""
                    rules={{pattern:{value:/^[0-9]+$/,message:'فقط عدد مجاز است'},required:'فیلد اجباری است',maxLength:{value:24,message:'شماره شبا باید 24 رقمی باشد'}, minLength:{value:24,message:'شماره شبا باید 24 رقمی باشد'}}}
                    render={({ field:{name,onChange,value} }) => (
                        <CustomTextInput suffix={'IR'} name={name} type={'text'} label={'شماره شبا'}
                                         onKeyPress={onKeyPressHandler}
                                         value={removeIR(value)} onChange={(e)=>{
                            stakeholderInfoChangeHandler(e)
                            onChange(e)
                        }}/>
                    )}
                />
                    <small style={{color:'red'}}>
                        {errors?.iban && errors.iban.message}
                    </small>
                </Col>
            </Row>
            <Row gutter={24} justify={'end'} className={'footer-buttons'}>
                <Col lg={3}>
                    <CustomButton type={'primary'} title={'انصراف'} onClick={cancelStakeholderHandler}/>
                </Col>
                <Col lg={3}>
                    <CustomButton type={'primary'} htmlType={'submit'}
                                  title={loadingButton ? <Spin/> : id ? 'ویرایش ذینفع' : 'ثبت ذینفع'}
                                  // onClick={createStakeholderHandler}
                    />
                </Col>
            </Row>
            </form>
        </div>
    )
}

export default AddEditUser