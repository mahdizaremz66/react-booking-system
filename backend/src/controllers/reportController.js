import * as reportService from "../services/reportService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

export const rptGetGeneralLedger = async (req, res) => {
  try {
    const data = await reportService.getGeneralLedger();
    ResponseHandler.success(res, 'GENERAL_LEDGER', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetPersonLedger = async (req, res) => {
  try {
    const data = await reportService.getPersonLedger();
    ResponseHandler.success(res, 'PERSON_LEDGER', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetTrialBalance = async (req, res) => {
  try {
    const data = await reportService.getTrialBalance();
    ResponseHandler.success(res, 'TRIAL_BALANCE', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetPersonBalance = async (req, res) => {
  try {
    const data = await reportService.getPersonBalance();
    ResponseHandler.success(res, 'PERSON_BALANCE', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetConfigMap = async (req, res) => {
  try {
    const data = await reportService.getConfigMap();
    ResponseHandler.success(res, 'CONFIG_MAP', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetReservationSummary = async (req, res) => {
  try {
    const data = await reportService.getReservationSummary();
    ResponseHandler.success(res, 'RESERVATION_SUMMARY', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetTariffConsumption = async (req, res) => {
  try {
    const data = await reportService.getTariffConsumption();
    ResponseHandler.success(res, 'TARIFF_CONSUMPTION', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetTariffExtraByAge = async (req, res) => {
  try {
    const data = await reportService.getTariffExtraByAge();
    ResponseHandler.success(res, 'TARIFF_EXTRA_BY_AGE', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetWalletBalance = async (req, res) => {
  try {
    const data = await reportService.getWalletBalance();
    ResponseHandler.success(res, 'WALLET_BALANCE', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetWalletTxnHistory = async (req, res) => {
  try {
    const data = await reportService.getWalletTxnHistory();
    ResponseHandler.success(res, 'WALLET_TXN_HISTORY', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetProfitDistribution = async (req, res) => {
  try {
    const data = await reportService.getProfitDistribution();
    ResponseHandler.success(res, 'PROFIT_DISTRIBUTION', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetUserLogAudit = async (req, res) => {
  try {
    const data = await reportService.getUserLogAudit();
    ResponseHandler.success(res, 'USER_LOG_AUDIT', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetProjectPersonRoles = async (req, res) => {
  try {
    const data = await reportService.getProjectPersonRoles();
    ResponseHandler.success(res, 'PROJECT_PERSON_ROLES', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const rptGetReservationReportSummary = async (req, res) => {
  try {
    const data = await reportService.getReservationReportSummary();
    ResponseHandler.success(res, 'RESERVATION_REPORT_SUMMARY', data);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
}; 