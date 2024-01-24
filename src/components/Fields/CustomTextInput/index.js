import {Input} from 'antd';
import './index.scss'


const CustomTextInput = ({type='text',label,value,onChange,disabled=false,suffix=null,name,readOnly=false,className , ...other}) => {

    let MyInput

    if (type === 'textarea') {
        MyInput = <Input.TextArea value={value} onChange={onChange} disabled={disabled} name={name} {...other}/>
    } else if (type === 'search') {
        MyInput = <Input.Search value={value} onChange={onChange} disabled={disabled} name={name} {...other}/>
    } else if (type === 'password') {
        MyInput = <Input.Password value={value} onChange={onChange} disabled={disabled} name={name} {...other} autoComplete={'new-password'}/>
    } else {
        MyInput = <Input value={value} className={className} onChange={onChange} disabled={disabled} type={type} suffix={suffix} name={name} readOnly={readOnly} {...other}/>
    }


    return (
        <div className={'custom-text-input-wrapper'}>
            <div className={'custom-text-input-label'}>{label}</div>
            {MyInput}
        </div>
    )
}

export default CustomTextInput;