import Layout from "../../../components/Layout";
import ReportSamattInquiry from '../../../assets/images/report-samat-inquiry.svg'
import React, {useEffect, useState} from "react";
import ReportSamatInquiry from "../../../components/Reports/ReportInquiry/ReportSamatInquiry";

const ReportsSamatInquiryPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportSamattInquiry} alt={'گزارش استعلام های ذینفع'}/>
            <div>گزارش استعلام های ذینفع</div>
        </div>
    )


    return (
        <Layout content={true} title={title}>
            <ReportSamatInquiry />
        </Layout>
    )
}

export default ReportsSamatInquiryPage