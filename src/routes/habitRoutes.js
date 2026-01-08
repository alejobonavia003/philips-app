import express from "express";
import * as habitController from "../controllers/habitController.js";

const router = express.Router();

// Base: /habits
router.post("/", habitController.createHabit);
router.get("/user/:id", habitController.getHabitsByUser);
router.get("/:id", habitController.getHabitById);
router.put("/:id", habitController.updateHabit);
router.delete("/:id", habitController.deleteHabit);

// Habit logs
router.post("/:id/logs", habitController.addHabitLog);
router.get("/:id/logs", habitController.getHabitLogs); // optional ?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get("/:id/logs/:date", habitController.getHabitLogByDate);
router.put("/logs/:logId", habitController.updateHabitLog);
router.delete("/logs/:logId", habitController.deleteHabitLog);

export default router;
