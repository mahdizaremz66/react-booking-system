import { ERROR_CODES, SUCCESS_CODES, INFO_CODES, OPERATION_CODES } from './errorCodes.js';

export class ResponseHandler {
  // پاسخ موفقیت
  static success(res, code, data = null, message = null) {
    return res.status(200).json({
      success: true,
      code: code,
      message: message,
      data: data
    });
  }

  // پاسخ خطا
  static error(res, statusCode, code, message = null, details = null) {
    return res.status(statusCode).json({
      success: false,
      code: code,
      message: message,
      details: details
    });
  }

  // پاسخ‌های آماده برای خطاهای رایج
  static invalidCredentials(res) {
    return this.error(res, 401, ERROR_CODES.INVALID_CREDENTIALS);
  }

  static tokenMissing(res) {
    return this.error(res, 401, ERROR_CODES.TOKEN_MISSING);
  }

  static tokenInvalid(res) {
    return this.error(res, 401, ERROR_CODES.TOKEN_INVALID);
  }

  static unauthorized(res) {
    return this.error(res, 403, ERROR_CODES.UNAUTHORIZED_ACCESS);
  }

  static usernameExists(res) {
    return this.error(res, 400, ERROR_CODES.USERNAME_EXISTS);
  }

  static userNotFound(res) {
    return this.error(res, 404, ERROR_CODES.USER_NOT_FOUND);
  }

  static validationError(res, details = null) {
    return this.error(res, 400, ERROR_CODES.VALIDATION_ERROR, null, details);
  }

  static internalError(res) {
    return this.error(res, 500, ERROR_CODES.INTERNAL_ERROR);
  }

  static recordNotFound(res) {
    return this.error(res, 404, ERROR_CODES.RECORD_NOT_FOUND);
  }

  static duplicateRecord(res) {
    return this.error(res, 409, ERROR_CODES.DUPLICATE_RECORD);
  }

  // Account-specific error responses
  static accountCodeExists(res) {
    return this.error(res, 409, ERROR_CODES.ACCOUNT_CODE_ALREADY_EXISTS);
  }

  static accountNotFound(res) {
    return this.error(res, 404, ERROR_CODES.ACCOUNT_NOT_FOUND);
  }

  static parentAccountNotFound(res) {
    return this.error(res, 400, ERROR_CODES.PARENT_ACCOUNT_NOT_FOUND);
  }

  static circularReference(res) {
    return this.error(res, 400, ERROR_CODES.CIRCULAR_REFERENCE_NOT_ALLOWED);
  }

  static cannotDeleteAccountWithChildren(res) {
    return this.error(res, 400, ERROR_CODES.CANNOT_DELETE_ACCOUNT_WITH_CHILDREN);
  }

  static cannotDeleteAccountWithTransactions(res) {
    return this.error(res, 400, ERROR_CODES.CANNOT_DELETE_ACCOUNT_WITH_TRANSACTIONS);
  }

  static missingRequiredFields(res) {
    return this.error(res, 400, ERROR_CODES.MISSING_REQUIRED_FIELDS);
  }

  static bankInfoNotFound(res) {
    return this.error(res, 404, ERROR_CODES.BANK_INFO_NOT_FOUND);
  }

  static accountIsNotBankAccount(res) {
    return this.error(res, 400, ERROR_CODES.ACCOUNT_IS_NOT_BANK_ACCOUNT);
  }

  // پاسخ‌های آماده برای موفقیت‌های رایج
  static loginSuccess(res, data) {
    return this.success(res, SUCCESS_CODES.LOGIN_SUCCESS, data);
  }

  static registerSuccess(res, data) {
    return this.success(res, SUCCESS_CODES.REGISTER_SUCCESS, data);
  }

  static recordCreated(res, data) {
    return this.success(res, SUCCESS_CODES.RECORD_CREATED, data);
  }

  static recordUpdated(res, data) {
    return this.success(res, SUCCESS_CODES.RECORD_UPDATED, data);
  }

  static recordDeleted(res) {
    return this.success(res, SUCCESS_CODES.RECORD_DELETED);
  }

  // Account-specific success responses
  static accountCreated(res, data) {
    return this.success(res, SUCCESS_CODES.ACCOUNT_CREATED, data);
  }

  static accountUpdated(res, data) {
    return this.success(res, SUCCESS_CODES.ACCOUNT_UPDATED, data);
  }

  static accountDeleted(res) {
    return this.success(res, SUCCESS_CODES.ACCOUNT_DELETED);
  }

  static bankInfoUpdated(res, data) {
    return this.success(res, SUCCESS_CODES.BANK_INFO_UPDATED, data);
  }

  // پاسخ‌های آماده برای عملیات خاص
  static personList(res, data) {
    return this.success(res, OPERATION_CODES.PERSON_LIST, data);
  }

  static personDetail(res, data) {
    return this.success(res, OPERATION_CODES.PERSON_DETAIL, data);
  }

  static projectList(res, data) {
    return this.success(res, OPERATION_CODES.PROJECT_LIST, data);
  }

  static projectDetail(res, data) {
    return this.success(res, OPERATION_CODES.PROJECT_DETAIL, data);
  }

  static unitList(res, data) {
    return this.success(res, OPERATION_CODES.UNIT_LIST, data);
  }

  static unitDetail(res, data) {
    return this.success(res, OPERATION_CODES.UNIT_DETAIL, data);
  }

  static reservationList(res, data) {
    return this.success(res, OPERATION_CODES.RESERVATION_LIST, data);
  }

  static journalList(res, data) {
    return this.success(res, OPERATION_CODES.JOURNAL_LIST, data);
  }

  static journalDetailList(res, data) {
    return this.success(res, OPERATION_CODES.JOURNAL_DETAIL_LIST, data);
  }

  static shareholdingList(res, data) {
    return this.success(res, OPERATION_CODES.SHAREHOLDING_LIST, data);
  }

  static shareTransferList(res, data) {
    return this.success(res, OPERATION_CODES.SHARE_TRANSFER_LIST, data);
  }

  static shareProfitList(res, data) {
    return this.success(res, OPERATION_CODES.SHARE_PROFIT_LIST, data);
  }

  static walletList(res, data) {
    return this.success(res, OPERATION_CODES.WALLET_LIST, data);
  }

  static generalLedger(res, data) {
    return this.success(res, OPERATION_CODES.GENERAL_LEDGER, data);
  }
}

export default ResponseHandler; 