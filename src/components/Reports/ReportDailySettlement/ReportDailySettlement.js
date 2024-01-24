import ReportItem from "../ReportItem";
import StakeholderAccount from '../../../assets/images/stakeholder-account.svg'
import BrokerAccount from '../../../assets/images/broker-account.svg'
import {Row} from 'antd'

const reportsItem = [
    {id: 1, name: 'تراکنش های واریز به سپرده ذینفع', src: StakeholderAccount, href: '/reports/daily-settlement/stakeholder-account'},
    {id: 2, name: 'تراکنش های برداشت از سپرده کارگزاری', src: BrokerAccount, href: '/reports/daily-settlement/broker-account'},
]

const ReportDailySettlement = (props) => {
    return (
        <>
            <Row justify={'start'} gutter={24}>
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

export default ReportDailySettlement