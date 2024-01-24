import Layout from "../../components/Layout";
import Tasvie from "../../assets/images/tasvie.svg";
import StakeholderSettlement from "../../components/StakeholderSettlement";

const StakeholderSettlementPage=(props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={Tasvie} alt={'تسویه با ذینفع قرارداد'}/>
            <div>تسویه با ذینفع قرارداد</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <StakeholderSettlement />
        </Layout>
    )
}

export default StakeholderSettlementPage