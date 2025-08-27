import express from "express";
import * as reportController from "../controllers/reportController.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// همه روت‌های گزارش با احراز هویت و نقش admin یا manager
router.get("/rptGetGeneralLedger", authenticate, authorize(["admin", "manager"]), reportController.rptGetGeneralLedger);
router.get("/rptGetPersonLedger", authenticate, authorize(["admin", "manager"]), reportController.rptGetPersonLedger);
router.get("/rptGetTrialBalance", authenticate, authorize(["admin", "manager"]), reportController.rptGetTrialBalance);
router.get("/rptGetPersonBalance", authenticate, authorize(["admin", "manager"]), reportController.rptGetPersonBalance);
router.get("/rptGetConfigMap", authenticate, authorize(["admin", "manager"]), reportController.rptGetConfigMap);
router.get("/rptGetReservationSummary", authenticate, authorize(["admin", "manager"]), reportController.rptGetReservationSummary);
router.get("/rptGetTariffConsumption", authenticate, authorize(["admin", "manager"]), reportController.rptGetTariffConsumption);
router.get("/rptGetTariffExtraByAge", authenticate, authorize(["admin", "manager"]), reportController.rptGetTariffExtraByAge);
router.get("/rptGetWalletBalance", authenticate, authorize(["admin", "manager"]), reportController.rptGetWalletBalance);
router.get("/rptGetWalletTxnHistory", authenticate, authorize(["admin", "manager"]), reportController.rptGetWalletTxnHistory);
router.get("/rptGetProfitDistribution", authenticate, authorize(["admin", "manager"]), reportController.rptGetProfitDistribution);
router.get("/rptGetUserLogAudit", authenticate, authorize(["admin", "manager"]), reportController.rptGetUserLogAudit);
router.get("/rptGetProjectPersonRoles", authenticate, authorize(["admin", "manager"]), reportController.rptGetProjectPersonRoles);
router.get("/rptGetReservationReportSummary", authenticate, authorize(["admin", "manager"]), reportController.rptGetReservationReportSummary);

export default router; 