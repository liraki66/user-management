import Layout from "../../components/Layout";
import user from '../../assets/images/user.svg'
import {useNavigate} from "react-router-dom";
import Groups from "../../components/Groups";

const GroupPage = (props)=>{

    const navigation = useNavigate()

    const addNewGroupHandler = ()=>{
        navigation('/groups/add-group')
    }

    const title = (
        <div className={'title-section'}>
            <img src={user} alt={'گروه'}/>
            <div>گروه ها</div>
        </div>
    )

    return (
        <Layout content={true} title={title} buttonTitle={'افزودن گروه جدید'} onClickButton={addNewGroupHandler}>
            <Groups />
        </Layout>
    )
}

export default GroupPage