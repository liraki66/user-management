import ReportItem from "../ReportItem";
import SamatInquiry from '../../../assets/images/samat-inquiry.svg'
import YaghootInquiry from '../../../assets/images/yaghoot-inquiry.svg'
import {Row} from 'antd'

const reportsItem = [
    {id: 1, name: 'استعلام های ذینفع', src: SamatInquiry, href: '/reports/inquiry/samat-inquiry'},
    {id: 2, name: 'استعلام های یاقوت', src: YaghootInquiry, href: '/reports/inquiry/yaghoot-inquiry'},
]

const ReportsInquiry = (props) => {
    return (
        <>
            <Row justify={'start'} gutter={[{xl:24},1]} className={'report-items-container'}>
                {
                    reportsItem.map(item => {
                        return (
                            <ReportItem name={item.name} logoSrc={item.src} href={item.href} key={item.id}/>
                        )
                    })
                }
            </Row>
        </>
    )
}

export default ReportsInquiry