import {Col, Row, Select, Spin, Table, Tooltip, Form, Input, message, Popconfirm, Typography} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import CustomButton from "../Fields/CustomButton";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Delete from "../../assets/images/delete.svg";
import {useDispatch, useSelector} from "react-redux";
import {createBroker, editBroker, getBrokerById, getBrokersList} from "../../redux/slices/broker";
import List from "../../assets/images/list.svg";
import {getBranchesList} from "../../redux/slices/branches";
import {useForm, Controller} from "react-hook-form";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {onKeyPressHandler, removeIR} from "../../services/helper";
import Edit from "../../assets/images/edit.svg";


const {Option} = Select

const EditableCell = ({
                          editing,
                          dataIndex,
                          title,
                          inputType,
                          record,
                          index,
                          children,
                          ...restProps
                      }) => {
    const inputNode = <CustomTextInput suffix={dataIndex==='iban' ? 'IR':''} />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `  ${title}    اجباری است  `,
                        },
                        {...dataIndex === 'iban' && {max: 24, message: `${title} 24 رقمی است`}},
                        {...dataIndex === 'iban' && {min: 24, message: `${title} 24 رقمی است`}},
                        {pattern:/^[0-9]+$/,message:'فقط عدد مجاز است'}
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};


const AddEditBroker = (props) => {

    const [broker, setBroker] = useState({
        name: '',
        id: 0,
        code: '',
        nationalId: '',
        cif: '',
        branchName: '',
        branchCode: '',
        branchId: '',
        shamsiRegistrationDate: '',
        brokerAccounts: []
    })
    const [account, setAccount] = useState({id: '', account: '', iban: ''})
    const [loadingButton, setLoadingButton] = useState(false)
    const [pagination, setPagination] = useState({
        pageSize: 2,
        current: 1,
        position: ['bottomCenter'],
        showSizeChanger: false
    });
    const [loading, setLoading] = useState(false)
    const [validateError, setValidateError] = useState(false)

    const [form] = Form.useForm();
    const [data, setData] = useState(broker?.brokerAccounts);
    const [editingKey, setEditingKey] = useState('');
    const isEditing = (record) => record.iban === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            id: '',
            account:'',
            iban:'',
            ...record,
        });
        setEditingKey(record.iban);
    };
    const cancel = () => {
        setEditingKey('');
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            console.log('row',row)
            const newData = [...data];
            console.log('new data',newData)
            const index = newData.findIndex((item) => key === item.iban);
            console.log('index',index,newData[index])
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = data?.indexOf(record)
                return <div>{ newIndex+1 }</div>
            },
            width: 100,
        },
        {
            title: 'شماره سپرده',
            dataIndex: 'account',
            width: 150,
            editable: true,
        },
        {
            title: 'شماره شبا',
            dataIndex: 'iban',
            render: (text, record, index) => {
                if (record.iban.startsWith('IR')) {
                    return <div>{text}</div>
                } else {
                    return <div>{text}</div>
                }
            },
            width: 200,
            editable: true,
        },
        {
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <div className={'brokers-options-container'}>
                        {
                            editable ? (
                                    <div style={{display: 'flex', alignItems: 'center'}}>
                                        <div onClick={() => save(record.iban)} style={{marginLeft: 10,color:'#df3644e6',cursor:'pointer'}}>ذخیره</div>
                                        <div onClick={cancel} style={{marginLeft: 10,color:'#df3644e6',cursor:'pointer'}}>لغو</div>
                                    </div>
                                ) :
                                <>
                                    <img src={Delete} alt={'حذف'}
                                         onClick={() => removeAccountHandler(record.iban)}
                                    />
                                    <img src={Edit} alt={'ویرایش'} onClick={() => edit(record)}/>
                                </>
                        }
                    </div>
                )
            },
            width: 100
        }
    ];


    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const branchesList = useSelector(state => state.branches.branchesList)
    // const loading = useSelector((state) => state.brokers.loading)
    const brokersList = useSelector((state) => state.brokers.brokersList)

    const dispatch = useDispatch()


    const navigation = useNavigate()
    const {id} = useParams()

    const {handleSubmit, control, formState: {errors, isDirty}, setValue, reset, getValues} = useForm();


    useEffect(() => {
        dispatch(getBranchesList({}))
        if (id) {
            setLoading(true)
            setTimeout(() => {
                dispatch(getBrokerById(id)).then(res => {

                    let newBrokerAccounts= res?.payload?.brokerAccounts?.map(item=>{
                        return {...item,iban:removeIR(item.iban)}
                    })
                    setBroker({...res.payload,brokerAccounts: newBrokerAccounts})
                    setData(newBrokerAccounts)
                    setLoading(false)
                })
            }, 500)
        }
    }, [])

    useEffect(() => {
        reset(broker);
    }, [broker.name]);

    const addBrokerOnChangeHandler = (event) => {
        if (event.target.name !== 'account' || 'iban') {
            setBroker({...broker, [event.target.name]: event.target.value})
        }
    }
