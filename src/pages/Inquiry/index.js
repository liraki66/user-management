import Layout from "../../components/Layout";
import Inquiry from "../../components/Inquiry";
import Estelam from '../../assets/images/estelam.svg'
import './index.scss'

const InquiryPage = (props)=>{

    const title = (
        <div className={'title-section'}>
            <img src={Estelam} alt={'استعلام'}/>
            <div>استعلام و تسویه حساب</div>
        </div>
    )

    return (
        <Layout content={true} title={title}>
            <Inquiry />
        </Layout>
    )
}

export default InquiryPage