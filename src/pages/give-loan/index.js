import Layout from "../../components/Layout";
import Tasvie from "../../assets/images/tasvie.svg";
import GiveLoan from "../../components/GiveLoan";

const GiveLoanPage=(props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={Tasvie} alt={'اعطای تسهیلات'}/>
            <div>اعطای تسهیلات</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <GiveLoan />
        </Layout>
    )
}

export default GiveLoanPage