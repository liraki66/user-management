import SamatSettlement from "../../components/SamatSettlement";
import Layout from "../../components/Layout";
import Tasvie from "../../assets/images/tasvie.svg";

const SamatSettlementPage=(props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={Tasvie} alt={'تسویه حساب با سمات'}/>
            <div>تسویه حساب با سمات</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <SamatSettlement />
        </Layout>
    )
}

export default SamatSettlementPage