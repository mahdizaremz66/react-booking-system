import * as projectService from "../services/projectService.js";
import { ResponseHandler } from "../utils/responseHandler.js";

export const prjCreate = async (req, res) => {
  try {
    const project = await projectService.createProject(req.body);
    ResponseHandler.recordCreated(res, project);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const prjGetAll = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    ResponseHandler.success(res, 'PROJECT_LIST', projects);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const prjGetById = async (req, res) => {
  try {
    const project = await projectService.getProjectById(req.params.prjCode);
    if (!project) return ResponseHandler.recordNotFound(res);
    ResponseHandler.success(res, 'PROJECT_DETAIL', project);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
};

export const prjUpdate = async (req, res) => {
  try {
    const project = await projectService.updateProject(req.params.prjCode, req.body);
    if (!project) return ResponseHandler.recordNotFound(res);
    ResponseHandler.recordUpdated(res, project);
  } catch (err) {
    ResponseHandler.validationError(res, err.message);
  }
};

export const prjDelete = async (req, res) => {
  try {
    const result = await projectService.deleteProject(req.params.prjCode);
    if (!result) return ResponseHandler.recordNotFound(res);
    ResponseHandler.recordDeleted(res);
  } catch (err) {
    ResponseHandler.internalError(res);
  }
}; 