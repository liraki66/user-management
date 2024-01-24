import Layout from "../../../components/Layout";
import ReportSamattSettlement from "../../../assets/images/report-samat-settlement.svg";
import ReportSamatSettlement from "../../../components/Reports/ReportSamatSettlement";
import React,{useState} from "react";

const ReportsSamatSettlementPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportSamattSettlement} alt={'گزارش استعلام های ذینفع'}/>
            <div>گزارش تسویه بدهی با ذینفع</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportSamatSettlement />
        </Layout>
    )
}

export default ReportsSamatSettlementPage