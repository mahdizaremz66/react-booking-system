import express from "express";
import * as reservationController from "../controllers/reservationController.js";
const router = express.Router();

router.post("/resCreate", reservationController.resCreate);
router.get("/resGetAll", reservationController.resGetAll);
router.get("/resGetById/:resId", reservationController.resGetById);
router.put("/resUpdate/:resId", reservationController.resUpdate);
router.delete("/resDelete/:resId", reservationController.resDelete);

export default router; 