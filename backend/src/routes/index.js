import express from "express";
const router = express.Router();
// اینجا routeهای هر ماژول اضافه می‌شود
import authRoutes from "./auth.js";
import personRoutes from "./person.js";
import projectRoutes from "./project.js";
import unitRoutes from "./unit.js";
import reservationRoutes from "./reservation.js";
import walletRoutes from "./wallet.js";
import journalRoutes from "./journal.js";
import shareRoutes from "./share.js";
import reportRoutes from "./report.js";
import accountRoutes from "./account.js";
import themeRoutes from "./theme.js";

router.use("/auth", authRoutes);
router.use("/persons", personRoutes);
router.use("/projects", projectRoutes);
router.use("/units", unitRoutes);
router.use("/reservations", reservationRoutes);
router.use("/journals", journalRoutes);
router.use("/shares", shareRoutes);
router.use("/reports", reportRoutes);
router.use("/wallets", walletRoutes);
router.use("/accounts", accountRoutes);
router.use("/theme", themeRoutes);

export default router; 