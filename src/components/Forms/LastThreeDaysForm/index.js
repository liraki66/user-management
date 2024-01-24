import {Form, Row, Col} from "antd";
import CustomTextInput from "../../Fields/CustomTextInput";
import Mojoodi from "../../../assets/images/mojoodi.svg";
import CustomButton from "../../Fields/CustomButton";

const LastThreeDaysForm = (props) => {
    return (
        <Form>
            <Row gutter={24} className={'bank-settlement-items-wrapper'}>
                <div className={'bank-settlement-items-title'}>بدهی معوقه در 3 روز گذشته</div>
                <Col lg={2}>
                    <CustomTextInput type={'hidden'} value={''} />
                </Col>
                <Col lg={5}>
                    <CustomTextInput type={'text'} label={'تاریخ'} value={''} name={'date'}/>
                </Col>
                <Col lg={5}>
                    <CustomTextInput type={'text'} label={'میزان بدهی + 34درصد با 3 روز تسهیلات(ریال)'} value={''} name={'BrokerDebt'}/>
                </Col>
                <Col lg={5}>
                    <CustomTextInput type={'text'} label={'موجودی سپرده'} value={''} />
                    <img src={Mojoodi} className={'bank-settlement-items-balance'} />
                </Col>
                <Col lg={3}>
                    <CustomButton type={'primary'} title={'تسویه'} disabled />
                </Col>
                <Col lg={3}>
                    <CustomButton type={'primary'} title={'فسخ قرارداد'}/>
                </Col>
            </Row>
        </Form>
    )
}

export default LastThreeDaysForm