import {Col, Row} from "antd";
import './index.scss'
import {Link} from "react-router-dom";


const ReportItem = ({logoSrc, name,href}) => {

    return (
        <Col lg={6} xl={6} xxl={4}>
            <Link to={href} >
            <div className={'report-cart-item-container'}>
                <div className={'report-cart-item-body'}>
                    <img src={logoSrc} alt={'لوگو'}/>
                    <div className={'report-card-text'}>{name}</div>
                </div>
            </div>
            </Link>
        </Col>
    )

}

export default ReportItem