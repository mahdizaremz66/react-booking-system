import express from "express";
import * as accountController from "../controllers/accountController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// همه روت‌های حساب با احراز هویت و نقش admin یا manager
router.use(authenticate);
router.use(authorize(["admin", "manager"]));

// Account CRUD operations
router.get("/accGetAll", accountController.accGetAll);
router.get("/accGetById/:accCode", accountController.accGetById);
router.post("/accCreate", accountController.accCreate);
router.put("/accUpdate/:accCode", accountController.accUpdate);
router.delete("/accDelete/:accCode", accountController.accDelete);
router.post("/accDeleteBulk", accountController.accDeleteBulk);

// Account tree structure
router.get("/accGetTree", accountController.accGetTree);
router.get("/accGetChildren/:accCode", accountController.accGetChildren);

// Bank account operations
router.get("/accGetBankInfo/:accCode", accountController.accGetBankInfo);
router.post("/accSaveBankInfo/:accCode", accountController.accSaveBankInfo);
router.put("/accUpdateBankInfo/:accCode", accountController.accUpdateBankInfo);
router.delete("/accDeleteBankInfo/:accCode", accountController.accDeleteBankInfo);

// Account statistics and reports
router.get("/accGetStats", accountController.accGetStats);
router.get("/accGetByCategory/:category", accountController.accGetByCategory);
router.get("/accGetByType/:type", accountController.accGetByType);

export default router; 