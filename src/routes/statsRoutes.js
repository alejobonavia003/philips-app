import express from "express";
import * as statsCtrl from "../controllers/statsController.js";

const router = express.Router();

// Todas estas rutas asumen que el prefijo es /stats
router.get("/daily/:id", statsCtrl.getDaily);
router.get("/weekly/:id", statsCtrl.getWeekly);
router.get("/correlation/:id", statsCtrl.getCorrelation);

export default router;
