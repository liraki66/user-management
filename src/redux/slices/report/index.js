import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl,
    GetDailyBrokerSettlementDocument,
    GetDailyBrokerSettlementReport,
    GetExternalApiErrorReport,
    GetManualSettlementWithBankDebtorsDocument,
    GetManualSettlementWithBankDebtorsReport,
    GetNotificationReport, GetNotificationReportDocument,
    GetReleaseNote,
    GetSamatInquiries,
    GetSamatInquiriesDocument,
    GetSamatWithdrawalsFromBankDebtors,
    GetSamatWithdrawalsFromBankDebtorsDocument,
    GetTransferBrokerToBankAccount,
    GetTransferBrokerToBankAccountDocument,
    GetTransferBrokerToSamat,
    GetTransferBrokerToSamatDocument,
    GetUserActivityReport,
    GetUserActivityReportDocument,
    GetYaghoutInquiries,
    GetYaghoutInquiriesDocument
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import FileDownload from "js-file-download";
import {toast} from "react-toastify";

export const getTransferBrokerToSamat = createAsyncThunk(
    'transferBrokerToSamat/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetTransferBrokerToSamat, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getTransferBrokerToSamatDocument = createAsyncThunk(
    'transferBrokerToSamatDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetTransferBrokerToSamatDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)

export const getSamatWithdrawalsFromBankDebtors = createAsyncThunk(
    'samatWithdrawalsFromBankDebtors/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetSamatWithdrawalsFromBankDebtors, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getSamatWithdrawalsFromBankDebtorsDocument = createAsyncThunk(
    'samatWithdrawalsFromBankDebtorsDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetSamatWithdrawalsFromBankDebtorsDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)

export const getTransferBrokerToBankAccount = createAsyncThunk(
    'transferBrokerToBankAccount/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetTransferBrokerToBankAccount, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)


export const getTransferBrokerToBankAccountDocument = createAsyncThunk(
    'transferBrokerToBankAccountDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetTransferBrokerToBankAccountDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)

export const getSamatInquiries = createAsyncThunk(
    'samatInquiries/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetSamatInquiries, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getSamatInquiriesDocument = createAsyncThunk(
    'samatInquiriesDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetSamatInquiriesDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
            param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)

export const getYaghootInquiries = createAsyncThunk(
    'yaghootInquiries/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetYaghoutInquiries, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getYaghootInquiriesDocument = createAsyncThunk(
    'yaghootInquiriesDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetYaghoutInquiriesDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)

export const getDailyStakeholder = createAsyncThunk(
    'dailyStakeholder/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetDailyBrokerSettlementReport, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getDailyStakeholderDocument = createAsyncThunk(
    'dailyStakeholderDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetDailyBrokerSettlementDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)


export const getSentMessages = createAsyncThunk(
    'sentMessages/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetNotificationReport, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getNotificationReportDocument = createAsyncThunk(
    'sentMessagesDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetNotificationReportDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)

export const getManualSettlementWithBankDebtors = createAsyncThunk(
    'manualSettlement/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetManualSettlementWithBankDebtorsReport, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getManualSettlementWithBankDebtorsDocument = createAsyncThunk(
    'manualSettlementDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetManualSettlementWithBankDebtorsDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)


export const getUserActivity = createAsyncThunk(
    'userActivity/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetUserActivityReport, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
)



export const getSystemErrors = createAsyncThunk(
    'systemErrors/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetExternalApiErrorReport, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            // message.error({
            //     content: e.response.data.FaErrorMessage,
            //     className: 'custom-message-error',
            //     style: {
            //         marginTop: '6%',
            //     },
            //     duration: 3
            // })
            return thunkAPI.rejectWithValue(e)
        }
    }
    )

export const getUserActivityDocument = createAsyncThunk(
    'userActivityDocument/list',
    async ({body, param,name}, thunkAPI) => {
        await request.post(GetUserActivityReportDocument + '/' + param, body, {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='csv'? FileDownload(res.data, `${name}.csv`) : FileDownload(res.data, `${name}.xlsx`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })

    }
)

export const getReleaseNote = createAsyncThunk(
    'releaseNote/list',
    async ({body, param,name}, thunkAPI) => {
        await request.get(GetReleaseNote + '/', {
            baseURL: BrokerSettlementBaseUrl, responseType:'arraybuffer'
        })
            .then(res => {
                param==='pdf'? FileDownload(res.data, `${name}.pdf`) : FileDownload(res.data, `${name}`)
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
                // message.error({
                //     content: e.response.data.FaErrorMessage,
                //     className: 'custom-message-error',
                //     style: {
                //         marginTop: '6%',
                //     },
                //     duration: 3
                // })
                return thunkAPI.rejectWithValue(e)
            })
    }
)


export const reportSlice = createSlice({
    name: 'report',
    initialState: {
        transferBrokerToSamat: [],
        samatWithdrawalsFromBankDebtors: [],
        transferBrokerToBankAccount: [],
        samatInquiries: [],
        yaghootInquiries: [],
        dailyStakeholder:[],
        manualSettlement:[],
        userActivity:[],
        systemErrors:[],
        sentMessages:[],
        loadingList: false,
        loadingSingle: false,
    },
    reducers: {
        clearReports(state, action) {
            state.transferBrokerToSamat = []
            state.samatWithdrawalsFromBankDebtors = []
            state.transferBrokerToBankAccount = []
            state.samatInquiries = []
            state.yaghootInquiries = []
            state.dailyStakeholder = []
            state.manualSettlement = []
            state.userActivity = []
            state.systemErrors =[]
            state.sentMessages =[]
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getTransferBrokerToSamat.fulfilled, (state, action) => {
            state.transferBrokerToSamat = {...action.payload}
        })
        builder.addCase(getSamatWithdrawalsFromBankDebtors.fulfilled, (state, action) => {
            state.samatWithdrawalsFromBankDebtors = {...action.payload}
        })
        builder.addCase(getTransferBrokerToBankAccount.fulfilled, (state, action) => {
            state.transferBrokerToBankAccount = {...action.payload}
        })
        builder.addCase(getSamatInquiries.fulfilled, (state, action) => {
            state.samatInquiries = {...action.payload}
        })
        builder.addCase(getYaghootInquiries.fulfilled, (state, action) => {
            state.yaghootInquiries = {...action.payload}
        })
        builder.addCase(getDailyStakeholder.fulfilled, (state, action) => {
            state.dailyStakeholder = {...action.payload}
        })
        builder.addCase(getManualSettlementWithBankDebtors.fulfilled, (state, action) => {
            state.manualSettlement = {...action.payload}
        })
        builder.addCase(getUserActivity.fulfilled, (state, action) => {
            state.userActivity = {...action.payload}
        })
        builder.addCase(getSystemErrors.fulfilled, (state, action) => {
            state.systemErrors = {...action.payload}
        })
        builder.addCase(getSentMessages.fulfilled, (state, action) => {
            state.sentMessages = {...action.payload}
        })
    }
})

const {reducer} = reportSlice
export const {clearReports} = reportSlice.actions

export default reducer