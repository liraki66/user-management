import BankSettlement from "../../components/BankSettlement";
import Layout from "../../components/Layout";
import Tasvie from "../../assets/images/tasvie.svg";

const BankSettlementPage=(props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={Tasvie} alt={'تسویه حساب با سمات'}/>
            <div>تسویه شرکت کارگزاری با بانک</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <BankSettlement />
        </Layout>
    )
}

export default BankSettlementPage