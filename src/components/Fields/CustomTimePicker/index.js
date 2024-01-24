import {TimePicker} from "antd";
import Time from "../../../assets/images/timing.svg";

const CustomTimePicker =({onSelect,value,renderExtraFooter,onFocus,onBlur,open,name,disabled,inputReadOnly})=>{
    return (
        <TimePicker format={"HH:mm"} placeholder={''} onSelect={(time)=>onSelect(time,name)}
                    value={value} allowClear={false}
                    renderExtraFooter={()=>renderExtraFooter(name)} open={open}
                    onFocus={()=>onFocus(name)}
                    onBlur={()=>onBlur(name)}
                    inputReadOnly={true}
                    suffixIcon={<img src={Time} alt={"time"}/>}
                    name={name}
                    disabled={disabled}
                    inputReadOnly={inputReadOnly}
        />
    )
}

export default CustomTimePicker