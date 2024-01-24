import Layout from "../../components/Layout";
import Tasvie from "../../assets/images/tasvie.svg";
import BankDebtorsSettlement from "../../components/BankDebtorsSettlement";

const BankDebtorsSettlementPage=(props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={Tasvie} alt={'تسویه حساب با سرفصل بدهکاران بانک'}/>
            <div>تسویه سرفصل بدهکاران بانک</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <BankDebtorsSettlement />
        </Layout>
    )
}

export default BankDebtorsSettlementPage