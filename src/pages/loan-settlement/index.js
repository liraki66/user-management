import Layout from "../../components/Layout";
import Tasvie from "../../assets/images/tasvie.svg";
import LoanSettlement from "../../components/LoanSettlement";

const LoanSettlementPage=(props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={Tasvie} alt={'تسویه تسهیلات'}/>
            <div>تسویه تسهیلات</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <LoanSettlement />
        </Layout>
    )
}

export default LoanSettlementPage