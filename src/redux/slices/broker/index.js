import {createSlice, createAsyncThunk, current} from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl,
    CreateBroker,
    DeleteBroker, DeleteUser,
    EditBroker,
    GetBrokerById,
    GetBrokerList, GetBrokerListWithPagination
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";


export const getBrokersList = createAsyncThunk(
    'brokers/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetBrokerList, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data.brokerList
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)

            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getBrokersListWithPagination = createAsyncThunk(
    'brokers/listPagination',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetBrokerListWithPagination, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)

            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getBrokerById = createAsyncThunk(
    'brokers/get',
    async (id) => {
        if (id){
            try {
                const res = await request.get(GetBrokerById + `?id=${id}`, {baseURL: BrokerSettlementBaseUrl})
                return res.data
            } catch (e) {
                toast.error(e.response.data.FaErrorMessage)

            }
        }else {
            return []
        }

    }
)

export const createBroker = createAsyncThunk(
    'brokers/create',
    async (data) => {
        await request.post(CreateBroker, data, {baseURL: BrokerSettlementBaseUrl})
            .then(res => {
                toast.success('شرکت کارگزاری با موفقیت ثبت شد')

                history.push('/brokers')
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)

            })
    }
)

export const editBroker = createAsyncThunk(
    'brokers/edit',
    async (data) => {
        await request.post(EditBroker, data, {baseURL: BrokerSettlementBaseUrl})
            .then(res => {
                toast.success('شرکت کارگزاری با موفقیت ویرایش شد')

                history.push('/brokers')
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)

            })
    }
)

export const deleteBroker = createAsyncThunk(
    'brokers/delete',
    async (id) => {
        try {
            const res = await request.post(DeleteBroker, {brokerId: id}, {baseURL: BrokerSettlementBaseUrl})
            if (res) {
                toast.success('کارگزاری با موفقیت حذف شد')
                return id
            }
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage || e.response.data.message)
        }
    }
)


export const brokerSlice = createSlice({
    name: 'broker',
    initialState: {
        brokersList:[],
        brokersListWithPagination: {},
        brokerInfo: {},
        loadingList: false,
        loadingSingle: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getBrokerById.pending, (state, action) => {
            state.loadingSingle = true
        })
        builder.addCase(getBrokerById.fulfilled, (state, action) => {
            state.brokerInfo = {...action.payload}
            state.loadingSingle = false
        })
        builder.addCase(getBrokerById.rejected, (state, action) => {
            state.loadingSingle = false
        })
        builder.addCase(getBrokersList.fulfilled, (state, action) => {
            state.brokersList = [...action.payload]
            state.loadingList = false
        })
        builder.addCase(getBrokersListWithPagination.pending, (state, action) => {
            state.loadingList = true
        })
        builder.addCase(getBrokersListWithPagination.fulfilled, (state, action) => {
            state.brokersListWithPagination = {...action.payload}
            state.loadingList = false
        })
        builder.addCase(getBrokersListWithPagination.rejected, (state, action) => {
            state.loadingList = false
        })
        builder.addCase(deleteBroker.fulfilled, (state, action) => {
            state.brokersListWithPagination.response.brokerList = state.brokersListWithPagination.response?.brokerList?.filter(item => item.id !== action.payload)
        })
    }
})

const {reducer} = brokerSlice

export default reducer