import axios from "axios";
import {message} from "antd";
import {BrokerSettlementBaseUrl, GetBrokerList, GetMarketList} from "./constants";
import dayjs from "dayjs";

message.config({
    maxCount: 1,
});

export const getMarketType = async (data)=>{
    let fetchedData = await axios.post(GetMarketList,data,{baseURL:BrokerSettlementBaseUrl})
    return fetchedData
}

export const getBrokerList = async (data)=>{
    let fetchedData = await axios.post(GetBrokerList,data,{baseURL:BrokerSettlementBaseUrl})
    return fetchedData
}

export const removeIR = (text)=>{
    let result = text.replace("IR","")
    return result
}

export const onKeyPressHandler = (event)=>{
    if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
}

export const currentDate = new Date().toLocaleDateString('fa-IR-u-nu-latn',{year:'numeric',month:'2-digit',day:'2-digit',formatMatcher:'basic'})
export const nextWeekDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fa-IR-u-nu-latn',{year:'numeric',month:'2-digit',day:'2-digit',formatMatcher:'basic'})
export const yesterdayDate = new Date(dayjs().subtract(1, 'day')).toLocaleDateString('fa-IR-u-nu-latn',{year:'numeric',month:'2-digit',day:'2-digit',formatMatcher:'basic'})
export const yesterdayDateTime = new Date(dayjs().subtract(1, 'day')).toLocaleDateString('fa-IR-u-nu-latn',{year:'numeric',month:'2-digit',day:'2-digit',formatMatcher:'basic'})+ ' 00:00:00'
export const currentDateTime = new Date().toLocaleDateString('fa-IR-u-nu-latn',{year:'numeric',month:'2-digit',day:'2-digit',formatMatcher:'basic'}) + ' 00:00:00'