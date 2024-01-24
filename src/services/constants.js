///////////////////// base urls /////////////////////

// export const keycloakBaseUrl = 'keycloakbaseurl'
// export const BrokerSettlementBaseUrl = 'brokerbaseapiurl'

// export const keycloakBaseUrl = 'http://banking.keycloak.com'
export const keycloakBaseUrl = 'http://keycloak.citydi.biz'
export const BrokerSettlementBaseUrl = 'http://bss.citydi.biz'
// export const BrokerSettlementBaseUrl = 'http://banking.brokersettlement-development.com'

// base url is http://banking.brokersettlement.com
// keycloak is http://banking.keycloak.com


/////////////////////// login api /////////////////////////

export const keycloakLoginUrl = '/auth/realms/broker-settlement/protocol/openid-connect/token'
export const GetToken = '/api/GetToken'
export const getCurrentUserUrl = '/auth/admin/realms/broker-settlement/users/'

///////////////////// settlement api //////////////////////

export const GetBrokersDebitFromStakeHolderByMarket = '/api/GetBrokersDebitFromStakeHolderByMarket'
export const GetBrokerSettlementInfoWithStakeHolder = '/api/GetBrokerSettlementInfoWithStakeHolder'
export const DoBrokerSettlementWithSamat = '/api/DoBrokerSettlementWithSamat'
export const DoBrokerSettlementWithStakeHolder = '/api/DoBrokerSettlementWithStakeHolder'
export const GiveLoanToBroker = '/api/GiveLoanToBroker'
export const GetBrokerLoanInfo = '/api/GetBrokerLoanInfo'
export const BrokerLoanRegistration = '/api/BrokerLoanRegistration'
export const GetBrokerSettlementInfoWithBank = '/api/GetBrokerSettlementInfoWithBank'
export const GetBrokerSettlementRecordInfoWithBank = '/api/GetBrokerSettlementRecordInfoWithBank'
export const DoBrokerSettlementWithBank = '/api/DoBrokerSettlementWithBank'
export const unblockBrokerAccount = '/api/UnBlockBrokerAccount'
export const DoBrokerSettlementWithBankDebtors = '/api/DoBrokerSettlementWithBankDebtors'
export const GetBrokerSettlementInfoWithBankDebtors = '/api/GetBrokerSettlementInfoWithBankDebtors'
export const CancelBrokerContract = '/api/CancelBrokerContract'
export const GetBrokerAccountBalance = '/api/GetBrokerAccountBalance'
export const GetMarketList = '/api/GetMarketList'
export const BlockBrokerAccount = '/api/BlockBrokerAccount'
export const WithdrawFromBankDebtorsAccount = '/api/WithdrawFromBankDebtorsAccount'
export const GetBrokerSettlementStatistics = '/api/GetBrokerSettlementStatistics'


////////////////////////// calendar api ///////////////////////////
export const GetWeekDayNames = '/api/Calendar/GetWeekDayNames'
export const GetCalendarData = '/api/Calendar/GetCalendarData'
export const SetWorkingDays = '/api/Calendar/SetWorkingDays'
export const SetHolidays = '/api/Calendar/SetHolidays'

////////////////////////// broker api ///////////////////////////////

export const GetBrokerList = '/api/GetBrokerList'
export const GetBrokerListWithPagination = '/api/GetBrokerListWithPagination'
export const GetBrokerById = '/api/GetBrokerById'
export const CreateBroker = '/api/CreateBroker'
export const DeleteBroker = '/api/DeleteBroker'
export const EditBroker = '/api/EditBroker'


////////////////////////// contract api ///////////////////////

export const GetContractList = '/api/GetContractList'
export const GetContractListWithPagination = '/api/GetContractListWithPagination'
export const GetContractById = '/api/GetContractById'
export const CreateContract = '/api/CreateContract'
export const EditContract = '/api/EditContract'
export const DeleteContract = '/api/DeleteContract'
export const RegisterContractTermination = '/api/RegisterContractTermination'
export const TerminateContract = '/api/TerminateContract'
export const CancelContractTermination = '/api/CancelContractTermination'
export const GetContractStatus = '/api/GetContractStatus'

