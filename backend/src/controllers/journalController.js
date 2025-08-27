import * as journalService from "../services/journalService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

// Journal
export const jrnSave = async (req, res) => {
  try {
    const journal = await journalService.saveJournal(req.body);
    ResponseHandler.recordCreated(res, journal);
  } catch (err) {
    console.error(err);
    ResponseHandler.validationError(res, err.message);
  }
};

export const jrnGetAll = async (req, res) => {
  try {
    const journals = await journalService.getAllJournals();
    ResponseHandler.success(res, 'JOURNAL_LIST', journals);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const jrnGetById = async (req, res) => {
  try {
    const journal = await journalService.getJournalById(req.params.jrnCode);
    if (!journal) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'JOURNAL_DETAIL', journal);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const jrnDelete = async (req, res) => {
  try {
    await journalService.deleteJournal(req.params.jrnCode);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

// JournalDetail
export const jrdCreate = async (req, res) => {
  try {
    const detail = await journalService.createJournalDetail(req.body);
    ResponseHandler.recordCreated(res, detail);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const jrdGetAll = async (req, res) => {
  try {
    const details = await journalService.getAllJournalDetails();
    ResponseHandler.success(res, 'JOURNAL_DETAIL_LIST', details);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const jrdGetById = async (req, res) => {
  try {
    const detail = await journalService.getJournalDetailById(req.params.jrdJrnCode, req.params.jrdLineNo);
    if (!detail) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'JOURNAL_DETAIL_DETAIL', detail);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const jrdUpdate = async (req, res) => {
  try {
    const detail = await journalService.updateJournalDetail(req.params.jrdJrnCode, req.params.jrdLineNo, req.body);
    ResponseHandler.recordUpdated(res, detail);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const jrdDelete = async (req, res) => {
  try {
    await journalService.deleteJournalDetail(req.params.jrdJrnCode, req.params.jrdLineNo);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
}; 