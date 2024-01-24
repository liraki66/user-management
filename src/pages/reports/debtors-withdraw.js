import Layout from "../../components/Layout";
import ReportSamattSettlement from "../../assets/images/report-samat-settlement.svg";
import ReportDebtorsWithdraw from "../../components/Reports/ReportDebtorsWithdraw";
import React,{useState} from "react";

const ReportsDebtorsWithdrawPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportSamattSettlement} alt={'گزارش استعلام های سمات'}/>
            <div>گزارش برداشت های انجام شده از سرفصل بدهکاران</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportDebtorsWithdraw />
        </Layout>
    )
}

export default ReportsDebtorsWithdrawPage