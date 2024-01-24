import Layout from "../../components/Layout";
import AddEditContract from "../../components/Contracts/AddEditContract";
import garardad from '../../assets/images/garardad.svg'
import {useNavigate,useLocation} from "react-router-dom";

const AddEditContractPage = (props)=>{

    const location = useLocation()

    console.log(location)

    const title = (
        <div className={'title-section'}>
            <img src={garardad} alt={'قراردادها'}/>
            <div>{location.pathname.includes('edit')? 'ویرایش قرارداد':'ثبت قرارداد جدید'}</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <AddEditContract />
        </Layout>
    )
}

export default AddEditContractPage