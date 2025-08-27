import express from "express";
import * as journalController from "../controllers/journalController.js";
const router = express.Router();

// RESTful Journal endpoints
router.post("/", journalController.jrnSave);
router.get("/", journalController.jrnGetAll);
router.get("/:jrnCode", journalController.jrnGetById);
router.put("/:jrnCode", journalController.jrnSave); // Update uses same save function
router.delete("/:jrnCode", journalController.jrnDelete);

// Legacy endpoints for backward compatibility
router.post("/jrnSave", journalController.jrnSave);
router.get("/jrnGetAll", journalController.jrnGetAll);
router.get("/jrnGetById/:jrnCode", journalController.jrnGetById);
router.delete("/jrnDelete/:jrnCode", journalController.jrnDelete);

// JournalDetail endpoints
router.post("/jrdCreate", journalController.jrdCreate);
router.get("/jrdGetAll", journalController.jrdGetAll);
router.get("/jrdGetById/:jrdJrnCode/:jrdLineNo", journalController.jrdGetById);
router.put("/jrdUpdate/:jrdJrnCode/:jrdLineNo", journalController.jrdUpdate);
router.delete("/jrdDelete/:jrdJrnCode/:jrdLineNo", journalController.jrdDelete);

export default router; 