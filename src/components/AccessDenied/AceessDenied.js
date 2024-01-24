import { Button, Result } from 'antd';
import {useNavigate} from "react-router-dom";

const AccessDenied = ()=>{

    const navigate = useNavigate()

    const goToHomeHandler = ()=>{
        navigate('/')
    }

    return (
        <>
            <Result
                status="403"
                // title="403"
                subTitle="شما مجوز دسترسی به این صفحه را ندارید"
                extra={<Button type="primary" onClick={goToHomeHandler}>برگشت به صفحه اصلی</Button>}
            />
        </>
    )
}

export default AccessDenied