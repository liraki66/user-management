import {configureStore} from '@reduxjs/toolkit'
import brokerReducer from './slices/broker'
import contractReducer from './slices/contract'
import brokerSettlementReducer from './slices/broker-settlement'
import authReducer from './slices/auth'
import reportReducer from './slices/report'
import branchReducer from "./slices/branches";
import stakeholderReducer from "./slices/stakeholders";
import userReducer from "./slices/user";
import calendarReducer from "./slices/calendar"
import groupReducer from "./slices/group";

const store = configureStore({
    reducer: {
        auth: authReducer,
        brokers: brokerReducer,
        contracts: contractReducer,
        calendar:calendarReducer,
        stakeholders: stakeholderReducer,
        branches: branchReducer,
        users:userReducer,
        groups: groupReducer,
        brokerSettlement: brokerSettlementReducer,
        reports: reportReducer
    },
})

export default store