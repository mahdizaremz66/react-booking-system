import { useTranslation } from 'react-i18next';
import { useState } from 'react';

// Mapping of backend response codes to translation keys
export const RESPONSE_CODE_MAP = {
  // Authentication codes
  'AUTH_001': 'auth.invalidCredentials',
  'AUTH_002': 'auth.tokenMissing',
  'AUTH_003': 'auth.tokenInvalid',
  'AUTH_004': 'auth.unauthorizedAccess',
  'AUTH_005': 'auth.usernameExists',
  
  // Success codes
  'SUCCESS_001': 'success.loginSuccess',
  'SUCCESS_002': 'success.registerSuccess',
  'SUCCESS_003': 'success.logoutSuccess',
  'SUCCESS_004': 'success.recordCreated',
  'SUCCESS_005': 'success.recordUpdated',
  'SUCCESS_006': 'success.recordDeleted',
  
  // Account success codes
  'ACC_SUCCESS_001': 'account.success.created',
  'ACC_SUCCESS_002': 'account.success.updated',
  'ACC_SUCCESS_003': 'account.success.deleted',
  'ACC_SUCCESS_004': 'account.success.bankInfoUpdated',
  
  // Error codes
  'VAL_001': 'errors.validationError',
  'VAL_002': 'errors.requiredField',
  'VAL_003': 'errors.invalidFormat',
  'DB_001': 'errors.databaseError',
  'DB_002': 'errors.recordNotFound',
  'DB_003': 'errors.duplicateRecord',
  'SYS_001': 'errors.internalError',
  'SYS_002': 'errors.serviceUnavailable',
  'SYS_003': 'errors.invalidRequest',
  
  // Account error codes
  'ACC_001': 'accounting.accountCodeAlreadyExists',
  'ACC_002': 'accounting.accountNotFound',
  'ACC_003': 'accounting.parentAccountNotFound',
  'ACC_004': 'accounting.circularReferenceNotAllowed',
  'ACC_005': 'accounting.cannotDeleteAccountWithChildren',
  'ACC_006': 'accounting.cannotDeleteAccountWithTransactions',
  'ACC_007': 'accounting.missingRequiredFields',
  'ACC_008': 'accounting.bankInfoNotFound',
  'ACC_009': 'accounting.accountIsNotBankAccount',
  
  // Operation codes - these are used for success messages with data
  'PERSON_LIST': 'person.personList',
  'PERSON_DETAIL': 'person.personDetail',
  'PROJECT_LIST': 'project.projectList',
  'PROJECT_DETAIL': 'project.projectDetail',
  'UNIT_LIST': 'unit.unitList',
  'UNIT_DETAIL': 'unit.unitDetail',
  'RESERVATION_LIST': 'reservation.reservationList',
  'RESERVATION_DETAIL': 'reservation.reservationDetail',
  'JOURNAL_LIST': 'journal.journalList',
  'JOURNAL_DETAIL': 'journal.journalDetail',
  'JOURNAL_DETAIL_LIST': 'journal.journalDetailList',
  'JOURNAL_DETAIL_DETAIL': 'journal.journalDetail',
  'SHAREHOLDING_LIST': 'share.shareholdingList',
  'SHAREHOLDING_DETAIL': 'share.shareholding',
  'SHARE_TRANSFER_LIST': 'share.transferList',
  'SHARE_TRANSFER_DETAIL': 'share.shareTransfer',
  'SHARE_PROFIT_LIST': 'share.profitList',
  'SHARE_PROFIT_DETAIL': 'share.shareProfit',
  'WALLET_LIST': 'wallet.walletList',
  'WALLET_DETAIL': 'wallet.walletDetail',
  'WALLET_TRANSACTION_LIST': 'wallet.transactionList',
  'WALLET_TRANSACTION_DETAIL': 'wallet.transactionDetail',
  'GENERAL_LEDGER': 'report.generalLedger',
  'PERSON_LEDGER': 'report.personLedger',
  'TRIAL_BALANCE': 'report.trialBalance',
  'PERSON_BALANCE': 'report.personBalance',
  'CONFIG_MAP': 'report.configMap',
  'RESERVATION_SUMMARY': 'report.reservationSummary',
  'TARIFF_CONSUMPTION': 'report.tariffConsumption',
  'TARIFF_EXTRA_BY_AGE': 'report.tariffExtraByAge',
  'WALLET_BALANCE': 'report.walletBalance',
  'WALLET_TXN_HISTORY': 'report.walletTxnHistory',
  'PROFIT_DISTRIBUTION': 'report.profitDistribution',
  'USER_LOG_AUDIT': 'report.userLogAudit',
  'PROJECT_PERSON_ROLES': 'report.projectPersonRoles',
  'RESERVATION_REPORT_SUMMARY': 'report.reservationReportSummary',
  
  // Legacy codes for backward compatibility
  'ACCOUNT_CODE_ALREADY_EXISTS': 'accounting.accountCodeAlreadyExists',
  'PARENT_ACCOUNT_NOT_FOUND': 'accounting.parentAccountNotFound',
  'MISSING_REQUIRED_FIELDS': 'accounting.missingRequiredFields',
  'ACCOUNT_NOT_FOUND': 'accounting.accountNotFound',
  'CIRCULAR_REFERENCE_NOT_ALLOWED': 'accounting.circularReferenceNotAllowed',
  'ACCOUNT_CREATED': 'account.success.created',
  'ACCOUNT_UPDATED': 'account.success.updated',
  'ACCOUNT_DELETED': 'account.success.deleted',
};

