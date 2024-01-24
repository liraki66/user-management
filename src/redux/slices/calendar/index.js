import {createSlice, createAsyncThunk, current} from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl,
    GetWeekDayNames,
    GetCalendarData,
    SetWorkingDays,
    SetHolidays,
} from "../../../services/constants";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";
import {deleteBroker, getBrokerById, getBrokersList, getBrokersListWithPagination} from "../broker";


export const getWeekDayNames = createAsyncThunk(
    'calendar/days',
    async () => {
        try {
            const res = await request.get(GetWeekDayNames, {baseURL: BrokerSettlementBaseUrl})
            return res.data.weekDayNames
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getCalendarData = createAsyncThunk(
    'calendar/daysPagination',
    async (data, thunkAPI) => {
        try {
            const res = await request.post(GetCalendarData, data, {baseURL: BrokerSettlementBaseUrl})
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
            return thunkAPI.rejectWithValue(e)
        }
    }
)

export const setWorkingDays = createAsyncThunk(
    'calendar/working',
    async (data) => {
        await request.post(SetWorkingDays, data, {baseURL: BrokerSettlementBaseUrl})
            .then(res => {
                toast.success('روزهای کاری با موفقیت ثبت شد')
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
            })
    }
)

export const setHolidays = createAsyncThunk(
    'calendar/holiday',
    async (data) => {
        await request.post(SetHolidays, data, {baseURL: BrokerSettlementBaseUrl})
            .then(res => {
                toast.success('روزهای تعطیل با موفقیت ثبت شد')
            })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
            })
    }
)

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        weekDayNames:[],
        calendarDataWithPagination: {},
        loadingList: false,
        loadingSingle: false,
    },
    extraReducers: (builder) => {
        builder.addCase(getWeekDayNames.fulfilled, (state, action) => {
            state.weekDayNames = [...action.payload]
            state.loadingList = false
        })
        builder.addCase(getCalendarData.pending, (state, action) => {
            state.loadingList = true
        })
        builder.addCase(getCalendarData.fulfilled, (state, action) => {
            state.calendarDataWithPagination = {...action.payload}
            state.loadingList = false
        })
        builder.addCase(getCalendarData.rejected, (state, action) => {
            state.loadingList = false
        })
    }
})

const {reducer} = calendarSlice

export default reducer