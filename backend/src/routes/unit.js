import express from "express";
import * as unitController from "../controllers/unitController.js";
const router = express.Router();

router.post("/untCreate", unitController.untCreate);
router.get("/untGetAll", unitController.untGetAll);
router.get("/untGetById/:untPrjCode/:untCode", unitController.untGetById);
router.put("/untUpdate/:untPrjCode/:untCode", unitController.untUpdate);
router.delete("/untDelete/:untPrjCode/:untCode", unitController.untDelete);

export default router; 