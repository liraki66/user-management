import Layout from "../../../components/Layout";
import ReportDailySettlement from "../../../components/Reports/ReportDailySettlement/ReportDailySettlement";
import ReportStakeholderAccount from "../../../components/Reports/ReportDailySettlement/ReportStakeholderAccount";
import ReportSamattSettlement from "../../../assets/images/report-samat-settlement.svg";

const ReportsDailySettlementPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={ReportSamattSettlement} alt={'گزارش استعلام های ذینفع'}/>
            {/*<div>گزارش تراکنش های واریز به سپرده ذینفع</div>*/}
            <div>گزارش تسویه های روزانه بدهی شرکت کارگزاری</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            {/*<ReportDailySettlement />*/}
            <ReportStakeholderAccount />
        </Layout>
    )
}

export default ReportsDailySettlementPage