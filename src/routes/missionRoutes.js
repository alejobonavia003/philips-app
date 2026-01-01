import express from "express";
import * as missionCtrl from "../controllers/missionController.js";

const router = express.Router();

router.post("/", missionCtrl.create);
router.get("/user/:id", missionCtrl.getAll); // Todas
router.get("/primaries/:userId", missionCtrl.getPrimaries); // Solo primarias
router.get("/secondaries/:parentId", missionCtrl.getSecondaries); // Hijos de una primaria
router.delete("/:id", missionCtrl.remove);
router.put("/:id", missionCtrl.update);

export default router;
