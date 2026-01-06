import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todoRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import missionRoutes from "./routes/missionRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";

const app = express();

const corsOptions = {
  origin: "*",
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOptions));

// Definición de Rutas Maestras
app.use("/todos", todoRoutes); // Todo lo que empiece con /todos va a todoRoutes
app.use("/finances", financeRoutes); // Todo lo que empiece con /finances va a financeRoutes
app.use("/user", userRoutes); // ...
app.use("/stats", statsRoutes);
app.use("/missions", missionRoutes);
app.use("/habits", habitRoutes);

const PORT = process.env.PORT || 8080;
app.listen(8080, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
