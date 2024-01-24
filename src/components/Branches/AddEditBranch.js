import {Col, Empty, message, Row, Select, Spin, Table, Tooltip} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createBroker, getBrokerById, getBrokersList} from "../../redux/slices/broker";
import {createBranch, editBranch, getBranchById} from "../../redux/slices/branches";
import { useForm, Controller } from "react-hook-form";
import {ToastContainer} from "react-toastify";
import {onKeyPressHandler} from "../../services/helper";

const AddEditBranch = (props) => {

    const [branch, setBranch] = useState({id:0,name: '', code: '', phone: '',address:''})
    const [loadingButton, setLoadingButton] = useState(false)
    const [loading, setLoading] = useState(false)

    // const loading = useSelector((state) => state.branches.loading)


    const dispatch = useDispatch()


    const navigation = useNavigate()
    const {id} = useParams()

    const { handleSubmit, control, formState:{errors,isDirty} , setValue, reset } = useForm(
        {defaultValues:{
                id:0,name: '', code: '', phone: '',address:''
            }}
    );


    useEffect(() => {
        if (id) {
            setLoading(true)
            setTimeout(()=>{
            dispatch(getBranchById(id)).then(res=>{
                setBranch(res.payload)
                setLoading(false)
            })
            },500)
        }
    }, [])

    useEffect(() => {
        if (branch?.name) {
            reset(branch);
        }
    }, [branch?.name]);

    const addBranchOnChangeHandler = (e) => {
        setBranch({...branch,[e.target.name]:e.target.value})
    }

    const cancelBranchHandler = () => {
        navigation('/branches')
    }

    const createBranchHandler = () => {
        setLoadingButton(true)
        if (id){
            dispatch(editBranch(branch)).then(()=>setLoadingButton(false))
        }else{
            dispatch(createBranch(branch)).then(()=>setLoadingButton(false))
        }
    }

    const onSubmit = (values) => {
        createBranchHandler(values)
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
            <form onSubmit={handleSubmit(onSubmit)}>
            <Row gutter={[24,24]} style={{marginBottom: '2rem'}}>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        rules={{required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'نام شعبه'}
                                             value={value} onChange={(e)=>{
                                addBranchOnChangeHandler(e)
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
                        name="code"
                        control={control}
                        defaultValue=""
                        rules={{pattern:{value:/^[0-9]+$/,message:'فقط عدد مجاز است'},required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'کد شعبه'}
                                             onKeyPress={onKeyPressHandler}
                                             value={value} onChange={(e)=>{
                                addBranchOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.code && errors.code.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={4}>
                    <Controller
                        name="phone"
                        control={control}
                        defaultValue=""
                        rules={{pattern:{value:/^0[0-9]{2}[0-9]{8}$/,message:'تلفن نامعتبر است'},required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'تلفن (همراه با کد استان)'}
                                             onKeyPress={onKeyPressHandler}
                                             value={value} onChange={(e)=>{
                                addBranchOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.phone && errors.phone.message}
                    </small>
                </Col>
                <Col lg={8} xl={7} xxl={6}>
                    <Controller
                        name="address"
                        control={control}
                        defaultValue=""
                        rules={{required:'فیلد اجباری است'}}
                        render={({ field:{name,onChange,value} }) => (
                            <CustomTextInput name={name} type={'text'} label={'آدرس'}
                                             value={value} onChange={(e)=>{
                                addBranchOnChangeHandler(e)
                                onChange(e)
                            }}/>
                        )}
                    />
                    <small style={{color:'red'}}>
                        {errors?.address && errors.address.message}
                    </small>
                </Col>
            </Row>
            <Row gutter={24} justify={'end'} className={'footer-buttons'}>
                <Col lg={3}>
                    <CustomButton type={'primary'} title={'انصراف'} onClick={cancelBranchHandler}/>
                </Col>
                <Col lg={3}>
                    <CustomButton type={'primary'} htmlType={'submit'}
                                  title={loadingButton ? <Spin/> : id ? 'ویرایش شعبه' : 'ثبت شعبه'}
                                  // onClick={createBrokerHandler}
                    />
                </Col>
            </Row>
            </form>
        </div>
    )
}

export default AddEditBranch