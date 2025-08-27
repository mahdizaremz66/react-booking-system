import express from "express";
import * as shareController from "../controllers/shareController.js";
const router = express.Router();

// Shareholding
router.post("/shrCreate", shareController.shrCreate);
router.get("/shrGetAll", shareController.shrGetAll);
router.get("/shrGetById/:shrId", shareController.shrGetById);
router.put("/shrUpdate/:shrId", shareController.shrUpdate);
router.delete("/shrDelete/:shrId", shareController.shrDelete);

// ShareTransfer
router.post("/stfCreate", shareController.stfCreate);
router.get("/stfGetAll", shareController.stfGetAll);
router.get("/stfGetById/:stfId", shareController.stfGetById);
router.put("/stfUpdate/:stfId", shareController.stfUpdate);
router.delete("/stfDelete/:stfId", shareController.stfDelete);

// ShareProfit
router.post("/sptCreate", shareController.sptCreate);
router.get("/sptGetAll", shareController.sptGetAll);
router.get("/sptGetById/:sptId", shareController.sptGetById);
router.put("/sptUpdate/:sptId", shareController.sptUpdate);
router.delete("/sptDelete/:sptId", shareController.sptDelete);

export default router; 