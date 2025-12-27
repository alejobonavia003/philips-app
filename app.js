import express from "express";
import {
  getTodosByID,
  getTodo,
  getSharedTodoById,
  getUserById,
  getUserByEmail,
  createTodo,
  deleteTodo,
  toggleTodo,
  shareTodo,
  checkAlreadyShared,
  addFinanceRecord,
  getUserBalance,
  getFinanceHistory,
  pauseTask,
  startTask,
} from "./database.js";
import cors from "cors";

const corsOptions = {
  origin: "*", // Reemplaza con el origen de tu cliente
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};

const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cors(corsOptions)); // Enable CORS with specified options

/**
 * obtener un todo por id
 */
app.get("/todos/:id", async (req, res) => {
  const todo = await getTodo(req.params.id);
  res.status(200).send(todo);
}); //OK

/**
 * obtener los todos relacionados a un usuario
 * incluyendo los compartidos
 */
app.get("/todos/user/:id", async (req, res) => {
  const todos = await getTodosByID(req.params.id);
  res.status(200).send(todos);
}); //OK

/**
 * marcar un todo como completado o no completado
 */
app.put("/todos/:id", async (req, res) => {
  const todo = await toggleTodo(req.params.id);
  res.status(200).send(todo);
}); //OK

/**
 * eliminar un todo
 */
app.delete("/todos/:id", async (req, res) => {
  const result = await deleteTodo(req.params.id);

  if (result === 0) {
    return res.status(404).send({ messaje: "Todo no encontrado" });
  } else {
    res.send({ messaje: "Todo eliminado correctamente" });
  }
}); //OK

/**
 * obtener todos los usuarios relacionados a un todo
 * estos serian el dueño y con quien se ha compartido
 * @param {id del todo} id
 */
app.get("/todos/shared_todos/:id", async (req, res) => {
  const todo = await getSharedTodoById(req.params.id);

  if (todo.length === 0) {
    return res.json({ message: "Todo No compartido." });
  }

  const author = await getUserById(todo[0].user_id);
  let sharedTodo = [];
  for (let i = 0; i < todo.length; i++) {
    sharedTodo.push(await getUserById(todo[i].shared_with_id));
  }

  res.status(200).send({ author, sharedTodo });
}); //OK

/**
 * compartir un todo con otro usuario por email
 */
/**
 * compartir un todo con otro usuario por email
 */
app.post("/todos/shared_todos", async (req, res) => {
  try {
    const { todo_id, user_id, email } = req.body;

    // 1. Buscar al usuario por email
    const userToShare = await getUserByEmail(email);
    if (!userToShare) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // 2. EVITAR COMPARTIR CON UNO MISMO
    if (userToShare.id === user_id) {
      return res
        .status(400)
        .send({ message: "No puedes compartir una tarea contigo mismo." });
    }

    // 3. VERIFICAR SI YA ESTÁ COMPARTIDO
    const alreadyShared = await checkAlreadyShared(todo_id, userToShare.id);
    if (alreadyShared) {
      return res
        .status(400)
        .send({ message: "Esta tarea ya está compartida con este usuario." });
    }

    // 4. Compartir si todo está bien
    const sharedTodo = await shareTodo(todo_id, userToShare.id, user_id);
    res.status(200).send(sharedTodo);
  } catch (error) {
    res.status(500).send({ message: "Error interno del servidor" });
  }
}); //OK

/**
 * crear un todo de un usuario
 */

app.post("/todos", async (req, res) => {
  const user_id = req.body.user_id;
  const title = req.body.title;
  const description = req.body.description;
  const todo = await createTodo(user_id, title, description);
  res.status(200).send(todo);
}); //OK

/**
 * obtener usuario por id
 */
app.get("/user/:id", async (req, res) => {
  const user = await getUserById(req.params.id);
  res.status(200).send(user); //
}); //OK

/**
 * REGISTRAR UN MOVIMIENTO FINANCIERO (Ingreso o Egreso)
 * Body: { user_id, amount, type, description, todo_id (opcional) }
 */
app.post("/finances", async (req, res) => {
  try {
    const { user_id, amount, type, description, todo_id } = req.body;

    if (!user_id || !amount || !type) {
      return res.status(400).send({ message: "Faltan datos obligatorios." });
    }

    const record = await addFinanceRecord(
      user_id,
      amount,
      type,
      description,
      todo_id
    );
    res.status(201).send(record);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error al registrar el movimiento financiero." });
  }
}); //OK

/**
 * OBTENER EL BALANCE TOTAL DE UN USUARIO
 */
app.get("/finances/balance/:id", async (req, res) => {
  try {
    const balance = await getUserBalance(req.params.id);
    res.status(200).send(balance);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el balance." });
  }
}); //OK

/**
 * OBTENER HISTORIAL FINANCIERO DE UN USUARIO
 */
app.get("/finances/user/:id", async (req, res) => {
  try {
    const history = await getFinanceHistory(req.params.id);
    res.status(200).send(history);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener el historial." });
  }
}); //OK

/**
 * dar inicio a una tarea
 */
app.post("/todos/start/:id", async (req, res) => {
  const log = await startTask(req.params.id);
  res.status(200).send(log);
});

/**
 * pausar una tarea
 */
app.post("/todos/pause/:id", async (req, res) => {
  const log = await pauseTask(req.params.id);
  res.status(200).send(log);
});

//sufrimos por que nos aferramos a una vercion de la realidad que ya no existe

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
