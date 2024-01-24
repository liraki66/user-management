import Layout from "../../components/Layout";
import FaaliatKarbaran from '../../assets/images/faaliat-karbaran-black.svg'
import React,{useState} from "react";
import ReportUsersActivity from "../../components/Reports/ReportUsersActivity";

const ReportsUsersActivityPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={FaaliatKarbaran} alt={''} style={{width:'30px'}}/>
            <div>گزارش فعالیت کاربران</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportUsersActivity />
        </Layout>
    )
}

export default ReportsUsersActivityPage