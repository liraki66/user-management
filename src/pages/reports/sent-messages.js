import SentMessages from "../../assets/images/sent-messages.svg";
import Layout from "../../components/Layout";
import ReportSentMessages from "../../components/Reports/ReportSentMessages";

const ReportSentMessagesPage = ()=>{
    const title = (
        <div className={'title-section'}>
            <img src={SentMessages} alt={''} style={{width:'30px'}}/>
            <div>گزارش پیامک های ارسال شده</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportSentMessages />
        </Layout>
    )
}

export default ReportSentMessagesPage