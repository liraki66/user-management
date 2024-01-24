import Layout from "../../components/Layout";
import Brokers from "../../components/Brokers";
import kargozar from '../../assets/images/kargozar.svg'
import {useNavigate} from "react-router-dom";
import Calendar from "../../components/Calendar";

const CalendarPage = (props)=>{

    const navigation = useNavigate()

    const addNewBrokerHandler = ()=>{
        navigation('/brokers/add-broker')
    }

    const title = (
        <div className={'title-section'}>
            <img src={kargozar} alt={'تقویم'}/>
            <div>تنظیم تقویم کاری</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <Calendar />
        </Layout>
    )
}

export default CalendarPage