import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl,
    CreateBranch, DeleteBranch, EditBranch,
    EditStakeHolder,
    GetBranchById,
    GetBranchList, GetBranchListWithPagination
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";


export const getBranchesList = createAsyncThunk(
    'branches/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post( GetBranchList, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data.branchList
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getBranchesListWithPagination = createAsyncThunk(
    'branches/listPagination',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetBranchListWithPagination, data, {baseURL: BrokerSettlementBaseUrl})
            return  res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getBranchById = createAsyncThunk(
    'branches/get',
    async (id) => {
        try {
            const res = await request.get(GetBranchById + `?id=${id}`, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        }
        catch(e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const createBranch = createAsyncThunk(
    'branches/create',
    async (data) => {
        request.post(CreateBranch, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            if (res) {
                toast.success('شعبه با موفقیت ثبت شد')
            }
            history.push('/branches')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
            })
    }
)

export const editBranch = createAsyncThunk(
    'branches/edit',
    async (data) => {
        request.post(EditBranch, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            if (res) {
                toast.success('شعبه با موفقیت ویرایش شد')
            }
            history.push('/branches')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
            })
    }
)

export const deleteBranch = createAsyncThunk(
    'branches/delete',
    async (id,thunkAPI) => {
        try {
            const res = await request.post(DeleteBranch, {id}, {baseURL: BrokerSettlementBaseUrl})
            if (res) {
                toast.success('شعبه با موفقیت حذف شد')
                thunkAPI.dispatch(getBranchesList({}))
                return id
            }
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage || e.response.data.message)
        }
    }
)


export const branchSlice = createSlice({
    name: 'branch',
    initialState: {
        branchesList: [],
        branchesListWithPagination: {},
        branchInfo: {},
        loading: true
    },
    extraReducers: (builder) => {
        builder.addCase(getBranchById.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getBranchById.fulfilled, (state, action) => {
            state.branchInfo = {...action.payload}
            state.loading = false
        })
        builder.addCase(getBranchById.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(getBranchesList.fulfilled, (state, action) => {
            state.branchesList = [...action.payload]
            state.loading = false
        })
        builder.addCase(getBranchesListWithPagination.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getBranchesListWithPagination.fulfilled, (state, action) => {
            state.branchesListWithPagination = {...action.payload}
            state.loading = false
        })
        builder.addCase(getBranchesListWithPagination.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(deleteBranch.fulfilled, (state, action) => {
            state.branchesListWithPagination.response.branchList = state.branchesListWithPagination?.response?.branchList?.filter(item => item.id !== action.payload)
        })
    }
})

const {reducer} = branchSlice

export default reducer