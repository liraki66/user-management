import Layout from "../../components/Layout";
import branch from '../../assets/images/branch.svg'
import AddEditBranch from "../../components/Branches/AddEditBranch";
import {useLocation} from "react-router-dom";


const AddEditBranchPage = (props)=>{

    const location = useLocation()

    const title = (
        <div className={'title-section'}>
            <img src={branch} alt={'شعب'}/>
            <div>{location.pathname.includes('edit')? 'ویرایش شعبه':'ثبت شعبه جدید'}</div>
        </div>
    )

    return (
        <Layout content={true} title={title} >
            <AddEditBranch />
        </Layout>
    )
}

export default AddEditBranchPage