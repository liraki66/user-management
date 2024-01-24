// import { Spring } from "react-spring";
//
// const VerticalProgress = ({ progress }) => {
//     return (
//         <Spring from={{ percent: 0 }} to={{ percent: progress }}>
//             {({ percent }) => (
//                 <div className="progress vertical">
//                     <div style={{ height: `${percent}%` }} className="progress-bar">
//                     </div>
//                 </div>
//             )}
//         </Spring>
//     );
// };
//
// export default VerticalProgress;

import {useSpring, animated} from 'react-spring'
import {Tooltip} from "antd";

const VerticalProgress = ({progress,number}) => {
    const props = useSpring({value: progress, from: {value: 0}});

    return (
        <Tooltip overlayStyle={{minWidth:'40px'}} overlayInnerStyle={{textAlign:'center'}} placement={'bottomRight'} title={number}><animated.progress style={{width: "150px",height:'40px',transform:'rotate(90deg)'}} id="file" value={props.value} max="100"/></Tooltip>
    )
}

export default VerticalProgress
