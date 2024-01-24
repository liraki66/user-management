import Layout from "../../components/Layout";
import ReportBrokerDebt from "../../assets/images/report-broker-debt.svg";
import ReportBrokerDebtToBank from "../../components/Reports/ReportBrokerDebtToBank";
import React,{useState} from "react";

const ReportsBrokerDebtPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportBrokerDebt} alt={''} style={{width:'30px'}}/>
            <div>گزارش بدهی های شرکت های کارگزاری به بانک</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportBrokerDebtToBank />
        </Layout>
    )
}

export default ReportsBrokerDebtPage