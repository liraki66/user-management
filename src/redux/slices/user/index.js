import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl,
    CreateUser, DeleteUser, EditUser,
    GetUserById,
    GetUserList, GetUserListWithPagination
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";


export const getUsersList = createAsyncThunk(
    'users/list',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetUserList, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data.users
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getUsersListWithPagination = createAsyncThunk(
    'users/listPagination',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetUserListWithPagination, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const getUserById = createAsyncThunk(
    'users/get',
    async (id) => {
        try {
            const res = await request.get(GetUserById + `?id=${id}`, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
        }
    }
)

export const createUser = createAsyncThunk(
    'users/create',
    async (data) => {

        await request.post(CreateUser, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            toast.success('کاربر با موفقیت ثبت شد')
            history.push('/users')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            })
    }
)

export const editUser = createAsyncThunk(
    'users/edit',
    async (data) => {

        await request.post(EditUser, data, {baseURL: BrokerSettlementBaseUrl}).then(res => {
            toast.success('کاربر با موفقیت ویرایش شد')
            history.push('/users')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,''))
            })
    }
)

export const deleteUser = createAsyncThunk(
    'users/delete',
    async (id) => {
        try {
            const res = await request.post(DeleteUser, {id}, {baseURL: BrokerSettlementBaseUrl})
            if (res) {
                toast.success('کاربر با موفقیت حذف شد')
                return id
            }
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage?.replace(/[|]/g,'') || e.response.data.message?.replace(/[|]/g,''))
        }
    }
)


export const userSlice = createSlice({
    name: 'user',
    initialState: {
        usersList: [],
        usersListWithPagination: {},
        userInfo: {},
        loadingList: false,
        loadingSingle: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getUserById.pending, (state, action) => {
            state.loadingSingle = true
        })
        builder.addCase(getUserById.fulfilled, (state, action) => {
            state.userInfo = {...action.payload}
            state.loadingSingle = false
        })
        builder.addCase(getUserById.rejected, (state, action) => {
            state.loadingSingle = false
        })
        builder.addCase(getUsersList.fulfilled, (state, action) => {
            state.usersList = [...action.payload]
            state.loadingList = false
        })
        builder.addCase(getUsersListWithPagination.pending, (state, action) => {
            state.loadingList = true
        })
        builder.addCase(getUsersListWithPagination.fulfilled, (state, action) => {
            state.usersListWithPagination = {...action.payload}
            state.loadingList = false
        })
        builder.addCase(getUsersListWithPagination.rejected, (state, action) => {
            state.loadingList = false
        })
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.usersListWithPagination.response.users = state.usersListWithPagination?.response?.users.filter(item => item.id !== action.payload)
        })
    }
})

const {reducer} = userSlice

export default reducer