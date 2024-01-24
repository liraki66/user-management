import Layout from "../../../components/Layout";
import ReportSamattSettlement from "../../../assets/images/report-samat-settlement.svg";
import ReportSamatSettlement from "../../../components/Reports/ReportSamatSettlement";
import React,{useState} from "react";
import ReportStakeholderAccount from "../../../components/Reports/ReportDailySettlement/ReportStakeholderAccount";
import ReportBrokerAccount from "../../../components/Reports/ReportDailySettlement/ReportBrokerAccount";

const ReportsDailySettlementBrokerPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportSamattSettlement} alt={'گزارش استعلام های ذینفع'}/>
            <div>تراکنش های برداشت از سپرده کارگزاری</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportBrokerAccount />
        </Layout>
    )
}

export default ReportsDailySettlementBrokerPage