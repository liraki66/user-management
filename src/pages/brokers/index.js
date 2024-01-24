import Layout from "../../components/Layout";
import Brokers from "../../components/Brokers";
import kargozar from '../../assets/images/kargozar.svg'
import {useNavigate} from "react-router-dom";

const BrokerPage = (props)=>{

    const navigation = useNavigate()

    const addNewBrokerHandler = ()=>{
        navigation('/brokers/add-broker')
    }

    const title = (
        <div className={'title-section'}>
            <img src={kargozar} alt={'کارگزاران'}/>
            <div>شرکت های کارگزاری</div>
        </div>
    )

    return (
        <Layout content={true} title={title} buttonTitle={'افزودن شرکت کارگزاری'} onClickButton={addNewBrokerHandler}>
            <Brokers />
        </Layout>
    )
}

export default BrokerPage