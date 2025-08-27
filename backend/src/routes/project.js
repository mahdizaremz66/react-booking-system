import express from "express";
import * as projectController from "../controllers/projectController.js";
const router = express.Router();

router.post("/prjCreate", projectController.prjCreate);
router.get("/prjGetAll", projectController.prjGetAll);
router.get("/prjGetById/:prjCode", projectController.prjGetById);
router.put("/prjUpdate/:prjCode", projectController.prjUpdate);
router.delete("/prjDelete/:prjCode", projectController.prjDelete);

export default router; 