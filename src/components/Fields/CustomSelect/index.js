import {Select} from "antd";
import List from "../../../assets/images/list.svg";

const CustomSelect = ({name,onChange,children,value,label,className,...other})=>{
    return(
        <>
            <span className={'time-picker-label'}>{label}</span>
            <Select
                {...other}
                className={className}
                value={value}
                showSearch
                placeholder=""
                onChange={(e)=>onChange(e,name)}
                suffixIcon={<img src={List} alt={'لیست'} style={{cursor: 'pointer'}}/>}
            >
                {children}
            </Select>
        </>
    )
}

export default CustomSelect