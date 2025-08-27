import * as unitService from "../services/unitService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

export const untCreate = async (req, res) => {
  try {
    const unit = await unitService.createUnit(req.body);
    ResponseHandler.recordCreated(res, unit);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const untGetAll = async (req, res) => {
  try {
    const units = await unitService.getAllUnits();
    ResponseHandler.success(res, 'UNIT_LIST', units);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const untGetById = async (req, res) => {
  try {
    const { untPrjCode, untCode } = req.params;
    const unit = await unitService.getUnitById(untPrjCode, untCode);
    if (!unit) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'UNIT_DETAIL', unit);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const untUpdate = async (req, res) => {
  try {
    const { untPrjCode, untCode } = req.params;
    const unit = await unitService.updateUnit(untPrjCode, untCode, req.body);
    ResponseHandler.recordUpdated(res, unit);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const untDelete = async (req, res) => {
  try {
    const { untPrjCode, untCode } = req.params;
    await unitService.deleteUnit(untPrjCode, untCode);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
}; 