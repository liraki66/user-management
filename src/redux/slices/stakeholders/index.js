import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl,
    CreateStakeHolder,
    DeleteStakeHolder, EditStakeHolder,
    GetStakeHolderById,
    GetStakeHolderList, GetStakeHolderListWithPagination
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";

export const getStakeholdersList = createAsyncThunk(
    'stakeholders/list',
    async (data,thunkAPI)=>{
        try {
            const res = await request.post( GetStakeHolderList,data,{baseURL:BrokerSettlementBaseUrl})
            return res.data.stakeHolderDtoList
        }
        catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getStakeholdersListWithPagination = createAsyncThunk(
    'stakeholders/listPagination',
    async (data,thunkAPI)=>{
        try {
            const res = await request.post(GetStakeHolderListWithPagination,data,{baseURL:BrokerSettlementBaseUrl})
            return res.data
        }
        catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getStakeholderById = createAsyncThunk(
    'stakeholders/get',
    async (id)=>{
        try {
            const res = await request.get(GetStakeHolderById+`?id=${id}`,{baseURL:BrokerSettlementBaseUrl})
            return res.data
        }
        catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const createStakeholder = createAsyncThunk(
    'stakeholders/create',
    async (data)=>{
        try {
            const res = await request.post(CreateStakeHolder,data,{baseURL:BrokerSettlementBaseUrl})
            if (res){
                toast.success('ذینفع با موفقیت ثبت شد')
            }
            history.push('/stakeholders')
        }
        catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const editStakeholder = createAsyncThunk(
    'stakeholders/edit',
    async (data)=>{
        try {
            const res = await request.post(EditStakeHolder,data,{baseURL:BrokerSettlementBaseUrl})
            if (res){
                toast.success('ذینفع با موفقیت ویرایش شد')
            }
            history.push('/stakeholders')
        }
        catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const deleteStakeholder = createAsyncThunk(
    'stakeholders/delete',
    async (id)=>{
        try {
            const res = await request.post(DeleteStakeHolder, {id}, {baseURL: BrokerSettlementBaseUrl})
            if (res) {
                toast.success('ذینفع با موفقیت حذف شد')
                return id
            }
        }
        catch (e) {
            toast.error(e.response.data.FaErrorMessage || e.response.data.message)
        }
    }
)


export const stakeholderSlice = createSlice({
    name: 'stakeholder',
    initialState: {
        stakeholdersList:[],
        stakeholdersListWithPagination: {},
        stakeholderInfo: {},
        loadingList: false,
        loadingSingle: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getStakeholderById.pending,(state,action)=>{
            state.loadingSingle = true
        })
        builder.addCase(getStakeholderById.fulfilled,(state,action)=>{
            state.stakeholderInfo = {...action.payload}
            state.loadingSingle = false
        })
        builder.addCase(getStakeholderById.rejected,(state,action)=>{
            state.loadingSingle = false
        })
        builder.addCase(getStakeholdersList.fulfilled,(state,action)=>{
            state.stakeholdersList = [...action.payload]
        })
        builder.addCase(getStakeholdersListWithPagination.pending,(state,action)=>{
            state.loadingList = true
        })
        builder.addCase(getStakeholdersListWithPagination.fulfilled,(state,action)=>{
            state.stakeholdersListWithPagination = {...action.payload}
            state.loadingList = false
        })
        builder.addCase(getStakeholdersListWithPagination.rejected,(state,action)=>{
            state.loadingList = false
        })
        builder.addCase(deleteStakeholder.fulfilled,(state,action)=>{
            state.stakeholdersListWithPagination.response.stakeHolderDtoList=state.stakeholdersListWithPagination?.response?.stakeHolderDtoList?.filter(item=>item.id !== action.payload)
        })
    }
})

const {reducer} = stakeholderSlice

export default reducer