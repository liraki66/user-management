import {Button, Col, Empty, message, Row, Select, Spin, Table, TimePicker, Tooltip, Collapse, Checkbox} from "antd";
import CustomTextInput from "../Fields/CustomTextInput";
import List from "../../assets/images/list.svg";
import moment from "moment";
import CustomButton from "../Fields/CustomButton";
import Delete from "../../assets/images/delete.svg";
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import {DatePicker as DatePickerJalali, JalaliLocaleListener} from "antd-jalali";
import locale from "antd/es/date-picker/locale/fa_IR";
import DateLogo from "../../assets/images/date.svg";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import {getBrokerById, getBrokersList} from "../../redux/slices/broker";
import {getBranchesList} from "../../redux/slices/branches";
import {
    createContract,
    editContract,
    finalTerminateContract, firstTerminateContract,
    getContractById,
    getContractStatus
} from "../../redux/slices/contract";
import {getMarketsList} from "../../redux/slices/broker-settlement";
import {getStakeholdersList} from "../../redux/slices/stakeholders";
import CustomSelect from "../Fields/CustomSelect";
import CustomTimePicker from "../Fields/CustomTimePicker";
import {useForm, Controller} from "react-hook-form";
import {toast, ToastContainer} from "react-toastify";
import {onKeyPressHandler, removeIR} from "../../services/helper";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import jwt_decode from "jwt-decode";

const {Panel} = Collapse;
const {Option} = Select;

