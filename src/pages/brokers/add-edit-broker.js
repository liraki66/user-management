import Layout from "../../components/Layout";
import AddEditBroker from "../../components/Brokers/AddEditBroker";
import kargozar from '../../assets/images/kargozar.svg'
import {useLocation} from "react-router-dom";


const AddEditBrokerPage = (props)=>{

    const location = useLocation()

    const title = (
        <div className={'title-section'}>
            <img src={kargozar} alt={'کارگزاران'}/>
            <div>{location.pathname.includes('edit')? 'ویرایش شرکت کارگزاری':'ثبت شرکت کارگزاری جدید'}</div>
        </div>
    )

    return (
        <Layout content={true} title={title} >
            <AddEditBroker />
        </Layout>
    )
}

export default AddEditBrokerPage