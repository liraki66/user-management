// import {Col, Row} from "antd";
// import './index.scss'
// import KargozarActive from '../../assets/images/kargozar_Active.svg'
// import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//
//
// const CounterItem = ({logo, name, footerText, footerNumber, manual, auto, settlement,image}) => {
//
//
//     return (
//         <Col md={8} lg={6} xl={6} xxl={4}>
//             <div className={'cart-item-container'}>
//                 <div className={'cart-item-body'}>
//                     <img src={logo} alt={'کارگزار'}/>
//                     <h3>{name}</h3>
//                 </div>
//                     <div className={'cart-item-footer'}>
//                         <img src={image} alt={'icon'} />
//                         <div className={'cart-item-footer-text'}>{footerText}</div>
//                     </div>
//             </div>
//         </Col>
//     )
//
// }
//
// export default CounterItem

import {Col, Row} from "antd";
import './index.scss'
import KargozarActive from '../../assets/images/kargozar_Active.svg'
import VerticalProgress from "./VerticalProgress";


const CounterItem = ({logoSrc, name, footerText, footerNumber, manual, auto, settlement,progress,number}) => {

    return (
        <Col  md={8} lg={5} xl={8} xxl={5}>
            <div className={'cart-item-container'}>
                <div className={'cart-item-body'}>
                    <VerticalProgress progress={progress} number={number} />
                </div>
                    <div className={'cart-item-footer'}>
                        <img src={logoSrc} />
                        <div className={'cart-item-footer-text'}>{footerText}</div>
                    </div>
            </div>
        </Col>
    )

}

export default CounterItem