const AddEditContract = (props) => {

    dayjs.calendar('jalali');
    dayjs.extend(isSameOrAfter)
    dayjs.extend(isSameOrBefore)

    const [contractInfo, setContractInfo] = useState(
        {
            id: 0,
            contractNumber: "",
            brokerId: 0,
            brokerName: "",
            brokerCode: "",
            bankDebtorsName:"",
            bankDebtorsCode:"",
            brokerAccountId: 0,
            brokerAccount: "",
            brokerIban: "",
            branchId: 0,
            branchCode: "",
            branchName: "",
            startDate: "",
            expirationDate: "",
            marketId: 0,
            marketFaName: "",
            minInquiryHour: "",
            maxInquiryHour: "",
            bankSettlementScope: false,
            inquiryCyclePerHour: '',
            minBankSettlementHour: '',
            maxBankSettlementHour: '',
            bankSettlementCyclePerHour: '',
            minStakeholderSettlementHour: '',
            maxStakeholderSettlementHour: '',
            stakeholderSettlementCyclePerHour: '',
            endOfWorkingHour: "",
            maxSettlementHour: "",
            maxNumberOfLoanDays: 0,
            stakeHolderId: 0,
            stakeHolderName: "",
            stakeHolderAccount: "",
            stakeHolderIban: "",
            bankDebtorsCif: "",
            bankDebtorsAccount: "",
            bankDebtorsIban: "",
            loanPercentage: "",
            terminationLetterNumber: "",
            // status: "Active",
            penaltiesOfContract: [],
        }
    )
    const [firstTerminateInfo, setFirstTerminateInfo] = useState({
        loanId: 0,
        contractId: 0,
        initialTerminationUserId: 0,
        initialTerminationLetterNumber: "",
        initialTerminationLetterDate: ""
    })
    const [finalTerminateInfo, setFinalTerminateInfo] = useState({
        loanId: 0,
        contractId: 0,
        initialTerminationUserId: 0,
        finalTerminationLetterNumber: "",
        finalTerminationLetterDate: ""
    })
    const [loading, setLoading] = useState(false)
    const [loadingButton, setLoadingButton] = useState(false)
    const [pagination, setPagination] = useState({pageSize: 2, position: ['bottomCenter'], showSizeChanger: false});
    const [penalty, setPenalty] = useState('')
    const [timePenaltyList, setTimePenaltyList] = useState([])
    const [isOpenTimePicker, setIsOpenTimePicker] = useState({
        minInquiryHour: false,
        maxInquiryHour: false,
        minBankSettlementHour: false,
        maxBankSettlementHour: false,
        minStakeholderSettlementHour: false,
        maxStakeholderSettlementHour: false,
        fromHour: false,
        finalTerminateHour: false,
        firstTerminateHour: false
    })
    const [fromHour, setFromHour] = useState(null)
    const [showFirstTerminate, setShowFirstTerminate] = useState(false)
    const [showFinalTerminate, setShowFinalTerminate] = useState(false)

    const brokersList = useSelector(state => state.brokers.brokersList)
    const brokerAccountsList = useSelector(state => state.brokers.brokerInfo.brokerAccounts)
    const branchesList = useSelector(state => state.branches.branchesList)
    const marketsList = useSelector(state => state.brokerSettlement.marketsList)
    const stakeholdersList = useSelector(state => state.stakeholders.stakeholdersList)
    const contractStatus = useSelector(state => state.contracts.contractStatus)
    const user = useSelector(state => state.auth?.decodedUserInfo)
    const userDecoded =  jwt_decode(localStorage.getItem('access_token'))

    const navigation = useNavigate()
    const {id, loanId} = useParams()
    const location = useLocation()
    const dispatch = useDispatch()
    const format = 'HH:mm';

    const {handleSubmit, control, formState: {errors, isDirty, isValid}, setValue, getValues, reset, watch} = useForm();


    const columns = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = contractInfo?.penaltiesOfContract?.indexOf(record)
                return <div>{newIndex + 1}</div>
            },
            width: 100
        },
        {
            title: 'زمان بررسی',
            dataIndex: 'fromHour',
            width: 150
        },
        {
            title: 'نرخ اعتبار دهی',
            dataIndex: 'addedPenaltyPercentage',
            width: 100
        },
        {
            render: (text, record, index) => {
                return (
                    <div className={'brokers-options-container'}>
                        <img src={Delete} alt={'حذف'}
                             onClick={() => removeTimePenaltyHandler(record.id !== 0 ? record.id : record.uuid)}/>
                    </div>
                )
            },
            width: 50
        }
    ];

    const columnsTerminationContract = [
        {
            title: 'ردیف',
            render: (text, record, index) => {
                const newIndex = contractInfo?.contractCancellations?.indexOf(record)
                return <div>{newIndex + 1}</div>
            },
            width: 100
        },
        {
            title: 'شماره نامه',
            dataIndex: 'letterNumber',
            render: (text, record, index) => {
                if (record.letterNumber) {
                    return record.letterNumber
                } else {
                    return <div>-</div>
                }
            },
        },
        {
            title: 'تاریخ',
            dataIndex: 'letterDate',
            render: (text, record, index) => {
                if (record.letterDate) {
                    return record.letterDate
                } else {
                    return <div>-</div>
                }
            },
        },
        {
            title: 'ساعت ',
            dataIndex: 'letterTime',
            render: (text, record, index) => {
                if (record.letterTime) {
                    return record.letterTime
                } else {
                    return <div>-</div>
                }
            },
        },
        {
            title: 'کاربر درخواست کننده',
            dataIndex: 'userName',
            render: (text, record, index) => {
                if (record.userName) {
                    return record.userName
                } else {
                    return <div>-</div>
                }
            },
        },
        {
            title: 'وضعیت',
            dataIndex: 'cancellationStatus',
            width: 150
        },
    ]


    useEffect(() => {
        dispatch(getMarketsList())
        dispatch(getBranchesList({}))
        dispatch(getBrokersList({}))
        dispatch(getStakeholdersList({}))
        dispatch(getContractStatus())
        if (id) {
            setLoading(true)
            setTimeout(() => {
                dispatch(getContractById(id)).then(res => {
                    let newPenaltiesOfContract = res?.payload?.penaltiesOfContract?.map(item => {
                        return {...item, uuid: uuidv4()}
                    })
                    setContractInfo({
                        ...res.payload,
                        bankDebtorsIban: removeIR(res?.payload?.bankDebtorsIban),
                        penaltiesOfContract: newPenaltiesOfContract
                    })
                    setLoading(false)
                })
            }, 500)
        }
    }, [])

    useEffect(() => {
        if (contractInfo?.brokerId) {
            dispatch(getBrokerById(contractInfo?.brokerId))
            reset(contractInfo)
        } else {
            reset(contractInfo)
        }
    }, [contractInfo])

    const registerContractItemsChangeHandler = (event) => {
        setContractInfo({
            ...contractInfo,
            [event.target.name]: event.target.value
        })
    }

    const notifyInquirySettlementTime = () => toast.error('ساعت تسویه نمی تواند کم تر از ساعت استعلام باشد');
    const notifyInquiryWorkingTime = () => toast.error('ساعت پایانی نمی تواند کم تر از ساعت استعلام باشد');
    const notifySettlementWorkingTime = () => toast.error('ساعت تسویه نمی تواند بزرگتر از از ساعت پایانی باشد');

    const notifyTime = () => toast.error('ساعت شروع نمی تواند از ساعت پایان بزرگتر باشد')

    const selectTimeHandler = (time, name) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");

        if (name === 'minInquiryHour' && contractInfo.maxInquiryHour) {
            if (Number(timeString.slice(0, 2)) > Number(contractInfo.maxInquiryHour.slice(0, 2))) {
                notifyTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        } else if (name === 'minInquiryHour' && !contractInfo.maxInquiryHour) {
            setContractInfo({...contractInfo, [name]: timeString})
        }

        if (name === 'maxInquiryHour' && contractInfo.minInquiryHour) {
            if (Number(contractInfo.minInquiryHour.slice(0, 2)) > Number(timeString.slice(0, 2))) {
                notifyTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        } else if (name === 'maxInquiryHour' && !contractInfo.minInquiryHour) {
            setContractInfo({...contractInfo, [name]: timeString})
        }


        if (name === 'minBankSettlementHour' && contractInfo.maxBankSettlementHour) {
            if (Number(timeString.slice(0, 2)) > Number(contractInfo.maxBankSettlementHour.slice(0, 2))) {
                notifyTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        } else if (name === 'minBankSettlementHour' && !contractInfo.maxBankSettlementHour) {
            setContractInfo({...contractInfo, [name]: timeString})
        }

        if (name === 'maxBankSettlementHour' && contractInfo.minBankSettlementHour) {
            if (Number(contractInfo.minBankSettlementHour.slice(0, 2)) > Number(timeString.slice(0, 2))) {
                notifyTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        } else if (name === 'maxBankSettlementHour' && !contractInfo.minBankSettlementHour) {
            setContractInfo({...contractInfo, [name]: timeString})
        }


        if (name === 'minStakeholderSettlementHour' && contractInfo.maxStakeholderSettlementHour) {
            if (Number(timeString.slice(0, 2)) > Number(contractInfo.maxStakeholderSettlementHour.slice(0, 2))) {
                notifyTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        } else if (name === 'minStakeholderSettlementHour' && !contractInfo.maxStakeholderSettlementHour) {
            setContractInfo({...contractInfo, [name]: timeString})
        }

        if (name === 'maxStakeholderSettlementHour' && contractInfo.minStakeholderSettlementHour) {
            if (Number(contractInfo.minStakeholderSettlementHour.slice(0, 2)) > Number(timeString.slice(0, 2))) {
                notifyTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        } else if (name === 'maxStakeholderSettlementHour' && !contractInfo.minStakeholderSettlementHour) {
            setContractInfo({...contractInfo, [name]: timeString})
        }

        if (name === 'maxInquiryHour') {
            if (contractInfo.minStakeholderSettlementHour && Number(contractInfo.minStakeholderSettlementHour.slice(0, 2)) < Number(timeString.slice(0, 2))) {
                notifyInquirySettlementTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else if (contractInfo.endOfWorkingHour && Number(contractInfo.endOfWorkingHour.slice(0, 2)) < Number(timeString.slice(0, 2))) {
                notifyInquiryWorkingTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        }

        if (name === 'minStakeholderSettlementHour') {
            if (contractInfo.maxInquiryHour && Number(contractInfo.maxInquiryHour.slice(0, 2)) > Number(timeString.slice(0, 2))) {
                notifyInquirySettlementTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else if (contractInfo.minBankSettlementHour && Number(contractInfo.minBankSettlementHour.slice(0, 2)) < Number(timeString.slice(0, 2))) {
                notifySettlementWorkingTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        }

        if (name === 'minBankSettlementHour') {
            if (contractInfo.maxStakeholderSettlementHour && Number(contractInfo.maxStakeholderSettlementHour.slice(0, 2)) > Number(timeString.slice(0, 2))) {
                notifySettlementWorkingTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else if (contractInfo.maxInquiryHour && Number(contractInfo.maxInquiryHour.slice(0, 2)) > Number(timeString.slice(0, 2))) {
                notifyInquiryWorkingTime()
                setContractInfo({...contractInfo, [name]: ''})
            } else {
                setContractInfo({...contractInfo, [name]: timeString})
            }
        }

    }

    const changeInquiryCycleHandler = (e) => {
        setContractInfo({...contractInfo, inquiryCyclePerHour: e.target.value})
    }

    const changeBankSettlementCycleHandler = (e) => {
        setContractInfo({...contractInfo, bankSettlementCyclePerHour: e.target.value})
    }

    const changeStakeholderSettlementCycleHandler = (e) => {
        setContractInfo({...contractInfo, stakeholderSettlementCyclePerHour: e.target.value})
    }


    const selectFirstTerminateHourHandler = (time, name) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");
        setFirstTerminateInfo({...firstTerminateInfo, [name]: timeString})
    }

    const selectFinalTerminateHourHandler = (time, name) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");
        setFinalTerminateInfo({...finalTerminateInfo, [name]: timeString})
    }

    const timePickerShowOnBlurHandler = (name) => {
        setIsOpenTimePicker({...isOpenTimePicker, [name]: false})
    }

    const timePickerShowOnFocusHandler = (name) => {
        setIsOpenTimePicker({...isOpenTimePicker, [name]: true})
    }

    const fromPickerFooterHandler = (name) => {
        return (
            <div style={{textAlign: 'center'}}>
                <Button type={'primary'} size={'small'}
                        onClick={() => setIsOpenTimePicker({...isOpenTimePicker, [name]: false})}>تایید</Button>
            </div>
        )
    }

    const selectFromHourHandler = (time) => {
        const timeString = moment(time).locale('en-US').format("HH:mm");
        const duplicateItem = timePenaltyList.find(item =>item.fromHour === timeString) || contractInfo?.penaltiesOfContract?.find(item =>item.fromHour === timeString)
        if (!duplicateItem) {
            setFromHour(timeString)
        }else {
            setFromHour('')
            toast.error('زمان بررسی انتخاب شده تکراری است')
        }

    }

    const changePenaltyHandler = (event) => {
        setPenalty(event.target.value)
    }


    const addTimePenaltyHandler = () => {
        if (penalty) {
            let penaltyObj = {
                id: 0,
                uuid: uuidv4(),
                fromHour: fromHour,
                addedPenaltyPercentage: penalty
            }
            setTimePenaltyList([...timePenaltyList, penaltyObj])
            setContractInfo({...contractInfo, penaltiesOfContract: [...contractInfo.penaltiesOfContract, penaltyObj]})
        }
        setPenalty('')
        setFromHour('')
    }

    const removeTimePenaltyHandler = (id) => {
        const newTimePenaltyList = contractInfo.penaltiesOfContract.filter(item => {
            if (typeof id === 'number') {
                return item.id !== id
            } else {
                return item.uuid !== id
            }
        })
        setTimePenaltyList(newTimePenaltyList)
        setContractInfo({...contractInfo, penaltiesOfContract: newTimePenaltyList})
    }

    const registerContractSubmitHandler = () => {
        setLoadingButton(true)
        let newIban = contractInfo.bankDebtorsIban.includes('IR') ? contractInfo.bankDebtorsIban : `IR${contractInfo.bankDebtorsIban}`
        if (id) {
            dispatch(editContract({...contractInfo, bankDebtorsIban: newIban})).then(() => {
                setLoadingButton(false)
            })
        } else {
            dispatch(createContract({...contractInfo, bankDebtorsIban: newIban})).then(() => {
                setLoadingButton(false)
            })
        }
    }


    const onChangeBrokerNameCodeHandler = (value, name) => {
        let newBroker = name === 'brokerName' ? brokersList.find(item => item.name === value) : brokersList.find(item => item.code === value)
        setValue('brokerCode', newBroker.code)
        setValue('brokerName', newBroker.name)
        setContractInfo({
            ...contractInfo,
            brokerId: newBroker.id,
            brokerCode: newBroker.code,
            brokerName: newBroker.name,
            brokerAccount: '',
            brokerIban: ''
        })
        dispatch(getBrokerById(newBroker.id))
    };

    const onChangeBrokerAccountIbanHandler = (value, name) => {
        let newAccount = name === 'brokerAccount' ? brokerAccountsList.find(item => item.account === value) : brokerAccountsList.find(item => item.iban === value)
        setValue('brokerAccount', newAccount?.account)
        setValue('brokerIban', newAccount?.iban)
        setContractInfo({
            ...contractInfo,
            brokerAccountId: newAccount.id,
            brokerAccount: newAccount?.account,
            brokerIban: newAccount?.iban
        })
    }

    const onChangeStakeholderAccountIbanHandler = (value, name) => {
        let newAccount = name === 'stakeHolderAccount' ? stakeholdersList.find(item => item.account === value) : stakeholdersList.find(item => item.iban === value)
        setValue('stakeHolderAccount', newAccount.account)
        setValue('stakeHolderIban', newAccount.iban)
        setContractInfo({
            ...contractInfo,
            stakeHolderId: newAccount.id,
            stakeHolderAccount: newAccount.account,
            stakeHolderIban: newAccount.iban
        })
    }

    const onChangeBranchNameCodeHandler = (value, name) => {
        let newBranch = name === 'branchName' ? branchesList.find(item => item.name === value) : branchesList.find(item => item.code === value)
        setValue('branchCode', newBranch.code)
        setValue('branchName', newBranch.name)
        setContractInfo({
            ...contractInfo,
            branchId: newBranch.id,
            branchName: newBranch.name,
            branchCode: newBranch.code
        })
    }


    const notifyFromDate = () => toast.error('تاریخ شروع نمی تواند بعد از تاریخ انقضا یا برابر با آن باشد');
    const notifyToDate = () => toast.error('تاریخ انقضا نمی تواند قبل از تاریخ شروع یا برابر با آن باشد');

    const onChangeStartDateHandler = (e, date) => {
        if (contractInfo.expirationDate) {
            if (dayjs(e).isBefore(dayjs(contractInfo.expirationDate), 'day')) {
                setContractInfo({...contractInfo, startDate: e})
                setValue('startDate', e)
            } else if (dayjs(e).isSame(dayjs(contractInfo.expirationDate), 'day') || dayjs(e).isAfter(dayjs(contractInfo.expirationDate), 'day')) {
                notifyFromDate()
                setContractInfo({...contractInfo, startDate: ''})
                setValue('startDate', '')
            }
        } else {
            setContractInfo({...contractInfo, startDate: e})
            setValue('startDate', e)
        }
    }

    const onChangeExpirationDateHandler = (e, date) => {
        if (contractInfo.startDate) {
            if (dayjs(e).isAfter(dayjs(contractInfo.startDate), 'day')) {
                setContractInfo({...contractInfo, expirationDate: e})
                setValue('expirationDate', e)
            } else if (dayjs(e).isSame(dayjs(contractInfo.startDate), 'day') || dayjs(e).isBefore(dayjs(contractInfo.startDate), 'day')) {
                notifyToDate()
                setContractInfo({...contractInfo, expirationDate: ''})
                setValue('expirationDate', '')
            }
        } else {
            setContractInfo({...contractInfo, expirationDate: e})
            setValue('expirationDate', e)
        }
    }

    const onChangeMarketHandler = (value) => {
        let market = marketsList.find(item => item.marketFaName === value)
        setContractInfo({...contractInfo, marketId: market.id, marketFaName: value})
    }

    const onChangeStakeholderHandler = (value) => {
        let stakeholder = stakeholdersList.find(item => item.name === value)
        console.log(value, stakeholder.account, stakeholder.iban)
        setContractInfo({
            ...contractInfo,
            stakeHolderId: stakeholder.id,
            stakeHolderName: value,
            stakeHolderAccount: stakeholder.account,
            stakeHolderIban: stakeholder.iban
        })
    }

    const onChangeSelectHandler = (value, name) => {
        setContractInfo({...contractInfo, [name]: value})
    }

    const nextDaySettlement = (e)=>{
        setContractInfo({...contractInfo,bankSettlementScope: e.target.checked})
        if (e.target.checked) {
            setContractInfo({...contractInfo, minBankSettlementHour: '',maxBankSettlementHour: ''})
        }
    }

    const initialTerminationChangeHandler = (event) => {
        setFirstTerminateInfo({...firstTerminateInfo, initialTerminationLetterNumber: event.target.value})
    }

    const finalTerminationChangeHandler = (event) => {
        setFinalTerminateInfo({...finalTerminateInfo, finalTerminationLetterNumber: event.target.value})
    }

    const cancelRegisterContractHandler = () => {
        navigation('/contracts')
    }

    const notifyContractExpired = () => toast.error('قراداد منقضی شده است');
    const notifyContractTerminated = () => toast.error('قراداد فسخ شده است');

    const terminateContractHandler = () => {
        if (contractInfo?.status) {
            setLoadingButton(true)
            if (contractInfo.status === 'Active') {
                if (user?.RegisterContractTermination==='yes') {
                    dispatch(firstTerminateContract({
                        loanId: loanId,
                        contractId: id,
                        initialTerminationLetterNumber: contractInfo?.contractCancellations?.[0]?.initialTerminationLetterNumber || firstTerminateInfo.initialTerminationLetterNumber
                    })).then(() => {
                        setLoadingButton(false)
                    })
                }else {
                    setLoadingButton(false)
                    toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
                }

            } else if (contractInfo.status === 'InitialTermination') {
                if (user?.TerminateContract==='yes') {
                    dispatch(finalTerminateContract({
                        loanId: loanId,
                        contractId: id,
                        finalTerminationLetterNumber: contractInfo?.contractCancellations?.[0]?.finalTerminationLetterNumber || finalTerminateInfo.finalTerminationLetterNumber
                    })).then(() => {
                        setLoadingButton(false)
                    })
                }else {
                    setLoadingButton(false)
                    toast.error('کاربر گرامی شما دسترسی به این اقدام را ندارید')
                }

            } else if (contractInfo.status === 'Expired') {
                setLoadingButton(false)
                notifyContractExpired()
            } else {
                setLoadingButton(false)
                notifyContractTerminated()
            }
        }
    }

    const showFirstTerminateHandler = () => {
        setShowFirstTerminate(true)
        setShowFinalTerminate(false)
    }

    const showFinalTerminateHandler = () => {
        setShowFirstTerminate(false)
        setShowFinalTerminate(true)
    }

    const notifyPenalty = () => toast.error('زمان بررسی و نرخ اعتباردهی را وارد کنید');

    const onSubmit = (values) => {
        if (contractInfo.penaltiesOfContract.length > 0) {
            registerContractSubmitHandler()
        } else {
            notifyPenalty()
            // return message.error({
            //     content: 'زمان بررسی و نرخ اعتباردهی را وارد کنید',
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
        }
    }

    return (
        <div className={'inquiry-content-container'} style={{marginTop: '0'}}>
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
            <Collapse accordion defaultActiveKey={location.pathname.includes('terminate') && '2'}>
                <Panel header="اطلاعات پایه قرارداد" key="1">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Row gutter={[24, 24]} style={{margin: '2.2rem 0 2rem'}}>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="contractNumber"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'} label={'شماره قرارداد'}
                                                         value={value} onChange={(e) => {
                                            registerContractItemsChangeHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.contractNumber && errors.contractNumber.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="brokerName"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'نام شرکت کارگزاری'}
                                                      value={value} onChange={(e) => {
                                            onChangeBrokerNameCodeHandler(e, name)
                                            onChange(e)
                                        }}>
                                            {brokersList?.map(item => <Option value={item.name}
                                                                              key={item.id}>{item.name}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().brokerName && errors?.contractNumber && errors.brokerName.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="brokerCode"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'کد کارگزاری'}
                                                      value={value} onChange={(e) => {
                                            onChangeBrokerNameCodeHandler(e, name)
                                            onChange(e)
                                        }}>
                                            {brokersList?.map(item => <Option value={item.code}
                                                                              key={item.id}>{item.code}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().brokerCode && errors?.brokerCode && errors.brokerCode.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="brokerAccount"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'شماره سپرده کارگزار'}
                                                      value={value} onChange={(e) => {
                                            onChangeBrokerAccountIbanHandler(e, name)
                                            onChange(e)
                                        }}>
                                            {brokerAccountsList?.map(item => <Option value={item.account}
                                                                                     key={item.id}>{item.account}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().brokerAccount && errors?.brokerAccount && errors.brokerAccount.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="brokerIban"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'شماره شبای کارگزار'}
                                                      value={value} onChange={(e) => {
                                            onChangeBrokerAccountIbanHandler(e, name)
                                            onChange(e)
                                        }}>
                                            {brokerAccountsList?.map(item => <Option value={item.iban}
                                                                                     key={item.id}>{item.iban}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().brokerIban && errors?.brokerIban && errors.brokerIban.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="branchName"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'نام شعبه'}
                                                      value={value} onChange={(e) => {
                                            onChangeBranchNameCodeHandler(e, name)
                                            onChange(e)
                                        }}>
                                            {branchesList?.map(item => <Option value={item.name}
                                                                               key={item.id}>{item.name}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().branchName && errors?.branchName && errors.branchName.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="branchCode"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'کد شعبه'}
                                                      value={value} onChange={(e) => {
                                            onChangeBranchNameCodeHandler(e, name)
                                            onChange(e)
                                        }}>
                                            {branchesList?.map(item => <Option value={item.code}
                                                                               key={item.id}>{item.code}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().branchCode && errors?.branchCode && errors.branchCode.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <span className={'time-picker-label'}>تاریخ شروع قرارداد</span>
                                <JalaliLocaleListener/>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <DatePickerJalali name={name} allowClear={false}
                                                          suffixIcon={<img src={DateLogo}/>}
                                                          style={{width: '100%'}}
                                                          inputReadOnly={true}
                                                          locale={locale} format={'YYYY/MM/DD'}
                                                          value={value ? dayjs(value, {jalali: false}) : ''}
                                                          onChange={(e, dateString) => {
                                                              onChange(e)
                                                              onChangeStartDateHandler(e, dateString)
                                                          }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().startDate && errors?.startDate && errors.startDate.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <span className={'time-picker-label'}>تاریخ انقضای قرارداد</span>
                                <JalaliLocaleListener/>
                                <Controller
                                    name="expirationDate"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <DatePickerJalali name={name} allowClear={false}
                                                          suffixIcon={<img src={DateLogo}/>}
                                                          style={{width: '100%'}}
                                                          inputReadOnly={true}
                                                          locale={locale} format={'YYYY/MM/DD'}
                                                          value={value ? dayjs(value, {jalali: false}) : ''}
                                                          onChange={(e, dateString) => {
                                                              onChange(e)
                                                              onChangeExpirationDateHandler(e, dateString)
                                                          }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().expirationDate && errors?.expirationDate && errors.expirationDate.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="marketFaName"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'نوع بازار'}
                                                      value={value} onChange={(e) => {
                                            onChangeMarketHandler(e, name)
                                            onChange(e)
                                        }}>
                                            {marketsList?.map(item => <Option value={item.marketFaName}
                                                                              key={item.marketName}>{item.marketFaName}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().marketFaName && errors?.marketFaName && errors.marketFaName.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="maxNumberOfLoanDays"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'فیلد اجباری است',
                                        min: {value: 1, message: 'مقدار بزرگتر از 0 وارد شود'},
                                        pattern: {value: /^[0-9]+$/, message: 'فقط عدد مجاز است'}
                                    }}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'}
                                                         label={'مهلت نهایی تسویه با بانک(روز)'}
                                                         onKeyPress={onKeyPressHandler}
                                                         value={value} onChange={(e) => {
                                            registerContractItemsChangeHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.maxNumberOfLoanDays && errors.maxNumberOfLoanDays.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="stakeHolderName"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomSelect name={name} type={'text'} label={'نام ذینفع'}
                                                      value={value} onChange={(e) => {
                                            onChange(e)
                                            onChangeStakeholderHandler(e)
                                        }}>
                                            {stakeholdersList?.map(item => <Option value={item.name}
                                                                                   key={item.id}>{item.name}</Option>)}
                                        </CustomSelect>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().stakeHolderName && errors?.stakeHolderName && errors.stakeHolderName.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="stakeHolderAccount"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        // <CustomSelect name={name} type={'text'} label={'شماره حساب ذینفع'}
                                        //               value={value} onChange={(e) => {
                                        //     onChange(e)
                                        //     onChangeStakeholderAccountIbanHandler(e,name)
                                        // }}>
                                        //     {stakeholdersList?.map(item => <Option value={item.account}
                                        //                                            key={item.id}>{item.account}</Option>)}
                                        // </CustomSelect>
                                        <CustomTextInput name={name} type={'text'} label={'شماره سپرده ذینفع'} readOnly
                                                         value={value} onChange={(e) => {
                                            // onChange(e)
                                            // onChangeStakeholderAccountIbanHandler(e,name)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().stakeHolderAccount && errors?.stakeHolderAccount && errors.stakeHolderAccount.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="stakeHolderIban"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        // <CustomSelect name={name} type={'text'} label={'شماره شبای ذینفع'}
                                        //               value={removeIR(value)} onChange={(e) => {
                                        //     onChange(e)
                                        //     onChangeStakeholderAccountIbanHandler(e,name)
                                        // }}>
                                        //     {stakeholdersList?.map(item => <Option value={item.iban}
                                        //                                            key={item.id}>{item.iban}</Option>)}
                                        // </CustomSelect>
                                        <CustomTextInput suffix={'IR'} name={name} type={'text'}
                                                         label={'شماره شبای ذینفع'} readOnly
                                                         value={removeIR(value)} onChange={(e) => {
                                            // onChange(e)
                                            // onChangeStakeholderAccountIbanHandler(e,name)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().stakeHolderIban && errors?.stakeHolderIban && errors.stakeHolderIban.message}
                                </small>
                            </Col>

                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="bankDebtorsName"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'} label={'نام سرفصل'}
                                                         value={value} onChange={(e) => {
                                            registerContractItemsChangeHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.bankDebtorsName && errors.bankDebtorsName.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="bankDebtorsCode"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'} label={'کد سرفصل'}
                                                         value={value} onChange={(e) => {
                                            registerContractItemsChangeHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.bankDebtorsCode && errors.bankDebtorsCode.message}
                                </small>
                            </Col>

                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="bankDebtorsAccount"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'}
                                                         onKeyPress={onKeyPressHandler}
                                                         label={'شماره سپرده سرفصل بدهکاران بانک'}
                                                         value={value} onChange={(e) => {
                                            registerContractItemsChangeHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.bankDebtorsAccount && errors.bankDebtorsAccount.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="bankDebtorsIban"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        pattern: {value: /^[0-9]+$/, message: 'فقط عدد مجاز است'},
                                        required: 'فیلد اجباری است',
                                        maxLength: {value: 24, message: 'شماره شبا باید 24 رقمی باشد'},
                                        minLength: {value: 24, message: 'شماره شبا باید 24 رقمی باشد'}
                                    }}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput suffix={'IR'} name={name} type={'text'}
                                                         label={'شماره شبای سرفصل بدهکاران بانک'}
                                                         onKeyPress={onKeyPressHandler}
                                                         value={removeIR(value)} onChange={(e) => {
                                            onChange(e)
                                            registerContractItemsChangeHandler(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.bankDebtorsIban && errors.bankDebtorsIban.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="bankDebtorsCif"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'}
                                                         label={'شماره مشتری سرفصل بدهکاران بانک'}
                                                         onKeyPress={onKeyPressHandler}
                                                         value={value} onChange={(e) => {
                                            registerContractItemsChangeHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.bankDebtorsCif && errors.bankDebtorsCif.message}
                                </small>
                            </Col>
                            <Col lg={8} xl={7} xxl={4}>
                                <Controller
                                    name="loanPercentage"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'} label={'درصد سود تسهیلات'}
                                                         onKeyPress={onKeyPressHandler}
                                                         value={value} onChange={(e) => {
                                            registerContractItemsChangeHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.loanPercentage && errors.loanPercentage.message}
                                </small>
                            </Col>
                            {/*{location.pathname.includes('edit') && <Col lg={8} xl={7} xxl={4}>*/}
                            {/*    <CustomSelect name={'status'} disabled={true} value={contractInfo?.status} label={'وضعیت'}*/}
                            {/*                  onChange={onChangeSelectHandler}>*/}
                            {/*        {contractStatus?.map(item => <Option value={item.status}*/}
                            {/*                                             key={item.id}>{item.faStatus}</Option>)}*/}
                            {/*    </CustomSelect>*/}
                            {/*</Col>}*/}
                        </Row>
                        <Row gutter={24} style={{marginTop: '2rem'}} align={'middle'}>
                            <Col lg={6} xxl={5}>
                                <div style={{fontSize: '14px', fontWeight: 'bold'}}>ساعت امکان استعلام میزان بدهی</div>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <span className={'time-picker-label'}>{'از ساعت'}</span>
                                <Controller
                                    name="minInquiryHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTimePicker
                                            name={name}
                                            open={isOpenTimePicker.minInquiryHour}
                                            onFocus={timePickerShowOnFocusHandler}
                                            onBlur={timePickerShowOnBlurHandler}
                                            renderExtraFooter={fromPickerFooterHandler}
                                            value={value ? moment(value, "HH:mm") : ''} onSelect={(e) => {
                                            selectTimeHandler(e, name)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().minInquiryHour && errors?.minInquiryHour && errors.minInquiryHour.message}
                                </small>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <span className={'time-picker-label'}>{'تا ساعت'}</span>
                                <Controller
                                    name="maxInquiryHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTimePicker
                                            name={name}
                                            open={isOpenTimePicker.maxInquiryHour}
                                            onFocus={timePickerShowOnFocusHandler}
                                            onBlur={timePickerShowOnBlurHandler}
                                            renderExtraFooter={fromPickerFooterHandler}
                                            value={value ? moment(value, "HH:mm") : ''} onSelect={(e) => {
                                            selectTimeHandler(e, name)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().maxInquiryHour && errors?.maxInquiryHour && errors.maxInquiryHour.message}
                                </small>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                {/*<CustomTextInput name={'inquiryCyclePerHOur'} type={'text'}*/}
                                {/*                 label={'بازه تکرار'}*/}
                                {/*                 suffix={'دقیقه'}*/}
                                {/*                 value={contractInfo.inquiryCyclePerHour}*/}
                                {/*                 onChange={changeInquiryCycleHandler}*/}
                                {/*/>*/}
                                <Controller
                                    name="inquiryCyclePerHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'فیلد اجباری است',
                                        min: {value: 1, message: 'مقدار بزرگتر از 0 وارد شود'},
                                        max: {value: 59, message: 'مقدار کوچکتر از 60 وارد شود'},
                                        pattern: {value: /^[0-9]+$/, message: 'فقط عدد مجاز است'}
                                    }}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'} suffix={'دقیقه'} label={'بازه تکرار'}
                                                         onKeyPress={onKeyPressHandler}
                                                         value={value} onChange={(e) => {
                                            changeInquiryCycleHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.inquiryCyclePerHour && errors.inquiryCyclePerHour.message}
                                </small>
                            </Col>
                        </Row>

                        <Row gutter={24} style={{marginTop: '2rem'}} align={'middle'}>
                            <Col lg={6} xxl={5}>
                                <div style={{fontSize: '14px', fontWeight: 'bold'}}>ساعت تسویه بدهی کارگزاری با ذینفع
                                </div>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <span className={'time-picker-label'}>{'از ساعت'}</span>
                                <Controller
                                    name="minStakeholderSettlementHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTimePicker
                                            name={name}
                                            open={isOpenTimePicker.minStakeholderSettlementHour}
                                            onFocus={timePickerShowOnFocusHandler}
                                            onBlur={timePickerShowOnBlurHandler}
                                            renderExtraFooter={fromPickerFooterHandler}
                                            value={value ? moment(value, "HH:mm") : ''} onSelect={(e) => {
                                            selectTimeHandler(e, name)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().minStakeholderSettlementHour && errors?.minStakeholderSettlementHour && errors.minStakeholderSettlementHour.message}
                                </small>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <span className={'time-picker-label'}>{'تا ساعت'}</span>
                                <Controller
                                    name="maxStakeholderSettlementHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTimePicker
                                            name={name}
                                            open={isOpenTimePicker.maxStakeholderSettlementHour}
                                            onFocus={timePickerShowOnFocusHandler}
                                            onBlur={timePickerShowOnBlurHandler}
                                            renderExtraFooter={fromPickerFooterHandler}
                                            value={value ? moment(value, "HH:mm") : ''} onSelect={(e) => {
                                            selectTimeHandler(e, name)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().maxStakeholderSettlementHour && errors?.maxStakeholderSettlementHour && errors.maxStakeholderSettlementHour.message}
                                </small>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                {/*<CustomTextInput name={'stakeholderSettlementCyclePerHour'} type={'text'}*/}
                                {/*                 label={'بازه تکرار'}*/}
                                {/*                 suffix={'دقیقه'}*/}
                                {/*                 value={contractInfo.stakeholderSettlementCyclePerHour}*/}
                                {/*                 onChange={changeStakeholderSettlementCycleHandler}*/}
                                {/*/>*/}
                                <Controller
                                    name="stakeholderSettlementCyclePerHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'فیلد اجباری است',
                                        min: {value: 1, message: 'مقدار بزرگتر از 0 وارد شود'},
                                        max: {value: 59, message: 'مقدار کوچکتر از 60 وارد شود'},
                                        pattern: {value: /^[0-9]+$/, message: 'فقط عدد مجاز است'}
                                    }}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'} suffix={'دقیقه'} label={'بازه تکرار'}
                                                         onKeyPress={onKeyPressHandler}
                                                         value={value} onChange={(e) => {
                                            changeStakeholderSettlementCycleHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.stakeholderSettlementCyclePerHour && errors.stakeholderSettlementCyclePerHour.message}
                                </small>
                            </Col>
                        </Row>

                        <Row gutter={24} style={{margin: '2rem 0 1rem'}} align={'middle'}>
                            <Col lg={6} xxl={4}>
                                <div style={{fontSize: '14px', fontWeight: 'bold'}}>ساعت تسویه بدهی کارگزاری با بانک
                                </div>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <span className={'time-picker-label'}>{'از ساعت'}</span>
                                <Controller
                                    name="minBankSettlementHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTimePicker
                                            name={name}
                                            open={isOpenTimePicker.minBankSettlementHour}
                                            onFocus={timePickerShowOnFocusHandler}
                                            onBlur={timePickerShowOnBlurHandler}
                                            renderExtraFooter={fromPickerFooterHandler}
                                            value={value ? moment(value, "HH:mm") : ''} onSelect={(e) => {
                                            selectTimeHandler(e, name)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().minBankSettlementHour && errors?.minBankSettlementHour && errors.minBankSettlementHour.message}
                                </small>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <span className={'time-picker-label'}>{'تا ساعت'}</span>
                                <Controller
                                    name="maxBankSettlementHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{required: 'فیلد اجباری است'}}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTimePicker
                                            name={name}
                                            open={isOpenTimePicker.maxBankSettlementHour}
                                            onFocus={timePickerShowOnFocusHandler}
                                            onBlur={timePickerShowOnBlurHandler}
                                            renderExtraFooter={fromPickerFooterHandler}
                                            value={value ? moment(value, "HH:mm") : ''} onSelect={(e) => {
                                            selectTimeHandler(e, name)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {!getValues().maxBankSettlementHour && errors?.maxBankSettlementHour && errors.maxBankSettlementHour.message}
                                </small>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                {/*<CustomTextInput name={'bankSettlementCyclePerHour'} type={'text'}*/}
                                {/*                 label={'بازه تکرار'}*/}
                                {/*                 suffix={'دقیقه'}*/}
                                {/*                 value={contractInfo.bankSettlementCyclePerHour}*/}
                                {/*                 onChange={changeBankSettlementCycleHandler}*/}
                                {/*/>*/}
                                <Controller
                                    name="bankSettlementCyclePerHour"
                                    control={control}
                                    defaultValue=""
                                    rules={{
                                        required: 'فیلد اجباری است',
                                        min: {value: 1, message: 'مقدار بزرگتر از 0 وارد شود'},
                                        max: {value: 59, message: 'مقدار کوچکتر از 60 وارد شود'},
                                        pattern: {value: /^[0-9]+$/, message: 'فقط عدد مجاز است'}
                                    }}
                                    render={({field: {name, onChange, value}}) => (
                                        <CustomTextInput name={name} type={'text'} suffix={'دقیقه'} label={'بازه تکرار'}
                                                         onKeyPress={onKeyPressHandler}
                                                         value={value} onChange={(e) => {
                                            changeBankSettlementCycleHandler(e)
                                            onChange(e)
                                        }}/>
                                    )}
                                />
                                <small style={{color: 'red'}}>
                                    {errors?.bankSettlementCyclePerHour && errors.bankSettlementCyclePerHour.message}
                                </small>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <Checkbox checked={contractInfo?.bankSettlementScope} onChange={nextDaySettlement}>روز آتی</Checkbox>
                            </Col>
                        </Row>


                        <Row gutter={[24, 24]} align={'middle'}>
                            <Col lg={6} xxl={4}>
                                <div style={{fontSize: '14px', fontWeight: 'bold'}}>مهلت تسویه بدهی کارگزاری با بانک
                                </div>
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <span className={'time-picker-label'}>{'زمان بررسی'}</span>
                                <CustomTimePicker
                                    onSelect={selectFromHourHandler}
                                    open={isOpenTimePicker.fromHour}
                                    name={'fromHour'}
                                    value={fromHour ? moment(fromHour, "HH:mm") : null}
                                    onFocus={timePickerShowOnFocusHandler}
                                    onBlur={timePickerShowOnBlurHandler}
                                    renderExtraFooter={fromPickerFooterHandler}
                                />
                            </Col>
                            <Col lg={6} xl={4} xxl={3}>
                                <CustomTextInput name={'addedPenaltyPercentage'} type={'text'}
                                                 onKeyPress={onKeyPressHandler}
                                                 label={'با نرخ اعتباردهی'}
                                                 value={penalty} onChange={changePenaltyHandler}/>
                            </Col>
                            <Tooltip title={'افزودن مهلت'}> <Col lg={2}>
                                <CustomButton type={'primary'}
                                              onClick={addTimePenaltyHandler}
                                              title={<span style={{fontSize: '27px', fontWeight: 'bold'}}>+</span>}/>
                            </Col></Tooltip>
                            <Col lg={24} xxl={11} style={{marginTop: '1rem'}}>
                                <Table columns={columns} dataSource={contractInfo?.penaltiesOfContract}
                                       loading={loading}
                                       locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'uuid'}
                                       pagination={pagination}
                                       scroll={{x: 'max-content'}}
                                />
                                <h4>تعداد قابل نمایش: {2}</h4>
                            </Col>
                        </Row>
                        <Row justify={"end"} style={{marginTop: '3rem'}}>
                            <Col lg={3} style={{marginLeft: '1rem'}}>
                                <CustomButton type={'primary'} title={'انصراف'}
                                              onClick={cancelRegisterContractHandler}/>
                            </Col>
                            <Col lg={3}>
                                <CustomButton type={'primary'} htmlType={'submit'}
                                              title={loadingButton ? <Spin/> : id ? 'ویرایش قراداد' : 'ثبت قرارداد'}
                                    // onClick={registerContractSubmitHandler}
                                />
                            </Col>
                        </Row>
                    </form>
                </Panel>
                <Panel header="وضعیت فسخ قرارداد" key="2">
                    <Row justify={"start"} style={{marginTop: '1rem', marginBottom: '3rem'}}>
                        <Col lg={3} style={{marginLeft: '1rem'}}>
                            <CustomButton type={'primary'} title={'فسخ اولیه قرارداد'}
                                          onClick={showFirstTerminateHandler}/>
                        </Col>
                        <Col lg={3}>
                            <CustomButton type={'primary'} title={'فسخ نهایی قرارداد'}
                                          onClick={showFinalTerminateHandler}/>
                        </Col>
                    </Row>
                    {showFirstTerminate ? <Row gutter={[24,24]} style={{margin: '2.2rem 0 1rem'}}>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput name={'contractNumber'} readOnly={contractInfo.status !== 'Active'}
                                             type={'text'} label={'شماره نامه فسخ اولیه قرارداد'}
                                             value={firstTerminateInfo?.initialTerminationLetterNumber}
                                             onChange={initialTerminationChangeHandler}/>
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <span className={'time-picker-label'}>تاریخ فسخ اولیه قرارداد</span>
                            <JalaliLocaleListener/>
                            <DatePickerJalali
                                value={contractInfo.status === 'Active' ? dayjs(new Date(), {jalali: true}) : ''}
                                style={{width: '100%'}}
                                locale={locale} format={'YYYY/MM/DD'}
                                // onChange={(date, dateString) => brokerInfoDateChangeHandler(dateString)}
                                suffixIcon={<img src={DateLogo}/>}
                                allowClear={false}
                                name={'fromDate'}
                                inputReadOnly={true}
                                // disabled
                            />
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <span className={'time-picker-label'}>{'ساعت فسخ اولیه قرارداد'}</span>
                            <CustomTimePicker
                                onSelect={selectFirstTerminateHourHandler}
                                open={isOpenTimePicker.firstTerminateHour}
                                name={'firstTerminateHour'}
                                value={contractInfo.status === 'Active' ? moment(new Date(), "HH:mm") : ''}
                                // onFocus={timePickerShowOnFocusHandler}
                                // onBlur={timePickerShowOnBlurHandler}
                                renderExtraFooter={fromPickerFooterHandler}
                                // disabled
                                inputReadOnly={true}
                            />
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            {/*<span className={'time-picker-label'}>کاربر درخواست کننده فسخ اولیه </span>*/}
                            {/*<Select*/}
                            {/*    value={""}*/}
                            {/*    disabled={contractInfo.status!=='Active'}*/}
                            {/*    showSearch*/}
                            {/*    placeholder=""*/}
                            {/*    // onChange={onChangeBrokerCodeHandler}*/}
                            {/*    suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}*/}
                            {/*>*/}
                            {/*    {brokersList?.map(item => <Option value={item.brokerCode}*/}
                            {/*                                      key={item.brokerCode}>{item.brokerCode}</Option>)}*/}
                            {/*</Select>*/}
                            <CustomTextInput name={'initialTerminationUserName'} readOnly={true} type={'text'}
                                             label={'کاربر درخواست کننده فسخ اولیه'}
                                             value={contractInfo.status === 'Active' ? JSON.parse(userDecoded?.userinfo)?.faName + ' ' +JSON.parse(userDecoded?.userinfo)?.faLastName : ''}
                                             onChange={registerContractItemsChangeHandler}/>
                        </Col>
                    </Row> : ''}
                    {showFinalTerminate ? <Row gutter={[24,24]} style={{margin: '1.5rem 0 2rem'}}>
                        <Col lg={8} xl={7} xxl={4}>
                            <CustomTextInput name={'contractNumber'}
                                             readOnly={contractInfo.status !== 'InitialTermination'} type={'text'}
                                             label={'شماره نامه فسخ نهایی قرارداد'}
                                             value={finalTerminateInfo?.finalTerminationLetterNumber}
                                             onChange={finalTerminationChangeHandler}/>
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <span className={'time-picker-label'}>تاریخ فسخ نهایی قرارداد</span>
                            <JalaliLocaleListener/>
                            <DatePickerJalali
                                value={contractInfo.status === 'InitialTermination' ? dayjs(new Date(), {jalali: true}) : ''}
                                style={{width: '100%'}}
                                locale={locale} format={'YYYY/MM/DD'}
                                // onChange={(date, dateString) => brokerInfoDateChangeHandler(dateString)}
                                suffixIcon={<img src={DateLogo}/>}
                                allowClear={false}
                                name={'fromDate'}
                                inputReadOnly={true}
                            />
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            <span className={'time-picker-label'}>{'ساعت فسخ نهایی قرارداد'}</span>
                            <CustomTimePicker
                                onSelect={selectFinalTerminateHourHandler}
                                open={isOpenTimePicker.finalTerminateHour}
                                name={'finalTerminateHour'}
                                value={contractInfo.status === 'InitialTermination' ? moment(new Date(), "HH:mm") : ''}
                                // onFocus={timePickerShowOnFocusHandler}
                                // onBlur={timePickerShowOnBlurHandler}
                                renderExtraFooter={fromPickerFooterHandler}
                                inputReadOnly={true}
                            />
                        </Col>
                        <Col lg={8} xl={7} xxl={4}>
                            {/*<span className={'time-picker-label'}>کاربر درخواست کننده فسخ نهایی </span>*/}
                            {/*<Select*/}
                            {/*    value={""}*/}
                            {/*    disabled={contractInfo.status==='Active'}*/}
                            {/*    showSearch*/}
                            {/*    placeholder=""*/}
                            {/*    // onChange={onChangeBrokerCodeHandler}*/}
                            {/*    suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}*/}
                            {/*>*/}
                            {/*    {brokersList?.map(item => <Option value={item.brokerCode}*/}
                            {/*                                      key={item.brokerCode}>{item.brokerCode}</Option>)}*/}
                            {/*</Select>*/}
                            <CustomTextInput name={'finalTerminationUserName'} readOnly={true} type={'text'}
                                             label={'کاربر درخواست کننده فسخ نهایی'}
                                             value={contractInfo.status === 'InitialTermination' ? JSON.parse(userDecoded?.userinfo)?.faName + ' ' +JSON.parse(userDecoded?.userinfo)?.faLastName : ''}
                                             onChange={registerContractItemsChangeHandler}/>
                        </Col>
                    </Row> : ''}
                    {(showFirstTerminate || showFinalTerminate) ?
                        <Row justify={"end"} style={{marginTop: '3rem', marginBottom: '3rem'}}>
                            <Col lg={3} style={{marginLeft: '1rem'}}>
                                <CustomButton type={'primary'} title={'انصراف'}
                                              onClick={cancelRegisterContractHandler}/>
                            </Col>
                            <Col lg={3}>
                                <CustomButton type={'primary'} title={loadingButton ? <Spin/> : 'ثبت '}
                                              onClick={terminateContractHandler}/>
                            </Col>
                        </Row> : ''}
                    <Table columns={columnsTerminationContract} dataSource={contractInfo?.contractCancellations}
                           loading={loading}
                           locale={{emptyText: 'داده ای وجود ندارد'}} rowKey={'contractId'}
                           pagination={pagination}
                           scroll={{x: 'max-content'}}
                           showSizeChanger={false}

                    />
                    <h4>تعداد قابل نمایش: {2}</h4>
                </Panel>
            </Collapse>

        </div>
    )
}

export default AddEditContract