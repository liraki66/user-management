import Layout from "../../../components/Layout";
import ReportYaghoottInquiry from '../../../assets/images/report-yaghoot-inquiry.svg'
import React from "react";
import ReportYaghootInquiry from "../../../components/Reports/ReportInquiry/ReportYaghootInquiry";

const ReportsYaghootInquiryPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportYaghoottInquiry} alt={'گزارش استعلام های یاقوت'}/>
            <div>گزارش استعلام های یاقوت</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportYaghootInquiry />
        </Layout>
    )
}

export default ReportsYaghootInquiryPage