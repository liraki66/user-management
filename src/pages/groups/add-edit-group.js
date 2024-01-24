import Layout from "../../components/Layout";
import user from '../../assets/images/user.svg'
import {useLocation} from "react-router-dom";
import AddEditGroup from "../../components/Groups/AddEditGroups";



const AddEditGroupPage = (props)=>{

    const location = useLocation()

    const title = (
        <div className={'title-section'}>
            <img src={user} alt={'گروه'}/>
            <div>{location.pathname.includes('edit')? 'ویرایش گروه':'ثبت گروه جدید'}</div>
        </div>
    )

    return (
        <Layout content={true} title={title} >
            <AddEditGroup />
        </Layout>
    )
}

export default AddEditGroupPage