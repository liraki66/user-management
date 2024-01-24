import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {
    BrokerSettlementBaseUrl, CancelContractTermination, CreateContract, DeleteBroker,
    DeleteContract, EditContract, GetContractById,
    GetContractList, GetContractListWithPagination, GetContractStatus, RegisterContractTermination, TerminateContract
} from "../../../services/constants";
import {message} from "antd";
import request from "../../../services/request";
import history from "../../../services/CustomRouter";
import {toast} from "react-toastify";

export const getContractsList = createAsyncThunk(
    'contracts/list',
    async (data) => {
        try {
            const res = await request.post(GetContractList, data)
            return res.data.contractList
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getContractsListWithPagination = createAsyncThunk(
    'contracts/listPagination',
    async (data) => {
        try {
            const res = await request.post(GetContractListWithPagination, data)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const getContractById = createAsyncThunk(
    'contracts/get',
    async (id) => {
        try {
            const res = await request.get(GetContractById + `?id=${id}`)
            return res.data
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const createContract = createAsyncThunk(
    'contracts/create',
    async (data) => {
        await request.post(CreateContract, data).then(res => {
            toast.success('قرارداد با موفقیت ثبت شد')
            history.push('/contracts')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
            })


    }
)

export const editContract = createAsyncThunk(
    'contracts/edit',
    async (data) => {
        await request.post(EditContract, data).then(res => {
            toast.success('قرارداد با موفقیت ویرایش شد')
            history.push('/contracts')
        })
            .catch(e => {
                toast.error(e.response.data.FaErrorMessage)
            })
    }
)

export const deleteContract = createAsyncThunk(
    'contracts/delete',
    async (id) => {
        try {
            const res = await request.post(DeleteContract, {id}, {baseURL: BrokerSettlementBaseUrl})
            if (res) {
                toast.success('قرارداد با موفقیت حذف شد')
                return id
            }
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage || e.response.data.message)
        }
    }
)

export const firstTerminateContract = createAsyncThunk(
    'contracts/firstTerminate',
    async (data) => {
        try {
            await request.post(RegisterContractTermination, data).then(res => {
                toast.success('فسخ اولیه قرارداد با موفقیت انجام شد')
                history.push('/contracts')
            })
                .catch(e => {
                    toast.error(e.response.data.FaErrorMessage)
                })
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const finalTerminateContract = createAsyncThunk(
    'contracts/finalTerminate',
    async (data) => {
        try {
            await request.post(TerminateContract, data).then(res => {
                toast.success('فسخ نهایی قرارداد با موفقیت انجام شد')
                history.push('/contracts')
            })
                .catch(e => {
                    toast.error(e.response.data.FaErrorMessage)
                })
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)
        }
    }
)

export const cancelTerminateContract = createAsyncThunk(
    'contracts/cancelTerminate',
    async (data) => {
        try {
            await request.post(CancelContractTermination, data).then(res => {
                toast.success('قرارداد در وضعیت فعال قرار گرفت')
            })
                .catch(e => {
                    toast.error(e.response.data.FaErrorMessage)

                })
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)

        }
    }
)

export const getContractStatus = createAsyncThunk(
    'contracts/status',
    async () => {
        try {
            const res = await request.get(GetContractStatus)
            return res.data.contractStatus
        } catch (e) {
            toast.error(e.response.data.FaErrorMessage)

        }
    }
)


export const contractSlice = createSlice({
    name: 'contract',
    initialState: {
        contractsList: [],
        contractsListWithPagination: {},
        contractInfo: {},
        contractStatus: [],
        loading: true
    },
    extraReducers: (builder) => {
        builder.addCase(getContractsList.fulfilled, (state, action) => {
            state.contractsList = [...action.payload]
            state.loading = false
        })
        builder.addCase(getContractsListWithPagination.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(getContractsListWithPagination.fulfilled, (state, action) => {
            state.contractsListWithPagination = {...action.payload}
            state.loading = false
        })
        builder.addCase(getContractsListWithPagination.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(getContractById.fulfilled, (state, action) => {
            state.contractInfo = {...action.payload}
        })
        builder.addCase(deleteContract.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(deleteContract.fulfilled, (state, action) => {
            state.contractsListWithPagination.response.contractList = state.contractsListWithPagination?.response?.contractList?.filter(item => item.id !== action.payload)
        })
        builder.addCase(deleteContract.rejected, (state, action) => {
            state.loading = false
        })
        builder.addCase(getContractStatus.fulfilled, (state, action) => {
            state.contractStatus = [...action.payload]
        })
    }
})

const {reducer} = contractSlice

export default reducer