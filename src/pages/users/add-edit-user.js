import Layout from "../../components/Layout";
import user from '../../assets/images/user.svg'
import AddEditUser from "../../components/Users/AddEditUser";
import {useLocation} from "react-router-dom";



const AddEditUserPage = (props)=>{

    const location = useLocation()

    const title = (
        <div className={'title-section'}>
            <img src={user} alt={'کاربران'}/>
            <div>{location.pathname.includes('edit')? 'ویرایش کاربر':'ثبت کاربر جدید'}</div>
        </div>
    )

    return (
        <Layout content={true} title={title} >
            <AddEditUser />
        </Layout>
    )
}

export default AddEditUserPage