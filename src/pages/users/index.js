import Layout from "../../components/Layout";
import user from '../../assets/images/user.svg'
import {useNavigate} from "react-router-dom";
import Users from "../../components/Users";

const UserPage = (props)=>{

    const navigation = useNavigate()

    const addNewUserHandler = ()=>{
        navigation('/users/add-user')
    }

    const title = (
        <div className={'title-section'}>
            <img src={user} alt={'کاربران'}/>
            <div>کاربران</div>
        </div>
    )

    return (
        <Layout content={true} title={title} buttonTitle={'افزودن کاربر جدید'} onClickButton={addNewUserHandler}>
            <Users />
        </Layout>
    )
}

export default UserPage