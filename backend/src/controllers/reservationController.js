import * as reservationService from "../services/reservationService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

export const resCreate = async (req, res) => {
  try {
    const reservation = await reservationService.createReservation(req.body);
    ResponseHandler.recordCreated(res, reservation);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const resGetAll = async (req, res) => {
  try {
    const reservations = await reservationService.getAllReservations();
    ResponseHandler.success(res, 'RESERVATION_LIST', reservations);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const resGetById = async (req, res) => {
  try {
    const reservation = await reservationService.getReservationById(req.params.resId);
    if (!reservation) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'RESERVATION_DETAIL', reservation);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const resUpdate = async (req, res) => {
  try {
    const reservation = await reservationService.updateReservation(req.params.resId, req.body);
    ResponseHandler.recordUpdated(res, reservation);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const resDelete = async (req, res) => {
  try {
    await reservationService.deleteReservation(req.params.resId);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
}; 