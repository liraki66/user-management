import Layout from "../../components/Layout";
import Contracts from "../../components/Contracts";
import garardad from '../../assets/images/garardad.svg'
import {useNavigate} from "react-router-dom";

const ContractsPage = (props)=>{


    const navigation = useNavigate()

    const addNewContractHandler = ()=>{
        navigation('/contracts/add-contract')
    }


    const title = (
        <div className={'title-section'}>
            <img src={garardad} alt={'قراردادها'}/>
            <div>قراردادها</div>
        </div>
    )

    return (
        <Layout content={true} title={title}  buttonTitle={'افزودن قرارداد جدید'} onClickButton={addNewContractHandler}>
            <Contracts />
        </Layout>
    )
}

export default ContractsPage