////////////////////////// stakeholder api ///////////////////////

export const GetStakeHolderList = '/api/GetStakeHolderList'
export const GetStakeHolderListWithPagination = '/api/GetStakeHolderListWithPagination'
export const GetStakeHolderById = '/api/GetStakeHolderById'
export const CreateStakeHolder = '/api/CreateStakeHolder'
export const EditStakeHolder = '/api/EditStakeHolder'
export const DeleteStakeHolder = '/api/DeleteStakeHolder'

////////////////////////// branch api ///////////////////////

export const GetBranchList = '/api/GetBranchList'
export const GetBranchListWithPagination = '/api/GetBranchListWithPagination'
export const GetBranchById = '/api/GetBranchById'
export const CreateBranch = '/api/CreateBranch'
export const EditBranch = '/api/EditBranch'
export const DeleteBranch = '/api/DeleteBranch'

////////////////////////// user api ///////////////////////

export const GetUserList = '/api/GetUserList'
export const GetUserListWithPagination = '/api/GetUserListWithPagination'
export const GetUserById = '/api/GetUserById'
export const CreateUser = '/api/CreateUser'
export const EditUser = '/api/EditUser'
export const DeleteUser = '/api/DeleteUser'

////////////////////////// group api ///////////////////////

export const GetGroupsAsyncWithPagination = '/api/GetGroupsAsyncWithPagination'
export const GetGroupsAsync = '/api/GetGroupsAsync'
export const GetGroupByIdAsync = '/api/GetGroupByIdAsync'
export const CreateGroupAsync = '/api/CreateGroupAsync'
export const EditGroupAsync = '/api/EditGroupAsync'
export const DeleteGroupAsync = '/api/DeleteGroupAsync'
export const GetAllPermissionsAsync = '/api/GetAllPermissionsAsync'

//////////////////////////// Reports api ////////////////////////////

export const GetSamatInquiries = '/api/GetSamatInquiries'
export const GetSamatInquiriesDocument = '/api/GetSamatInquiriesDocument'
export const GetYaghoutInquiries = '/api/GetYaghoutInquiries'
export const GetYaghoutInquiriesDocument = '/api/GetYaghoutInquiriesDocument'
export const GetTransferBrokerToSamat = '/api/GetTransferBrokerToSamat'
export const GetTransferBrokerToSamatDocument = '/api/GetTransferBrokerToSamatDocument'
export const GetTransferBrokerToBankAccount = '/api/GetTransferBrokerToBankAccount'
export const GetTransferBrokerToBankAccountDocument = '/api/GetTransferBrokerToBankAccountDocument'
export const GetSamatWithdrawalsFromBankDebtors = '/api/GetSamatWithdrawalsFromBankDebtors'
export const GetSamatWithdrawalsFromBankDebtorsDocument = '/api/GetSamatWithdrawalsFromBankDebtorsDocument'
export const GetDailyBrokerSettlementReport = '/api/GetDailyBrokerSettlementReport'
export const GetDailyBrokerSettlementDocument = '/api/GetDailyBrokerSettlementDocument'
export const GetManualSettlementWithBankDebtorsReport = '/api/GetManualSettlementWithBankDebtorsReport'
export const GetManualSettlementWithBankDebtorsDocument = '/api/GetManualSettlementWithBankDebtorsDocument'
export const GetUserActivityReport = '/api/GetUserActivityReport'
export const GetExternalApiErrorReport = '/api/GetExternalApiErrorReport'
export const GetUserActivityReportDocument = '/api/GetUserActivityReportDocument'
export const GetNotificationReport = '/api/GetNotificationReport'
export const GetNotificationReportDocument = '/api/GetNotificationReportDocument'
export const GetReleaseNote = '/api/GetReleaseNote'



export const ResetData = '/api/test/ResetData'