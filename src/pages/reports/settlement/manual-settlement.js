import Layout from "../../../components/Layout";
import ReportSamattSettlement from "../../../assets/images/report-samat-settlement.svg";
import React from "react";
import ReportManualSettlement from "../../../components/Reports/ReportManualSettlement";

const ReportsManualSettlementPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportSamattSettlement} alt={'گزارش تسویه های دستی'}/>
            <div>گزارش تسویه های دستی</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportManualSettlement />
        </Layout>
    )
}

export default ReportsManualSettlementPage