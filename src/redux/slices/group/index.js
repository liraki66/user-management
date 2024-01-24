import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl,
    CreateGroupAsync,
    CreateUser,
    DeleteGroupAsync,
    DeleteUser,
    EditGroupAsync,
    EditUser,
    GetAllPermissionsAsync,
    GetGroupByIdAsync,
    GetGroupsAsync, GetGroupsAsyncWithPagination,
    GetUserById,
    GetUserList,
    GetUserListWithPagination
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";


export const getGroupsAsync = createAsyncThunk(
    'groups/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetGroupsAsync, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getGroupsAsyncWithPagination = createAsyncThunk(
    'groupsPagination/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetGroupsAsyncWithPagination, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getGroupByIdAsync = createAsyncThunk(
    'groups/get',
    async (id) => {
        try {
            const res = await request.get(GetGroupByIdAsync + `?id=${id}`, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
        }
    }
)

export const createGroupAsync = createAsyncThunk(
    'groups/create',
    async (data) => {

        await request.post(CreateGroupAsync, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            toast.success('گروه با موفقیت ثبت شد')
            history.push('/groups')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            })
    }
)

export const editGroupAsync = createAsyncThunk(
    'groups/edit',
    async (data) => {

        await request.post(EditGroupAsync, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            toast.success('گروه با موفقیت ویرایش شد')
            history.push('/groups')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            })
    }
)

export const deleteGroupAsync = createAsyncThunk(
    'groups/delete',
    async (id) => {
        try {
            const res = await request.post(DeleteGroupAsync, {id}, {baseURL: BrokerSettlementBaseUrl})
            if (res) {
                toast.success('گروه با موفقیت حذف شد')
                return id
            }
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,'') || e.response.data.message?.replace(/[|]/g,''))
        }
    }
)

export const getAllPermissionsAsync = createAsyncThunk(
    'groups/permission',
    async (data, thunkAPI) => {
        try {
            const res = await request.get(GetAllPermissionsAsync, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            return thunkAPI.rejectWithValue(e)
        }
    }
)


export const groupSlice = createSlice({
    name: 'group',
    initialState: {
        groupsList: {},
        groupsListWithPagination: {},
        groupInfo: {},
        permissionsList:[],
        loadingList: false,
        loadingSingle: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getGroupByIdAsync.pending, (state, action) => {
            state.loadingSingle = true
        })
        builder.addCase(getGroupByIdAsync.fulfilled, (state, action) => {
            state.groupInfo = {...action.payload}
            state.loadingSingle = false
        })
        builder.addCase(getGroupByIdAsync.rejected, (state, action) => {
            state.loadingSingle = false
        })
        builder.addCase(getGroupsAsync.fulfilled, (state, action) => {
            state.groupsList = {...action.payload}
            state.loadingList = false
        })
        builder.addCase(getGroupsAsyncWithPagination.fulfilled, (state, action) => {
            state.groupsListWithPagination = {...action.payload}
            state.loadingList = false
        })
        builder.addCase(getAllPermissionsAsync.fulfilled, (state, action) => {
            state.permissionsList = [...action.payload]
            state.loadingList = false
        })
        builder.addCase(deleteGroupAsync.fulfilled, (state, action) => {
            state.groupsListWithPagination.response.groups = state.groupsListWithPagination?.response?.groups.filter(item => item.id !== action.payload)
        })
    }
})

const {reducer} = groupSlice

export default reducer