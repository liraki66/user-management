import Layout from "../../components/Layout";
import stakeholder from '../../assets/images/stakeholder.svg'
import {useNavigate} from "react-router-dom";
import Stakeholders from "../../components/Stakeholders";

const StakeholdersPage = (props)=>{

    const navigation = useNavigate()

    const addNewStakeholderHandler = ()=>{
        navigation('/stakeholders/add-stakeholder')
    }

    const title = (
        <div className={'title-section'}>
            <img src={stakeholder} alt={'ذینفعان'}/>
            <div>ذینفعان</div>
        </div>
    )

    return (
        <Layout content={true} title={title} buttonTitle={'افزودن ذینفع جدید'} onClickButton={addNewStakeholderHandler}>
            <Stakeholders />
        </Layout>
    )
}

export default StakeholdersPage