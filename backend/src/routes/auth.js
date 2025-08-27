import express from "express";
import { usrLogin, usrRegister } from "../controllers/authController.js";
const router = express.Router();
router.post("/usrLogin", usrLogin);
router.post("/usrRegister", usrRegister);
export default router; 