# Documentación de la API

Base URL: `http://localhost:8080`

**Resumen:** este documento lista los endpoints expuestos por el servidor (mount paths + rutas definidas).

**Rutas y Endpoints**

- **Todos:** Base path `/todos`

  - **POST** `/todos/` : crear un nuevo todo — `createNewTodo`
  - **GET** `/todos/user/:id` : listar todos del usuario `:id` — `getTodosByUser`
  - **GET** `/todos/:id` : obtener un todo por id — `getTodoById`
  - **DELETE** `/todos/:id` : eliminar un todo por id — `deleteTodo`
  - **PUT** `/todos/:id` : alternar/actualizar un todo por id — `toggleTodo`
  - **GET** `/todos/shared_todos/:id` : obtener usuarios con quienes se compartió el todo `:id` — `getSharedTodoUsers`
  - **POST** `/todos/shared_todos` : compartir un todo — `shareTodo`
  - **POST** `/todos/start/:id` : iniciar temporizador/tiempo de un todo `:id` — `startTodo`
  - **POST** `/todos/pause/:id` : pausar temporizador/tiempo de un todo `:id` — `pauseTodo`

- **Finances:** Base path `/finances`

  - **POST** `/finances/` : agregar una transacción — `addTransaction`
  - **GET** `/finances/balance/:id` : obtener balance (por usuario/id) — `getBalance`
  - **GET** `/finances/user/:id` : historial/transacciones del usuario `:id` — `getHistory`
  - **DELETE** `/finances/:id` : eliminar registro financiero por id — `remove`

- **User:** Base path `/user`

  - **GET** `/user/:id` : obtener usuario por id — `getUserByID`
  - **GET** `/user/:email` : obtener usuario por email — `getUserbyEmail`

- **Stats:** Base path `/stats`

  - **GET** `/stats/daily/:id` : estadísticas diarias para `:id` — `getDaily`
  - **GET** `/stats/weekly/:id` : estadísticas semanales para `:id` — `getWeekly`
  - **GET** `/stats/correlation/:id` : correlaciones para `:id` — `getCorrelation`
  - **GET** `/stats/history/:id` : historial de stats para `:id` — `getHistory`

- **Missions:** Base path `/missions`

  - **POST** `/missions/` : crear una misión — `create`
  - **GET** `/missions/user/:userId` : obtener todas las misiones del usuario `:userId` — `getAll`
  - **GET** `/missions/primaries/:userId` : obtener misiones primarias del usuario `:userId` — `getPrimaries`
  - **GET** `/missions/secondaries/:parentId` : obtener misiones secundarias hijas de `:parentId` — `getSecondaries`
  - **DELETE** `/missions/:id` : eliminar misión por `:id` — `remove`

- **Habits:** Base path `/habits`

  - **POST** `/habits/` : crear un hábito — `createHabit` (body: `{ user_id, name, frequency? }`)
  - **GET** `/habits/user/:id` : listar hábitos de un usuario — `getHabitsByUser`
  - **GET** `/habits/:id` : obtener un hábito por id — `getHabitById`
  - **PUT** `/habits/:id` : actualizar un hábito — `updateHabit` (body: `{ name?, frequency? }`)
  - **DELETE** `/habits/:id` : eliminar hábito — `deleteHabit`

  // Habit logs (registro diario de hábitos)

  - **POST** `/habits/:id/logs` : crear/actualizar log del hábito `:id` para una `date` (body: `{ date: 'YYYY-MM-DD', completed: true|false }`) — `addHabitLog`
  - **GET** `/habits/:id/logs` : listar logs de un hábito `:id` (opcional `?start=YYYY-MM-DD&end=YYYY-MM-DD`) — `getHabitLogs`
  - **GET** `/habits/:id/logs/:date` : obtener log por fecha — `getHabitLogByDate`
  - **PUT** `/habits/logs/:logId` : actualizar un log por id — `updateHabitLog`
  - **DELETE** `/habits/logs/:logId` : eliminar log por id — `deleteHabitLog`

**Notas:**

- Los prefijos de ruta se definen en [src/app.js](src/app.js#L1-L200) con `app.use(...)`.
- Los handlers/controllers están en `src/controllers/` (ej.: `todoController.js`, `financeController.js`, etc.).
- Si quieres, puedo añadir ejemplos de request/response para cada endpoint o generar un archivo OpenAPI/Swagger.

---

Generado automáticamente a partir de las rutas en [src/routes](src/routes) el mismo día.
