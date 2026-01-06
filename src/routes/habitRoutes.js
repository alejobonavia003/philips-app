import express from "express";
import * as habitController from "../controllers/habitController.js";

const router = express.Router();

// Base: /habits
router.post("/", habitController.createHabit);
router.get("/user/:id", habitController.getHabitsByUser);
router.get("/:id", habitController.getHabitById);
router.put("/:id", habitController.updateHabit);
router.delete("/:id", habitController.deleteHabit);

export default router;
