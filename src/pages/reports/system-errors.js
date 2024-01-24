import SystemErrors from "../../assets/images/faaliat-karbaran-black.svg";
import Layout from "../../components/Layout";
import ReportSystemErrors from "../../components/Reports/ReportSystemErrors";

const ReportSystemErrorsPage = ()=>{
    const title = (
        <div className={'title-section'}>
            <img src={SystemErrors} alt={''} style={{width:'30px'}}/>
            <div>گزارش خطاهای سیستمی</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <ReportSystemErrors />
        </Layout>
    )
}

export default ReportSystemErrorsPage