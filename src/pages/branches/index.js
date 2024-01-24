import Layout from "../../components/Layout";
import branch from '../../assets/images/branch.svg'
import {useNavigate} from "react-router-dom";
import Branches from "../../components/Branches";

const BranchPage = (props)=>{

    const navigation = useNavigate()

    const addNewBrokerHandler = ()=>{
        navigation('/branches/add-branch')
    }

    const title = (
        <div className={'title-section'}>
            <img src={branch} alt={'شعب'}/>
            <div>شعب</div>
        </div>
    )

    return (
        <Layout content={true} title={title} buttonTitle={'افزودن شعبه جدید'} onClickButton={addNewBrokerHandler}>
            <Branches />
        </Layout>
    )
}

export default BranchPage