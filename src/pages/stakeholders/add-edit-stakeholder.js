import Layout from "../../components/Layout";
import stakeholder from '../../assets/images/stakeholder.svg'
import AddEditStakeholder from "../../components/Stakeholders/AddEditStakeholder";
import {useLocation} from "react-router-dom";



const AddEditStakeholderPage = (props)=>{

    const location = useLocation()

    const title = (
        <div className={'title-section'}>
            <img src={stakeholder} alt={'ذینفع'}/>
            <div>{location.pathname.includes('edit')? 'ویرایش ذینفع':'ثبت ذینفع جدید'}</div>
        </div>
    )

    return (
        <Layout content={true} title={title} >
            <AddEditStakeholder />
        </Layout>
    )
}

export default AddEditStakeholderPage