import express from "express";
import * as walletController from "../controllers/walletController.js";
const router = express.Router();

// Wallet
router.post("/wltCreate", walletController.wltCreate);
router.get("/wltGetAll", walletController.wltGetAll);
router.get("/wltGetById/:wltPerCode", walletController.wltGetById);
router.put("/wltUpdate/:wltPerCode", walletController.wltUpdate);
router.delete("/wltDelete/:wltPerCode", walletController.wltDelete);

// WalletTransaction
router.post("/wtxCreate", walletController.wtxCreate);
router.get("/wtxGetAll", walletController.wtxGetAll);
router.get("/wtxGetById/:wtxId", walletController.wtxGetById);
router.put("/wtxUpdate/:wtxId", walletController.wtxUpdate);
router.delete("/wtxDelete/:wtxId", walletController.wtxDelete);

export default router; 