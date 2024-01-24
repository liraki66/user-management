import {Button, Col, Empty, message, Row, Select, Spin, Table, TimePicker, Tooltip} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import List from "../../assets/images/list.svg";
import moment from "moment";
import CustomButton from "../Fields/CustomButton";
import Delete from "../../assets/images/delete.svg";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {
    BrokerSettlementBaseUrl,
    CreateContract,
    EditContract,
    GetBrokerList, GetContractById,
    GetMarketList
} from "../../services/constants";
import {v4 as uuidv4} from "uuid";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import dayjs from "dayjs";

const ContractDetail = (props)=>{

    const [contractInfo, setContractInfo] = useState(
        {
            marketType: '',
            contractNumber: '',
            brokerId: '',
            brokerAccount: '',
            brokerIban: '',
            samatAccount: '',
            samatIban: '',
            bankAccount: '',
            bankIban: '',
            maxSamatSettlementHour: '',
            loanPercentage: '',
            penaltyOfContractDto: []
        }
    )
    const [loading, setLoading] = useState(false)
    const [loadingButton, setLoadingButton] = useState(false)
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState({current: 1, pageSize: 3, position: ['bottomCenter']});
    const [openSamatPicker, setOpenSamatPicker] = useState()
    const [openFromPicker, setOpenFromPicker] = useState()
    const [openEndPicker, setOpenEndPicker] = useState()
    const [samatTime, setSamatTime] = useState('')
    const [fromTime, setFromTime] = useState('')
    const [endTime, setEndTime] = useState('')
    const [penalty, setPenalty] = useState('')
    const [timePenaltyList, setTimePenaltyList] = useState([])
    const [marketsList, setMarketsList] = useState([])
    const [brokersList, setBrokersList] = useState([])

    const navigation = useNavigate()
    const {id} = useParams()
    const {Option} = Select;
    const format = 'HH:mm';

    useEffect(() => {
        fetchMarketsList()
        fetchBrokersList()
        if (id) {
            fetchContractById()
        }
    }, [])

    const fetchContractById=()=>{
        axios.get(GetContractById+`?id=${id}`,{baseURL:BrokerSettlementBaseUrl})
            .then(res=>{
                setContractInfo(res.data)
            })
            .catch(e=>{

            })
    }

    const fetchMarketsList = () => {
        axios.post(GetMarketList, {}, {baseURL: BrokerSettlementBaseUrl})
            .then(res => setMarketsList(res.data))
            .catch(e => console.log(e))
    }

    const fetchBrokersList = () => {
        axios.post(GetBrokerList, {}, {baseURL: BrokerSettlementBaseUrl})
            .then(res => setBrokersList(res.data.brokerList))
            .catch(e => console.log(e))
    }

    const registerContractItemsChangeHandler = (event) => {
        setContractInfo({
            ...contractInfo,
            [event.target.name]: event.target.value
        })
    }

    const samatPickerFooterHandler = () => {
        return (
            <div style={{textAlign: 'center'}}>
                <Button type={'primary'} size={'small'} onClick={() => setOpenSamatPicker(false)}>تایید</Button>
            </div>
        )
    }

    const fromPickerFooterHandler = () => {
        return (
            <div style={{textAlign: 'center'}}>
                <Button type={'primary'} size={'small'} onClick={() => setOpenFromPicker(false)}>تایید</Button>
            </div>
        )
    }

    const endPickerFooterHandler = () => {
        return (
            <div style={{textAlign: 'center'}}>
                <Button type={'primary'} size={'small'} onClick={() => setOpenEndPicker(false)}>تایید</Button>
            </div>
        )
    }

    const selectSamatTimeHandler = (time) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");
        setContractInfo({...contractInfo, maxSamatSettlementHour: timeString})
        setSamatTime(timeString);
    }

    const selectFromTimeHandler = (time) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");
        setFromTime(timeString);
    }

    const selectEndTimeHandler = (time) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");
        setEndTime(timeString);
    }

    const changePenaltyHandler = (event) => {
        setPenalty(event.target.value)
    }

    const addTimePenaltyHandler = () => {
        if (penalty && fromTime && endTime) {
            let penaltyObj = {
                uuid: uuidv4(),
                fromHour: fromTime,
                toHour: endTime,
                addedPenaltyPercentage: penalty
            }
            setTimePenaltyList([...timePenaltyList, penaltyObj])
            setContractInfo({...contractInfo, penaltyOfContractDto: [...contractInfo.penaltyOfContractDto, penaltyObj]})
        }
        setFromTime('')
        setEndTime('')
        setPenalty('')
    }

    const removeTimePenaltyHandler = (id) => {
        const newTimePenaltyList = contractInfo.penaltyOfContractDto.filter(item => {
            return item.uuid !== id
        })
        setTimePenaltyList(newTimePenaltyList)
        setContractInfo({...contractInfo, penaltyOfContractDto: newTimePenaltyList})
    }

    const registerContractSubmitHandler = () => {
        setLoading(true)
        setLoadingButton(true)
        let initContractInfo = {
            marketType: '',
            contractNumber: '',
            brokerId: '',
            brokerAccount: '',
            brokerIban: '',
            samatAccount: '',
            samatIban: '',
            bankAccount: '',
            bankIban: '',
            maxSamatSettlementHour: '',
            loanPercentage: '',
            penaltyOfContractDto: []
        }
        axios.post(id ? EditContract : CreateContract, contractInfo, {baseURL: BrokerSettlementBaseUrl})
            .then(res => {
                setContractInfo(initContractInfo)
                setSamatTime('')
                setTimePenaltyList([])
                message.success({
                    content: id ? 'قرارداد با موفقیت ویرایش شد' : 'قرارداد با موفقیت ثبت شد',
                    className: 'custom-message-success',
                    style: {
                        marginTop: '6%',
                    },
                    duration: 3
                })
                navigation('/contracts')
            })
            .catch(e => {
                // setContractInfo(initContractInfo)
                message.error({
                    content: e.response.data.FaErrorMessage,
                    className: 'custom-message-error',
                    style: {
                        marginTop: '6%',
                    },
                    duration: 3
                })
            })
            .finally(() => {
                setLoading(false)
                setLoadingButton(false)
            })
    }


    const onChangeBrokerNameHandler = (value) => {
        let selectedBrokerCode = ''
        let selectedBrokerName = ''
        selectedBrokerCode = brokersList.find(item => item.brokerId === value)?.brokerCode
        selectedBrokerName = brokersList.find(item => item.brokerId === value)?.brokerName
        setContractInfo({...contractInfo, brokerId: value, brokerCode: selectedBrokerCode,brokerName:selectedBrokerName})
    };

    const onChangeBrokerCodeHandler = (value) => {
        let selectedBrokerId = ''
        let selectedBrokerName = ''
        selectedBrokerId = brokersList.find(item => item.brokerCode === value)?.brokerId
        selectedBrokerName = brokersList.find(item => item.brokerCode === value)?.brokerName
        setContractInfo({...contractInfo, brokerId: selectedBrokerId,brokerCode:value, brokerName: selectedBrokerName})
    };

    const onChangeMarketHandler = (value) => {
        setContractInfo({...contractInfo, marketType: value})
    }

    return (
        <div className={'inquiry-content-container'}>
            <Row gutter={24} style={{marginBottom: '2rem'}}>
                <Col lg={4}>
                    <CustomTextInput name={'contractNumber'} type={'text'} label={'شماره قرارداد'}
                                     value={contractInfo.contractNumber} onChange={registerContractItemsChangeHandler} readOnly/>
                </Col>
                <Col lg={4}>
                    <span className={'time-picker-label'}>نام شرکت کارگزار</span>
                    <Select
                        value={contractInfo?.brokerName}
                        showSearch
                        placeholder=""
                        onChange={onChangeBrokerNameHandler}
                        notFoundContent={<Empty description={<div>موردی یافت نشد</div>}/>}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {brokersList?.map(item => <Option value={item.brokerId}
                                                          key={item.brokerId}>{item.brokerName}</Option>)}
                    </Select>
                </Col>
                <Col lg={4}>
                    <span className={'time-picker-label'}>کد کارگزاری</span>
                    <Select
                        value={contractInfo?.brokerCode}
                        showSearch
                        placeholder=""
                        onChange={onChangeBrokerCodeHandler}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {brokersList?.map(item => <Option value={item.brokerCode}
                                                          key={item.brokerCode}>{item.brokerCode}</Option>)}
                    </Select>
                </Col>
                <Col lg={4}>
                    <span className={'time-picker-label'}>نوع بازار</span>
                    <Select
                        value={contractInfo.marketType}
                        showSearch
                        placeholder=""
                        onChange={onChangeMarketHandler}
                        suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
                    >
                        {marketsList?.map(item => <Option value={item.marketName}
                                                          key={item.marketName}>{item.marketFaName}</Option>)}
                    </Select>
                </Col>
                <Col lg={4}>
                    <CustomTextInput name={'brokerAccount'} type={'text'} label={'شماره سپرده'}
                                     value={contractInfo.brokerAccount} onChange={registerContractItemsChangeHandler}/>
                </Col>
                <Col lg={4}>
                    <CustomTextInput name={'brokerIban'} type={'text'} label={'شماره شبا'}
                                     value={contractInfo.brokerIban}
                                     onChange={registerContractItemsChangeHandler}/>
                </Col>
            </Row>
            <Row gutter={24} style={{marginBottom: '2rem'}}>
                <Col lg={4}>
                    <CustomTextInput name={'samatAccount'} type={'text'} label={'شماره سپرده سمات'}
                                     value={contractInfo.samatAccount} onChange={registerContractItemsChangeHandler}/>
                </Col>
                <Col lg={4}>
                    <CustomTextInput name={'samatIban'} type={'text'} label={'شماره شبای سمات'}
                                     value={contractInfo.samatIban} onChange={registerContractItemsChangeHandler}/>
                </Col>
                <Col lg={4}>
                    <CustomTextInput name={'bankAccount'} type={'text'} label={'شماره سپرده سرفصل بدهکاران'}
                                     value={contractInfo.bankAccount} onChange={registerContractItemsChangeHandler}/>
                </Col>
                <Col lg={4}>
                    <CustomTextInput name={'bankIban'} type={'text'} label={'شماره شبای سرفصل بدهکاران'}
                                     value={contractInfo.bankIban} onChange={registerContractItemsChangeHandler}/>
                </Col>
                <Col lg={4}>
                    <span className={'time-picker-label'}>{'ساعت تسویه با سمات'}</span>
                    <TimePicker format={format} placeholder={''} onSelect={selectSamatTimeHandler}
                                style={{width: '100%'}}
                                value={contractInfo?.maxSamatSettlementHour ? moment(contractInfo?.maxSamatSettlementHour, "HH:mm") : null}
                                allowClear={false}
                                renderExtraFooter={samatPickerFooterHandler} open={openSamatPicker}
                                onFocus={() => setOpenSamatPicker(true)}
                                onBlur={() => setOpenSamatPicker(false)}
                                inputReadOnly={true}
                    />
                </Col>
                <Col lg={4}>
                    <CustomTextInput name={'loanPercentage'} type={'text'} label={'درصد سود تسهیلات'}
                                     value={contractInfo.loanPercentage} onChange={registerContractItemsChangeHandler}/>
                </Col>
            </Row>
            {/*<Row gutter={24} style={{marginBottom: '3rem'}}>*/}
            {/*    <Col lg={3}>*/}
            {/*        <h3>مهلت تسویه با بانک</h3>*/}
            {/*    </Col>*/}
            {/*    <Col lg={2}>*/}
            {/*        <span className={'time-picker-label'}>{'از ساعت'}</span>*/}
            {/*        <TimePicker format={format} placeholder={''} onSelect={selectFromTimeHandler}*/}
            {/*                    value={fromTime ? moment(fromTime, "HH:mm") : null} allowClear={false}*/}
            {/*                    renderExtraFooter={fromPickerFooterHandler} open={openFromPicker}*/}
            {/*                    onFocus={() => setOpenFromPicker(true)}*/}
            {/*                    onBlur={() => setOpenFromPicker(false)}*/}
            {/*                    inputReadOnly={true}*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*    <Col lg={2}>*/}
            {/*        <span className={'time-picker-label'}>{'تا ساعت'}</span>*/}
            {/*        <TimePicker format={format} placeholder={''} onSelect={selectEndTimeHandler}*/}
            {/*                    value={endTime ? moment(endTime, "HH:mm") : null} allowClear={false}*/}
            {/*                    renderExtraFooter={endPickerFooterHandler} open={openEndPicker}*/}
            {/*                    onFocus={() => setOpenEndPicker(true)}*/}
            {/*                    onBlur={() => setOpenEndPicker(false)}*/}
            {/*                    inputReadOnly={true}*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*    <Col lg={3}>*/}
            {/*        <CustomTextInput name={'addedPenaltyPercentage'} type={'text'} label={'درصد افزایش جریمه'}*/}
            {/*                         value={penalty} onChange={changePenaltyHandler}/>*/}
            {/*    </Col>*/}
            {/*    <Tooltip title={'افزودن مهلت'}> <Col lg={2}>*/}
            {/*        <CustomButton type={'primary'}*/}
            {/*                      onClick={addTimePenaltyHandler}*/}
            {/*                      title={<span style={{fontSize: '27px', fontWeight: 'bold'}}>+</span>}/>*/}
            {/*    </Col></Tooltip>*/}
                {/*<Col lg={9}>*/}
                {/*    <Row className={'contracts-times-container'}>*/}
                {/*        {contractInfo?.penaltyOfContractDto?.map(item => {*/}
                {/*            return (*/}
                {/*                <Col lg={12} key={item.id}>*/}
                {/*                    <span>از ساعت {item.fromHour} تا ساعت {item.toHour} با {item.addedPenaltyPercentage} درصد</span>*/}
                {/*                    <img src={Delete} className={'contracts-times-icon'} alt={'حذف'}*/}
                {/*                         onClick={() => removeTimePenaltyHandler(item.uuid)}/>*/}
                {/*                </Col>*/}
                {/*            )*/}
                {/*        })}*/}
                {/*    </Row>*/}
                {/*</Col>*/}
            {/*</Row>*/}
        </div>
    )
}

export default ContractDetail