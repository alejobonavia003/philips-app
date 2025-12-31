import * as todoModel from "../models/todoModel.js";
import * as timeModel from "../models/timeModel.js";
import * as userModel from "../models/userModel.js";

/**
 * Obtener todos los todos de un usuario (incluye compartidos)
 */
export const getTodosByUser = async (req, res) => {
  try {
    const todos = await todoModel.getTodosByID(req.params.id);
    res.status(200).send(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener un todo por ID
 */
export const getTodoById = async (req, res) => {
  try {
    const todo = await todoModel.getTodo(req.params.id);
    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send({ message: "Error obteniendo el todo" });
  }
};

/**
 * Crear un todo para un usuario
/**
 * CREAR UNA NUEVA TAREA
 * Body: { user_id, title, description?, mission_id? }
 */
export const createNewTodo = async (req, res) => {
  try {
    const { user_id, title, description, mission_id } = req.body;

    if (!user_id || !title) {
      return res.status(400).json({
        error: "user_id y title son obligatorios",
      });
    }

    const newTodo = await todoModel.createTodo(
      user_id,
      title,
      description || null,
      mission_id || null
    );

    return res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error al crear todo:", error);

    return res.status(500).json({
      error: "Error interno al crear la tarea",
    });
  }
};

/**
 * Marcar un todo como completado / no completado
 */
export const toggleTodo = async (req, res) => {
  try {
    const todo = await todoModel.toggleTodo(req.params.id);
    res.status(200).send(todo);
  } catch (error) {
    res.status(500).send({ message: "Error actualizando tarea" });
  }
};

/**
 * Eliminar un todo
 */
export const deleteTodo = async (req, res) => {
  try {
    const result = await todoModel.deleteTodo(req.params.id);

    if (result === 0) {
      return res.status(404).send({ message: "Todo no encontrado" });
    }

    res.send({ message: "Todo eliminado correctamente" });
  } catch (error) {
    res.status(500).send({ message: "Error eliminando tarea" });
  }
};

/**
 * Obtener usuarios relacionados a un todo (dueño + compartidos)
 */
export const getSharedTodoUsers = async (req, res) => {
  try {
    const todo = await todoModel.getSharedTodoById(req.params.id);

    if (todo.length === 0) {
      return res.json({ message: "Todo no compartido." });
    }

    const author = await userModel.getUserById(todo[0].user_id);

    const sharedTodo = [];
    for (let i = 0; i < todo.length; i++) {
      sharedTodo.push(await userModel.getUserById(todo[i].shared_with_id));
    }

    res.status(200).send({ author, sharedTodo });
  } catch (error) {
    res.status(500).send({ message: "Error obteniendo compartidos" });
  }
};

/**
 * Compartir un todo con otro usuario por email
 */
export const shareTodo = async (req, res) => {
  try {
    const { todo_id, user_id, email } = req.body;

    const userToShare = await userModel.getUserByEmail(email);
    if (!userToShare) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    if (userToShare.id === user_id) {
      return res
        .status(400)
        .send({ message: "No puedes compartir una tarea contigo mismo." });
    }

    const alreadyShared = await todoModel.checkAlreadyShared(
      todo_id,
      userToShare.id
    );
    if (alreadyShared) {
      return res.status(400).send({
        message: "Esta tarea ya está compartida con este usuario.",
      });
    }

    const sharedTodo = await todoModel.shareTodo(
      todo_id,
      userToShare.id,
      user_id
    );

    res.status(200).send(sharedTodo);
  } catch (error) {
    res.status(500).send({ message: "Error interno del servidor" });
  }
};

/**
 * Iniciar una tarea (tracking de tiempo)
 */
export const startTodo = async (req, res) => {
  try {
    const log = await timeModel.startTask(req.params.id);
    res.status(200).send(log);
  } catch (error) {
    res.status(500).send({ message: "Error iniciando tarea" });
  }
};

/**
 * Pausar una tarea (tracking de tiempo)
 */
export const pauseTodo = async (req, res) => {
  try {
    const log = await timeModel.pauseTask(req.params.id);
    res.status(200).send(log);
  } catch (error) {
    res.status(500).send({ message: "Error pausando tarea" });
  }
};
