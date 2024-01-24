import Layout from "../../../components/Layout";
import ReportSamattSettlement from "../../../assets/images/report-samat-settlement.svg";
import ReportSamatSettlement from "../../../components/Reports/ReportSamatSettlement";
import React,{useState} from "react";
import ReportStakeholderAccount from "../../../components/Reports/ReportDailySettlement/ReportStakeholderAccount";

const ReportsDailySettlementStakeholderPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportSamattSettlement} alt={'گزارش استعلام های ذینفع'}/>
            <div>تراکنش های واریز به سپرده ذینفع</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportStakeholderAccount />
        </Layout>
    )
}

export default ReportsDailySettlementStakeholderPage