// Hook to get translated message from backend response
export const useMessageHandler = () => {
  const { t } = useTranslation();
  
  const getMessage = (response) => {
    if (!response) return '';
    
    const { success, code, message } = response;
    
    // If there's a direct message, use it
    if (message) return message;
    
    // If there's a code, translate it
    if (code && RESPONSE_CODE_MAP[code]) {
      return t(RESPONSE_CODE_MAP[code]);
    }
    
    // Default messages based on success status
    if (success) {
      return t('success.operationSuccess');
    } else {
      return t('errors.internalError');
    }
  };
  
  const getErrorMessage = (error) => {
    if (!error) return t('errors.internalError');
    
    // Handle different types of errors
    if (error.response?.data?.code) {
      return getMessage(error.response.data);
    }
    
    if (error.response?.status === 404) {
      return t('errors.recordNotFound');
    }
    
    if (error.response?.status === 401) {
      return t('auth.unauthorizedAccess');
    }
    
    if (error.response?.status === 403) {
      return t('auth.unauthorizedAccess');
    }
    
    if (error.response?.status >= 500) {
      return t('errors.internalError');
    }
    
    if (error.message) {
      return error.message;
    }
    
    return t('errors.networkError');
  };
  
  return { getMessage, getErrorMessage };
};

// Utility function to handle API responses
export const handleApiResponse = (response, t) => {
  if (!response) return { message: t('errors.internalError'), type: 'error' };
  
  const { success, code, message } = response;
  
  if (success) {
    const translatedMessage = code && RESPONSE_CODE_MAP[code] 
      ? t(RESPONSE_CODE_MAP[code]) 
      : (message || t('success.operationSuccess'));
    
    return { message: translatedMessage, type: 'success' };
  } else {
    const translatedMessage = code && RESPONSE_CODE_MAP[code] 
      ? t(RESPONSE_CODE_MAP[code]) 
      : (message || t('errors.internalError'));
    
    return { message: translatedMessage, type: 'error' };
  }
};

// Centralized Snackbar Hook
export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // 'success', 'error', 'warning', 'info'
    autoHideDuration: 3000
  });

  const showMessage = (message, severity = 'success', autoHideDuration = 3000) => {
    setSnackbar({
      open: true,
      message,
      severity,
      autoHideDuration: severity === 'error' ? 5000 : autoHideDuration
    });
  };

  const showSuccess = (message) => showMessage(message, 'success');
  const showError = (message) => showMessage(message, 'error');
  const showWarning = (message) => showMessage(message, 'warning');
  const showInfo = (message) => showMessage(message, 'info');

  const hideMessage = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return {
    snackbar,
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    hideMessage
  };
}; 