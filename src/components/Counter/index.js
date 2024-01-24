// import CounterItem from "./CounterItem";
// import {Row} from "antd";
// import KargozarActive from '../../assets/images/kargozar_Active.svg'
// import EstelamActive from '../../assets/images/estelam_active.svg'
// import TasvieActive from '../../assets/images/tasvie_active.svg'
// import GharardadActive from '../../assets/images/garardad_active.svg'
// import GhozareshActive from '../../assets/images/gozaresh_active.svg'
//
// const Counter = (props)=> {
//     return (
//         <Row gutter={[{ md: 16, lg: 16,xl:24,xxl:48 },8]} className={'counter-container'}>
//         {/*<CounterItem name={'شرکت های کارگزاری'} logoSrc={KargozarActive} footerText={'تعداد کارگزاران'} footerNumber={'120'} />*/}
//         <CounterItem name={'استعلام'} logo={EstelamActive} footerText={'تعداد استعلام های انجام شده'} footerNumber={'5321'}/>
//         <CounterItem name={'تسویه حساب'} logo={TasvieActive} settlement={true} manual={'124'} auto={'1024'}/>
//         {/*<CounterItem name={'قراردادها'} logoSrc={GharardadActive} footerText={'تعداد قراردادهای منعقده'} footerNumber={'120'}/>*/}
//         <CounterItem name={'گزارشات'} logo={GhozareshActive} footerText={'تعداد بازدید'} footerNumber={'120'}/>
//
//         </Row>
//     )
// }
//
// export default Counter

import CounterItem from "./CounterItem";
import {Row} from "antd";
import KargozarActive from '../../assets/images/kargozar_Active.svg'
import EstelamYaghoot from '../../assets/images/report-yaghoot-inquiry.svg'
import TasvieActive from '../../assets/images/tasvie_active.svg'
import GharardadActive from '../../assets/images/garardad_active.svg'
import GhozareshActive from '../../assets/images/gozaresh_active.svg'
import Estelam from '../../assets/images/estelam.svg'
import Stakeholder from '../../assets/images/stakeholder.svg'
import BankDebtors from '../../assets/images/bank-debtor-settlement.svg'
import Tasvie from '../../assets/images/tasvie.svg'
import BankSettle from '../../assets/images/bank-settle.svg'
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getStatistics} from "../../redux/slices/broker-settlement";
import {ToastContainer} from "react-toastify";

const Counter = (props)=> {

    const [count,setCount]=useState(0)

    const stats=useSelector(state=>state.brokerSettlement.statistics)


    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getStatistics()).then(res=>{
            calculateCount(res.payload)
        })
    },[])

    const calculateCount = data =>{
        delete data.yaghutInquiryCount
        const values = Object.values(data)
        const sum = values.reduce((a,b)=>a+b,0)
        setCount(sum)
    }

    const calculatePercentage = (itemCount,total) =>{
        const value = Math.floor((itemCount/total)*100)
        return value
    }

    return (
        <Row gutter={[{ md: 16, lg: 16,xl:48,xxl:24 },8]} className={'counter-container'}>
            <ToastContainer style={{fontFamily:'IRANSans'}}
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={true}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl
                            pauseOnFocusLoss={false}
                            draggable={false}
                            pauseOnHover={true}
                            theme="colored"/>
            <CounterItem name={'استعلام'} logoSrc={Estelam} footerText={'تعداد استعلام های انجام شده از ذینفعان'} progress={calculatePercentage(stats?.stakeHolderInquiryCount,count)} number={stats?.stakeHolderInquiryCount}/>
            {/*<CounterItem name={'استعلام'} logoSrc={TasvieActive} footerText={'تعداد استعلام های انجام شده از یاقوت'} progress={calculatePercentage(stats?.yaghutInquiryCount,count)} number={stats?.yaghutInquiryCount}/>*/}
            <CounterItem name={'تسویه حساب'} logoSrc={Stakeholder} footerText={'تعداد تسویه حساب با ذینفعان'} progress={calculatePercentage(stats?.settlementWithStakeHolderCount,count)} number={stats?.settlementWithStakeHolderCount}/>
            <CounterItem name={'تسویه حساب'} logoSrc={Tasvie} footerText={'تعداد تسویه حساب با سرفصل بدهکاران بانک'} progress={calculatePercentage(stats?.settlementWithBankDebtorsCount,count)} number={stats?.settlementWithBankDebtorsCount}/>
            <CounterItem name={'تسویه حساب'} logoSrc={BankSettle} footerText={'تعداد تسویه کارگزاری ها با بانک'} progress={calculatePercentage(stats?.settlementWithBankCount,count)} number={stats?.settlementWithBankCount}/>
        </Row>
    )
}

export default Counter
