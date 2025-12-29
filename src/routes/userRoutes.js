import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/:id", userController.getUserByID); //
router.get("/:email", userController.getUserbyEmail); //nueva

export default router; //////////////
