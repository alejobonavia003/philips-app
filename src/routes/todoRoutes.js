import express from "express";
import * as todoController from "../controllers/todoController.js";

const router = express.Router();

// Rutas base: /todos
router.post("/", todoController.createNewTodo); //
router.get("/user/:id", todoController.getTodosByUser); //
router.get("/:id", todoController.getTodoById); //
router.delete("/:id", todoController.deleteTodo); //
router.put("/:id", todoController.toggleTodo); //
router.get("/shared_todos/:id", todoController.getSharedTodoUsers); //
router.post("/shared_todos", todoController.shareTodo); //

// Rutas de tiempo
router.post("/start/:id", todoController.startTodo);
router.post("/pause/:id", todoController.pauseTodo);

export default router;
