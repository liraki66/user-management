import {Button} from "antd";
import './index.scss'

const CustomButton = ({title,type='primary',disabled,onClick,htmlType='button',style}) => {
    return (
        <Button style={style} htmlType={htmlType} type={type} size={'large'} className={'custom-button'} onClick={onClick} disabled={disabled}>{title}</Button>
    )
}

export default CustomButton