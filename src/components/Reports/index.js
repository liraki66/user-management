import ReportItem from "./ReportItem";
import TasvieActive from '../../assets/images/tasvie_active.svg'
import TasvieDasti from '../../assets/images/tasvie_dasti.svg'
import BardashtSarfasl from '../../assets/images/bardasht-az-sarfasl.svg'
import BedehiHa from '../../assets/images/bedehiha.svg'
import FaaliatKarbaran from '../../assets/images/faaliat-karbaran.svg'
import Payamak from '../../assets/images/sent-messages.svg'
import SystemErrors from '../../assets/images/system-error.svg'
import EstelamActive from '../../assets/images/estelam_active.svg'
import DailySettlement from '../../assets/images/daily-settlement.svg'
import Samat from '../../assets/images/samat-settlement.svg'
import {Row} from 'antd'

const reportsItem = [
    {id: 1, name: 'تسویه های روزانه بدهی شرکت کارگزاری', src: DailySettlement, href: '/reports/daily-settlement'},
    // {id: 1, name: 'تسویه های اتوماتیک', src: TasvieActive, href: '/reports/settlement/auto-settlement'},
    {id: 2, name: 'تسویه های دستی', src: TasvieDasti, href: '/reports/settlement/manual-settlement'},
    {id: 3, name: 'برداشت های انجام شده از سرفصل بدهکاران', src: BardashtSarfasl, href: '/reports/debtors-withdraw'},
    {id: 4, name: 'بدهی های شرکت های کارگزاری به بانک', src: BedehiHa, href: '/reports/broker-debt'},
    {id: 5, name: 'فعالیت کاربران', src: FaaliatKarbaran, href: '/reports/users-activity'},
    {id: 6, name: 'پیامک های ارسال شده', src: Payamak, href: '/reports/sent-messages'},
    {id: 7, name: 'خطاهای سیستمی', src: SystemErrors, href: '/reports/system-errors'},
    {id: 8, name: 'استعلام ها', src: EstelamActive, href: '/reports/inquiry'},
    {id: 9, name: 'تسویه بدهی با ذینفعان', src: Samat, href: '/reports/settlement/stakeholders-settlement'},
]

const Reports = (props) => {
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

export default Reports