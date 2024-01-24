import {BrowserRouter, Routes, Route, Navigate, useLocation} from "react-router-dom";
import useAuth, {AuthProvider} from "./services/auth";
import Login from './pages/login'
import Inquiry from "./pages/Inquiry";
import Counter from "./pages/counter";
import Brokers from "./pages/brokers";
import Branches from "./pages/branches";
import SamatSettlement from './pages/samat-settlement'
import StakeholderSettlement from "./pages/stakeholder-settlement";
import BankDebtorsSettlement from "./pages/bank-debtors-settlement";
import BankSettlement from "./pages/bank-settlement";
import Contracts from "./pages/contracts";
import Reports from "./pages/reports";
import jwt_decode from "jwt-decode";
import ReportsInquiry from "./pages/reports/inquiry";
import ReportsSamatInquiry from "./pages/reports/inquiry/samat-inquiry";
import ReportsYaghootInquiry from "./pages/reports/inquiry/yaghoot-inquiry";
import ReportsSamatSettlement from "./pages/reports/settlement/samat-settlement";
import ReportsDebtorsWithdraw from "./pages/reports/debtors-withdraw";
import ReportsBrokerDebt from "./pages/reports/broker-debt";
import AddEditBroker from "./pages/brokers/add-edit-broker";
import AddEditContract from "./pages/contracts/add-edit-contract";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useMemo, useState} from "react";
import {setDecodedUserInfo} from "./redux/slices/auth";
import {CustomRouter} from "./services/CustomRouter";
import history from "./services/CustomRouter";
import GiveLoan from "./pages/give-loan";
import AddEditBranch from "./pages/branches/add-edit-branch";
import UserPage from "./pages/users";
import AddEditUser from "./pages/users/add-edit-user";
import {message} from "antd";
import Stakeholders from "./pages/stakeholders";
import AddEditStakeholder from "./pages/stakeholders/add-edit-stakeholder";
import ReportsDailySettlement from "./pages/reports/settlement/daily-settlement";
import ReportsUsersActivity from "./pages/reports/users-activity";
import ReportsDailySettlementStakeholder from "./pages/reports/settlement/daily-settlement-stakeholder";
import ReportsDailySettlementBroker from "./pages/reports/settlement/daily-settlement-broker";
import ReportsManualSettlement from "./pages/reports/settlement/manual-settlement";
import {ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoanSettlement from "./pages/loan-settlement";
import ReportSystemErrors from "./pages/reports/system-errors";
import Calendar from "./pages/calendar";
import ReportSentMessages from "./pages/reports/sent-messages";
import GroupPage from "./pages/groups";
import AddEditGroup from "./pages/groups/add-edit-group";
import AccessDenied from "./components/AccessDenied/AceessDenied";


function App() {

    // const auth = useSelector(state => state.auth.userInfo)

    const dispatch = useDispatch()


    function AuthenticatedRoute({children, access}) {


        let location = useLocation()

        let accessToken = localStorage.getItem('access_token')

        const memoizedInfo = useMemo(() => {
            return accessToken ? jwt_decode(accessToken) : null
        }, [accessToken])


        useEffect(() => {
            let accessToken = localStorage.getItem('access_token')
            if (accessToken) {
                let decodedAccessToken = jwt_decode(accessToken)
                dispatch(setDecodedUserInfo(decodedAccessToken))
            }
        }, [accessToken])


        // let user
        // if (accessToken!=='removed') {
        //     user = jwt_decode(accessToken)
        // }
        // let location = useLocation();
        //
        // if (accessToken && accessToken==='removed') {
        //     message.error({
        //         content: 'زمان نشست شما به پایان رسید. لطفا مجددا وارد سامانه شوید',
        //         className: 'custom-message-error',
        //         style: {
        //             marginTop: '2%',
        //         },
        //         duration: 3
        //     })
        //     return <Navigate to="/login" state={{from: location}} replace/>;
        // }

        if (!accessToken) {
            return <Navigate to="/login" state={{from: location}} replace/>
        }

        if (accessToken && memoizedInfo?.[access] === 'yes' || access === 'yes') {
            return children;
        }

        return <AccessDenied/>
    }


    return (
        <CustomRouter history={history}>
            <ToastContainer style={{fontFamily: 'IRANSans'}}
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={true}
                            newestOnTop={false}
                            closeOnClick={false}
                            rtl
                            pauseOnFocusLoss={false}
                            draggable={false}
                            pauseOnHover={true}
                            theme="colored"/>
            {/*<AuthProvider>*/}
            <Routes>
                <Route path={'/'} element={<AuthenticatedRoute access={'yes'}><Counter/></AuthenticatedRoute>}/>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/inquiry'} element={<AuthenticatedRoute access={'GetBrokersDebitFromStakeHolderByMarket'}><Inquiry/></AuthenticatedRoute>}/>
                {/*<Route path={'/inquiry/:id'} element={<AuthenticatedRoute><Inquiry/></AuthenticatedRoute>}/>*/}
                <Route path={'/counter'} element={<AuthenticatedRoute access={'yes'}><Counter/></AuthenticatedRoute>}/>
                <Route path={'/brokers'} element={<AuthenticatedRoute access={'yes'}><Brokers/></AuthenticatedRoute>}/>
                <Route path={'/brokers/add-broker'}
                       element={<AuthenticatedRoute access={'CreateBroker'}><AddEditBroker/></AuthenticatedRoute>}/>
                <Route path={'/brokers/edit-broker/:id'}
                       element={<AuthenticatedRoute access={'EditBroker'}><AddEditBroker/></AuthenticatedRoute>}/>
                <Route path={'/contracts'}
                       element={<AuthenticatedRoute access={'yes'}><Contracts/></AuthenticatedRoute>}/>
                <Route path={'/contracts/add-contract'}
                       element={<AuthenticatedRoute access={'CreateContract'}><AddEditContract/></AuthenticatedRoute>}/>
                <Route path={'/contracts/edit-contract/:id'}
                       element={<AuthenticatedRoute access={'EditContract'}><AddEditContract/></AuthenticatedRoute>}/>
                <Route path={'/contracts/edit-contract/terminate/:id/:loanId'}
                       element={<AuthenticatedRoute
                           access={'TerminateContract'}><AddEditContract/></AuthenticatedRoute>}/>
                {/*<Route path={'/contracts/detail/:id'}*/}
                {/*       element={<AuthenticatedRoute><AddEditBranch/></AuthenticatedRoute>}/>*/}
                <Route path={'/branches'}
                       element={<AuthenticatedRoute access={'yes'}><Branches/></AuthenticatedRoute>}/>
                {/*<Route path={'/branches/detail/:id'}*/}
                {/*       element={<AuthenticatedRoute><AddEditBranch/></AuthenticatedRoute>}/>*/}
                <Route path={'/branches/add-branch'}
                       element={<AuthenticatedRoute access={'CreateBranch'}><AddEditBranch/></AuthenticatedRoute>}/>
                <Route path={'/branches/edit-branch/:id'}
                       element={<AuthenticatedRoute access={'EditBranch'}><AddEditBranch/></AuthenticatedRoute>}/>
                <Route path={'/users'} element={<AuthenticatedRoute access={'yes'}><UserPage/></AuthenticatedRoute>}/>
                {/*<Route path={'/users/detail/:id'}*/}
                {/*       element={<AuthenticatedRoute><AddEditUser/></AuthenticatedRoute>}/>*/}
                <Route path={'/users/add-user'}
                       element={<AuthenticatedRoute access={'CreateUser'}><AddEditUser/></AuthenticatedRoute>}/>
                <Route path={'/users/edit-user/:id'}
                       element={<AuthenticatedRoute access={'EditUser'}><AddEditUser/></AuthenticatedRoute>}/>
                <Route path={'/groups'} element={<AuthenticatedRoute access={'yes'}><GroupPage/></AuthenticatedRoute>}/>
                <Route path={'/groups/add-group'}
                       element={<AuthenticatedRoute access={'CreateGroup'}><AddEditGroup/></AuthenticatedRoute>}/>
                <Route path={'/groups/edit-group/:id'}
                       element={<AuthenticatedRoute access={'EditGroup'}><AddEditGroup/></AuthenticatedRoute>}/>
                <Route path={'/stakeholders'}
                       element={<AuthenticatedRoute access={'yes'}><Stakeholders/></AuthenticatedRoute>}/>
                {/*<Route path={'/stakeholders/detail/:id'}*/}
                {/*       element={<AuthenticatedRoute><AddEditStakeholder/></AuthenticatedRoute>}/>*/}
                <Route path={'/stakeholders/add-stakeholder'}
                       element={<AuthenticatedRoute
                           access={'CreateStakeholder'}><AddEditStakeholder/></AuthenticatedRoute>}/>
                <Route path={'/stakeholders/edit-stakeholder/:id'}
                       element={<AuthenticatedRoute
                           access={'EditStakeholder'}><AddEditStakeholder/></AuthenticatedRoute>}/>
                <Route path={'/reports'} element={<AuthenticatedRoute access={'yes'}><Reports/></AuthenticatedRoute>}/>
                <Route path={'/reports/inquiry'}
                       element={<AuthenticatedRoute access={'yes'}><ReportsInquiry/></AuthenticatedRoute>}/>
                <Route path={'/reports/inquiry/samat-inquiry'}
                       element={<AuthenticatedRoute
                           access={'GetSamatInquiries'}><ReportsSamatInquiry/></AuthenticatedRoute>}/>
                <Route path={'/reports/inquiry/yaghoot-inquiry'}
                       element={<AuthenticatedRoute
                           access={'GetYaghoutInquiries'}><ReportsYaghootInquiry/></AuthenticatedRoute>}/>
                <Route path={'/reports/settlement/stakeholders-settlement'}
                       element={<AuthenticatedRoute
                           access={'GetTransferBrokerToSamat'}><ReportsSamatSettlement/></AuthenticatedRoute>}/>
                <Route path={'/reports/daily-settlement'}
                       element={<AuthenticatedRoute access={'GetDailyBrokerSettlementReport'}><ReportsDailySettlement/></AuthenticatedRoute>}/>
                {/*<Route path={'/reports/daily-settlement/stakeholder-account'}*/}
                {/*       element={<AuthenticatedRoute access={decodedAccessToken?.CreateBranch}><ReportsDailySettlementStakeholder/></AuthenticatedRoute>}/>*/}
                {/*<Route path={'/reports/daily-settlement/broker-account'}*/}
                {/*       element={<AuthenticatedRoute access={decodedAccessToken?.CreateBranch}><ReportsDailySettlementBroker/></AuthenticatedRoute>}/>*/}
                <Route path={'/reports/settlement/manual-settlement'}
                       element={<AuthenticatedRoute
                           access={'GetManualSettlementWithBankDebtorsReport'}><ReportsManualSettlement/></AuthenticatedRoute>}/>
                <Route path={'/reports/debtors-withdraw'}
                       element={<AuthenticatedRoute
                           access={'GetSamatWithdrawalsFromBankDebtors'}><ReportsDebtorsWithdraw/></AuthenticatedRoute>}/>
                <Route path={'/reports/broker-debt'}
                       element={<AuthenticatedRoute
                           access={'GetTransferBrokerToBankAccount'}><ReportsBrokerDebt/></AuthenticatedRoute>}/>
                <Route path={'/reports/users-activity'}
                       element={<AuthenticatedRoute
                           access={'GetUserActivityReport'}><ReportsUsersActivity/></AuthenticatedRoute>}/>
                <Route path={'/reports/sent-messages'}
                       element={<AuthenticatedRoute
                           access={'GetNotificationReport'}><ReportSentMessages/></AuthenticatedRoute>}/>
                <Route path={'/reports/system-errors'}
                       element={<AuthenticatedRoute
                           access={'GetExternalApiErrorReport'}><ReportSystemErrors/></AuthenticatedRoute>}/>
                <Route path={'/inquiry/settlement/samat-settlement/:brokerId/:marketType'}
                       element={<AuthenticatedRoute access={'CreateBranch'}><SamatSettlement/></AuthenticatedRoute>}/>
                <Route path={'/inquiry/settlement/stakeholder-settlement/:contractId'}
                       element={<AuthenticatedRoute
                           access={'GetBrokerSettlementInfoWithStakeholder'}><StakeholderSettlement/></AuthenticatedRoute>}/>
                <Route path={'/inquiry/settlement/bank-debtors-settlement/:contractId'}
                       element={<AuthenticatedRoute
                           access={'GetBrokerSettlementInfoWithBankDebtors'}><BankDebtorsSettlement/></AuthenticatedRoute>}/>




                {/*<Route path={'/inquiry/settlement/bank-settlement/give-loan/:loanId'}*/}
                {/*       element={<AuthenticatedRoute access={'yes'}><GiveLoan/></AuthenticatedRoute>}/>*/}
                <Route path={'/inquiry/settlement/bank-settlement/loan-settlement/:loanId'}
                       element={<AuthenticatedRoute access={'GetBrokerLoanInfo'}><LoanSettlement/></AuthenticatedRoute>}/>




                <Route path={'/inquiry/settlement/bank-settlement/:contractId'}
                       element={<AuthenticatedRoute
                           access={'GetBrokerSettlementInfoWithBank'}><BankSettlement/></AuthenticatedRoute>}/>
                <Route path={'/calendar'}
                       element={<AuthenticatedRoute
                           access={'SetWorkingDaysAndHolidays'}><Calendar/></AuthenticatedRoute>}/>

            </Routes>
            {/*</AuthProvider>*/}
        </CustomRouter>
    );
}

export default App;
