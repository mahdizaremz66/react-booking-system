import * as walletService from "../services/walletService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

// Wallet
export const wltCreate = async (req, res) => {
  try {
    const wallet = await walletService.createWallet(req.body);
    ResponseHandler.recordCreated(res, wallet);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const wltGetAll = async (req, res) => {
  try {
    const wallets = await walletService.getAllWallets();
    ResponseHandler.success(res, 'WALLET_LIST', wallets);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const wltGetById = async (req, res) => {
  try {
    const wallet = await walletService.getWalletById(req.params.wltPerCode);
    if (!wallet) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'WALLET_DETAIL', wallet);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const wltUpdate = async (req, res) => {
  try {
    const wallet = await walletService.updateWallet(req.params.wltPerCode, req.body);
    ResponseHandler.recordUpdated(res, wallet);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const wltDelete = async (req, res) => {
  try {
    await walletService.deleteWallet(req.params.wltPerCode);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

// WalletTransaction
export const wtxCreate = async (req, res) => {
  try {
    const txn = await walletService.createWalletTransaction(req.body);
    ResponseHandler.recordCreated(res, txn);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const wtxGetAll = async (req, res) => {
  try {
    const transactions = await walletService.getAllWalletTransactions();
    ResponseHandler.success(res, 'WALLET_TRANSACTION_LIST', transactions);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const wtxGetById = async (req, res) => {
  try {
    const transaction = await walletService.getWalletTransactionById(req.params.wtxId);
    if (!transaction) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'WALLET_TRANSACTION_DETAIL', transaction);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const wtxUpdate = async (req, res) => {
  try {
    const transaction = await walletService.updateWalletTransaction(req.params.wtxId, req.body);
    ResponseHandler.recordUpdated(res, transaction);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const wtxDelete = async (req, res) => {
  try {
    await walletService.deleteWalletTransaction(req.params.wtxId);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
}; 