//////////////////////fix this //////////////////////////////////

    const addAccountOnChangeHandler = (event) => {
        if (event.target.name === 'iban' && event.target.value.length < 24) {
            setValidateError(true)
        } else if (event.target.name !== 'iban' && validateError) {
            setValidateError(true)
        } else {
            setValidateError(false)
        }
        setAccount({...account, id: 0, [event.target.name]: event.target.value})
    }


    const checkExistAccount = (accList, newAcc) => {
        for (let i = 0; i < accList.length; i++) {
            if (accList[i].account === newAcc) {
                return true
            }
        }
        return false
    }

    const checkExistIban = (accList, newIban) => {
        for (let i = 0; i < accList.length; i++) {
            if (accList[i].iban === newIban) {
                return true
            }
        }
        return false
    }

    const addAccountHandler = () => {
        if (account.account && account.iban && !validateError) {
            // account.iban = `IR${account.iban}`
            if (checkExistAccount(broker.brokerAccounts, account.account)) {
                message.error({
                    content: 'شماره سپرده تکراری است',
                    className: 'custom-message-error',
                    style: {
                        marginTop: '6%',
                    },
                    duration: 3
                })
            } else if (checkExistIban(broker.brokerAccounts, `${account.iban}`)) {
                message.error({
                    content: 'شماره شبا تکراری است',
                    className: 'custom-message-error',
                    style: {
                        marginTop: '6%',
                    },
                    duration: 3
                })
            } else {
                setBroker({...broker, brokerAccounts: [...broker.brokerAccounts, account]})
                setData( [...data, account])
                setAccount({id: '', account: '', iban: ''})
            }
        } else {
            message.error({
                content: 'شماره سپرده و شبا را وارد کنید',
                className: 'custom-message-error',
                style: {
                    marginTop: '6%',
                },
                duration: 3
            })
        }
    }

    const removeAccountHandler = (iban) => {
        const filteredAccountsList = broker.brokerAccounts.filter(item => item.iban !== iban)
        setBroker({...broker, brokerAccounts: filteredAccountsList})
        setData([...filteredAccountsList])
    }

    const createBrokerHandler = (values) => {
        setLoadingButton(true)
        if (id) {
            dispatch(editBroker(values)).then(res => {
                setLoadingButton(false)
            })
        } else {
            dispatch(createBroker(values)).then(res => {
                setLoadingButton(false)
            }).catch(e => {
            })
        }
    }

    const cancelBrokerHandler = () => {
        navigation('/brokers')
    }


    const onChangeBranchNameHandler = (value) => {
        if (value) {
            let code = ''
            let id = ''
            let newBranch = branchesList.find(item => item.name === value)
            code = newBranch.code
            id = newBranch.id
            setValue('branchCode', code)
            setBroker({...broker, branchCode: code, branchName: value, branchId: id})
        } else {
            setValue('branchCode', '')
            setBroker({...broker, branchCode: '', branchName: '', branchId: id})
        }
    };

    const onChangeBranchCodeHandler = (value) => {
        if (value) {
            let name = ''
            let id = ''
            let newBranch = branchesList.find(item => item.code === value)
            name = newBranch.name
            id = newBranch.id
            setValue('branchName', name)
            setBroker({...broker, branchCode: value, branchName: name, branchId: id})
        } else {
            setValue('branchName', '')
            setBroker({...broker, branchCode: '', branchName: '', branchId: id})
        }

    };

    const onSubmit = (values) => {
        let newValues = {...values, ...broker}
        newValues.brokerAccounts=data
        let newData = newValues.brokerAccounts.map(item => {
            return {...item, iban: item.iban.startsWith('IR') ? item.iban : `IR${item.iban}`}
        })
        if (!newValues?.brokerAccounts?.[0]?.account && !newValues?.brokerAccounts?.[0]?.iban) {
            return (
                message.error({
                    content: 'شماره سپرده و شبا را وارد کنید',
                    className: 'custom-message-error',
                    style: {
                        marginTop: '6%',
                    },
                    duration: 3
                })
            )
        } else {
            newValues.brokerAccounts = newData
            createBrokerHandler(newValues)
        }
    };

    const handleTableChange = (paginate) => {
        setPagination({...pagination, current: paginate.current})
    }

    if (loading) {
        return (
            <div className={'spinner-container'}>
                <Spin size={'large'} wrapperClassName={'spinner-container'} tip={'در حال دریافت اطلاعات'}/>
            </div>
        )
    }


    return (
        <div className={'inquiry-content-container'}>
            <ToastContainer style={{fontFamily: 'IRANSans'}}
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
                <Row gutter={[24, 24]} style={{marginBottom: '2rem'}}>
                    <Col lg={8} xl={7} xxl={4}>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            rules={{required: 'فیلد اجباری است'}}
                            render={({field: {name, onChange, value}}) => (
                                <CustomTextInput name={name} type={'text'} label={'نام شرکت کارگزار'}
                                                 value={value} onChange={(e) => {
                                    addBrokerOnChangeHandler(e)
                                    onChange(e)
                                }}/>
                            )}
                        />
                        <small style={{color: 'red'}}>
                            {errors?.name && errors.name.message}
                        </small>
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <Controller
                            name="code"
                            control={control}
                            defaultValue={broker?.code}
                            rules={{
                                pattern: {value: /^[0-9]+$/, message: 'فقط عدد مجاز است'},
                                required: 'فیلد اجباری است'
                            }}
                            render={({field: {name, onChange, value}}) => (
                                <CustomTextInput name={name} type={'text'} label={'کد کارگزاری'}
                                                 onKeyPress={onKeyPressHandler}
                                                 value={value} onChange={(e) => {
                                    addBrokerOnChangeHandler(e)
                                    onChange(e)
                                }}/>
                            )}
                        />
                        <small style={{color: 'red'}}>
                            {errors?.code && errors.code.message}
                        </small>
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <Controller
                            name="nationalId"
                            control={control}
                            defaultValue={broker?.nationalId}
                            rules={{
                                required: 'فیلد اجباری است',
                                maxLength: {value: 11, message: 'شناسه ملی باید 11 رقمی باشد'},
                                minLength: {value: 11, message: 'شناسه ملی باید 11 رقمی باشد'}
                            }}
                            render={({field: {name, onChange, value}}) => (
                                <CustomTextInput name={name} type={'text'} label={'شناسه ملی'}
                                                 onKeyPress={onKeyPressHandler}
                                                 value={value} onChange={(e) => {
                                    addBrokerOnChangeHandler(e)
                                    onChange(e)
                                }}/>
                            )}
                        />
                        <small style={{color: 'red'}}>
                            {errors?.nationalId && errors.nationalId.message}
                        </small>
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <Controller
                            name="cif"
                            control={control}
                            defaultValue=""
                            rules={{
                                pattern: {value: /^[0-9]+$/, message: 'فقط عدد مجاز است'},
                                required: 'فیلد اجباری است'
                            }}
                            render={({field: {name, onChange, value}}) => (
                                <CustomTextInput name={name} type={'text'} label={'شماره مشتری'}
                                                 onKeyPress={onKeyPressHandler}
                                                 value={value} onChange={(e) => {
                                    addBrokerOnChangeHandler(e)
                                    onChange(e)
                                }}/>
                            )}
                        />
                        <small style={{color: 'red'}}>
                            {errors?.cif && errors.cif.message}
                        </small>
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <span className={'time-picker-label'}>نام شعبه</span>
                        <Controller
                            name="branchName"
                            control={control}
                            defaultValue=''
                            rules={{required: 'فیلد اجباری است'}}
                            render={({field: {name, onChange, value}}) => (
                                <Select
                                    value={value}
                                    name={name}
                                    showSearch
                                    placeholder=""
                                    onChange={(e) => {
                                        onChange(e)
                                        onChangeBranchNameHandler(e)
                                    }}
                                    onSelect={(e) => {
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
                        <small style={{color: 'red'}}>
                            {!getValues().branchName && errors?.branchName && errors.branchName.message}
                        </small>
                    </Col>
                    <Col lg={8} xl={7} xxl={4}>
                        <span className={'time-picker-label'}>کد شعبه</span>
                        <Controller
                            name="branchCode"
                            control={control}
                            defaultValue=''
                            rules={{required: 'فیلد اجباری است'}}
                            render={({field: {name, onChange, value}}) => (
                                <Select
                                    value={value}
                                    name={name}
                                    showSearch
                                    placeholder=""
                                    onChange={(e) => {
                                        onChange(e)
                                        onChangeBranchCodeHandler(e)
                                    }}
                                    onSelect={(e) => {
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
                        <small style={{color: 'red'}}>
                            {!getValues().branchCode && errors?.branchCode && errors.branchCode.message}
                        </small>
                    </Col>
                </Row>
                <Row gutter={24} style={{marginBottom: '2rem', marginTop: '2rem'}}>
                    <Col lg={5}>
                        <div style={{fontSize: '16px', fontWeight: '500'}}>افزودن شماره سپرده</div>
                    </Col>
                </Row>
                <Row gutter={24} style={{marginBottom: '1rem'}}>
                    <Col lg={8} xl={7} xxl={4} style={{marginBottom:'1rem'}}>
                        <CustomTextInput name={'account'} type={'text'} label={'شماره سپرده'}
                                         value={account?.account} onKeyPress={onKeyPressHandler}
                                         onChange={addAccountOnChangeHandler}/>
                    </Col>
                    <Col lg={7} xl={7} xxl={4}>
                        <CustomTextInput suffix={'IR'} name={'iban'} type={'text'} label={'شماره شبا'} maxLength={24}
                                         value={account?.iban} onKeyPress={onKeyPressHandler}
                                         onChange={addAccountOnChangeHandler}/>
                        {validateError && <small style={{color: 'red'}}>شماره شبا 24 رقمی است</small>}
                    </Col>
                    <Tooltip title={'افزودن سپرده'}> <Col lg={2}>
                        <CustomButton type={'primary'}
                                      onClick={addAccountHandler}
                                      title={<span style={{fontSize: '27px', fontWeight: 'bold'}}>+</span>}/>
                    </Col></Tooltip>
                    <Col lg={24} xxl={13}>
                        <Form form={form} component={false}>
                            <Table
                                components={{
                                    body: {
                                        cell: EditableCell,
                                    },
                                }}
                                rowClassName="editable-row"
                                columns={mergedColumns}
                                dataSource={data}
                                loading={loading}
                                locale={{emptyText: 'داده ای وجود ندارد'}}
                                rowKey={'id'}
                                pagination={pagination}
                                scroll={{x: 'max-content'}}
                                onChange={handleTableChange}
                            />
                        </Form>
                        <h4>تعداد قابل نمایش: {2}</h4>
                    </Col>
                </Row>
                <Row gutter={24} justify={"end"} className={'footer-buttons'}>
                    <Col lg={4} xl={4} xxl={3}>
                        <CustomButton type={'primary'} title={'انصراف'} onClick={cancelBrokerHandler}/>
                    </Col>
                    <Col lg={4} xl={4} xxl={3}>
                        <CustomButton type={'primary'} htmlType={'submit'}
                                      title={loadingButton ? <Spin/> : id ? 'ویرایش کارگزاری' : 'ثبت کارگزاری'}
                            // onClick={createBrokerHandler}
                        />
                    </Col>
                </Row>
            </form>
        </div>
    )
}

export default AddEditBroker