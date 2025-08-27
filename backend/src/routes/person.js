import express from "express";
import * as personController from "../controllers/personController.js";
const router = express.Router();

router.post("/perCreate", personController.perCreate);
router.get("/perGetAll", personController.perGetAll);
router.get("/perGetById/:perCode", personController.perGetById);
router.put("/perUpdate/:perCode", personController.perUpdate);
router.delete("/perDelete/:perCode", personController.perDelete);

export default router; 