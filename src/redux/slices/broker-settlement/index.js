import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    BlockBrokerAccount, BrokerLoanRegistration,
    BrokerSettlementBaseUrl, DoBrokerSettlementWithBank, DoBrokerSettlementWithBankDebtors,
    DoBrokerSettlementWithStakeHolder, GetBrokerLoanInfo,
    GetBrokersDebitFromStakeHolderByMarket, GetBrokerSettlementInfoWithBank, GetBrokerSettlementInfoWithBankDebtors,
    GetBrokerSettlementInfoWithStakeHolder, GetBrokerSettlementRecordInfoWithBank, GetBrokerSettlementStatistics,
    GetMarketList, ResetData, unblockBrokerAccount, WithdrawFromBankDebtorsAccount
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";

export const getMarketsList = createAsyncThunk(
    'brokerSettlement/marketList',
    async () => {
        try {
            const res = await request.post(GetMarketList, {})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getStatistics = createAsyncThunk(
    'brokerSettlement/statistics',
    async () => {
        try {
            const res = await request.get(GetBrokerSettlementStatistics)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getInquiry = createAsyncThunk(
    'brokerSettlement/Inquiry',
    async (data) => {
        try {
            const res = await request.post(GetBrokersDebitFromStakeHolderByMarket, data)
            return res.data.stakeHolderInquiries
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            return []
        }
    }
)

export const getBrokerLoanInfo = createAsyncThunk(
    'brokerSettlement/brokerLoanInfo',
    async (data) => {
        try {
            const res = await request.post(GetBrokerLoanInfo, data)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getStakeholderSettlementInfo = createAsyncThunk(
    'brokerSettlement/stakeholder',
    async (data) => {
        try {
            const res = await request.post(GetBrokerSettlementInfoWithStakeHolder, data)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            return {}
        }
    }
)

export const getBrokerSettlementInfoWithBankDebtors = createAsyncThunk(
    'brokerSettlement/bankDebtor',
    async (data) => {
        try {
            const res = await request.post(GetBrokerSettlementInfoWithBankDebtors, data)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getBrokerSettlementInfoWithBank = createAsyncThunk(
    'brokerSettlement/bank',
    async (data) => {
        try {
            const res = await request.post(GetBrokerSettlementInfoWithBank, data)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getBrokerSettlementRecordInfoWithBank = createAsyncThunk(
    'brokerSettlement/bankRecord',
    async (data) => {
        try {
            const res = await request.post(GetBrokerSettlementRecordInfoWithBank, data)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const withdrawFromBankDebtorsAccount = createAsyncThunk(
    'brokerSettlement/withdraw',
    async (data) => {
        try {
            const res = await request.post(WithdrawFromBankDebtorsAccount, data)
            toast.success('برداشت از سرفصل بدهکاران با موفقیت انجام شد')
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const blockAccount = createAsyncThunk(
    'brokerSettlement/blockAccount',
    async (data) => {
        try {
            const res = await request.post(BlockBrokerAccount, data)
            toast.success('حساب کارگزار با موفقیت مسدود شد')
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const brokerLoanRegistration = createAsyncThunk(
    'brokerSettlement/brokerLoanRegistration',
    async (data) => {
        try {
            const res = await request.post(BrokerLoanRegistration, data)
            toast.success('اعطای تسهیلات با موفقیت انجام شد')
            // history.push(`/inquiry/settlement/bank-settlement/${data.contractId}`)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const doBrokerSettlementWithStakeHolder = createAsyncThunk(
    'brokerSettlement/stakeholderSettlement',
    async ({contractId,settlementDateFa,marketId}) => {
        try {
            const res = await request.post(DoBrokerSettlementWithStakeHolder, {contractId,settlementDateFa})
            toast.success('تسویه با ذینفع با موفقیت انجام شد')
            history.push(`/inquiry`)
            // history.push(`/inquiry/settlement/bank-settlement/${contractId}`)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const doBrokerSettlementWithBankDebtors = createAsyncThunk(
    'brokerSettlement/bankDebtorsSettlement',
    async (data) => {
        try {
            const res = await request.post(DoBrokerSettlementWithBankDebtors, data)
            toast.success('تسویه با سرفصل بدهکاران بانک با موفقیت انجام شد')
            history.push('/inquiry')
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const doBrokerSettlementWithBank = createAsyncThunk(
    'brokerSettlement/bankSettlement',
    async (data) => {
        try {
            const res = await request.post(DoBrokerSettlementWithBank, data)
            toast.success('تسویه با بانک با موفقیت انجام شد')
            history.push('/inquiry')
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const doUnblockBrokerAccount = createAsyncThunk(
    'brokerSettlement/unblockBrokerAccount',
    async (data) => {
        try {
            const res = await request.post(unblockBrokerAccount, data)
            toast.success('رفع مسدودی وجه با موفقیت انجام شد')
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)

        }
    }
)

export const resetData = createAsyncThunk(
    'brokerSettlement/resetData',
    async (data) => {
        try {
            const res = await request.post(ResetData, data)
            toast.success('ریست داده ها با موفقیت انجام شد')
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)

        }
    }
)

export const brokerSettlementSlice = createSlice({
    name: 'settlement',
    initialState: {
        statistics:{},
        marketsList: [],
        inquiryList:[],
        stakeholderSettlementInfo:{},
        bankDebtorsSettlementInfo:{},
        bankSettlementInfo:{},
        bankSettlementRecordInfo:{},
        loanInfo:{},
        loading: true
    },
    extraReducers: (builder) => {
        builder.addCase(getStatistics.fulfilled, (state, action) => {
            state.statistics = {...action.payload}
        })
        builder.addCase(getMarketsList.fulfilled, (state, action) => {
            state.marketsList = [...action.payload]
        })
        builder.addCase(getInquiry.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getInquiry.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(getInquiry.fulfilled, (state, action) => {
            state.inquiryList = [...action.payload]
            state.loading = false
        })
        builder.addCase(getStakeholderSettlementInfo.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getStakeholderSettlementInfo.rejected, (state, action) => {
            state.loading = false
            state.stakeholderSettlementInfo = {}
        })
        builder.addCase(getStakeholderSettlementInfo.fulfilled, (state, action) => {
            state.stakeholderSettlementInfo = {...action.payload}
            state.loading = false
        })
        builder.addCase(getBrokerSettlementInfoWithBankDebtors.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getBrokerSettlementInfoWithBankDebtors.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(getBrokerSettlementInfoWithBankDebtors.fulfilled, (state, action) => {
            state.bankDebtorsSettlementInfo = {...action.payload}
            state.loading = false
        })
        builder.addCase(getBrokerSettlementInfoWithBank.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getBrokerSettlementInfoWithBank.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(getBrokerSettlementInfoWithBank.fulfilled, (state, action) => {
            state.bankSettlementInfo = {...action.payload}
            state.loading = false
        })
        builder.addCase(getBrokerSettlementRecordInfoWithBank.fulfilled, (state, action) => {
            state.bankSettlementRecordInfo = {...action.payload}
            state.loading = false
        })
        builder.addCase(getBrokerLoanInfo.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getBrokerLoanInfo.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(getBrokerLoanInfo.fulfilled, (state, action) => {
            state.loanInfo = {...action.payload}
            state.loading = false
        })
    }

})

const {reducer} = brokerSettlementSlice

export default reducer