import * as shareService from "../services/shareService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

// Shareholding
export const shrCreate = async (req, res) => {
  try {
    const share = await shareService.createShareholding(req.body);
    ResponseHandler.recordCreated(res, share);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const shrGetAll = async (req, res) => {
  try {
    const shares = await shareService.getAllShareholdings();
    ResponseHandler.success(res, 'SHAREHOLDING_LIST', shares);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const shrGetById = async (req, res) => {
  try {
    const share = await shareService.getShareholdingById(req.params.shrId);
    if (!share) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'SHAREHOLDING_DETAIL', share);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const shrUpdate = async (req, res) => {
  try {
    const share = await shareService.updateShareholding(req.params.shrId, req.body);
    ResponseHandler.recordUpdated(res, share);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const shrDelete = async (req, res) => {
  try {
    await shareService.deleteShareholding(req.params.shrId);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

// ShareTransfer
export const stfCreate = async (req, res) => {
  try {
    const transfer = await shareService.createShareTransfer(req.body);
    ResponseHandler.recordCreated(res, transfer);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const stfGetAll = async (req, res) => {
  try {
    const transfers = await shareService.getAllShareTransfers();
    ResponseHandler.success(res, 'SHARE_TRANSFER_LIST', transfers);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const stfGetById = async (req, res) => {
  try {
    const transfer = await shareService.getShareTransferById(req.params.stfId);
    if (!transfer) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'SHARE_TRANSFER_DETAIL', transfer);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const stfUpdate = async (req, res) => {
  try {
    const transfer = await shareService.updateShareTransfer(req.params.stfId, req.body);
    ResponseHandler.recordUpdated(res, transfer);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const stfDelete = async (req, res) => {
  try {
    await shareService.deleteShareTransfer(req.params.stfId);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

// ShareProfit
export const sptCreate = async (req, res) => {
  try {
    const profit = await shareService.createShareProfit(req.body);
    ResponseHandler.recordCreated(res, profit);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const sptGetAll = async (req, res) => {
  try {
    const profits = await shareService.getAllShareProfits();
    ResponseHandler.success(res, 'SHARE_PROFIT_LIST', profits);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const sptGetById = async (req, res) => {
  try {
    const profit = await shareService.getShareProfitById(req.params.sptId);
    if (!profit) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'SHARE_PROFIT_DETAIL', profit);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const sptUpdate = async (req, res) => {
  try {
    const profit = await shareService.updateShareProfit(req.params.sptId, req.body);
    ResponseHandler.recordUpdated(res, profit);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const sptDelete = async (req, res) => {
  try {
    await shareService.deleteShareProfit(req.params.sptId);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
}; 