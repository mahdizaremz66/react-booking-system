import * as personService from "../services/personService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

export const perCreate = async (req, res) => {
  try {
    const person = await personService.createPerson(req.body);
    ResponseHandler.recordCreated(res, person);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const perGetAll = async (req, res) => {
  try {
    const persons = await personService.getAllPersons();
    ResponseHandler.success(res, 'PERSON_LIST', persons);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const perGetById = async (req, res) => {
  try {
    const person = await personService.getPersonById(req.params.perCode);
    if (!person) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'PERSON_DETAIL', person);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const perUpdate = async (req, res) => {
  try {
    const person = await personService.updatePerson(req.params.perCode, req.body);
    ResponseHandler.recordUpdated(res, person);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const perDelete = async (req, res) => {
  try {
    await personService.deletePerson(req.params.perCode);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
}; 