import express from "express";
import * as financeController from "../controllers/financeController.js";
// (Asume que creaste financeController similar a todoController)

const router = express.Router();

router.post("/", financeController.addTransaction);
router.get("/balance/:id", financeController.getBalance);
router.get("/user/:id", financeController.getHistory);
router.delete("/:id", financeController.remove);

export default router;
