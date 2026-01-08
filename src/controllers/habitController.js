import * as habitModel from "../models/habitModel.js";

// Crear un hábito
export const createHabit = async (req, res) => {
  try {
    const { user_id, name, frequency } = req.body;
    if (!user_id || !name) {
      return res
        .status(400)
        .json({ message: "user_id y name son obligatorios" });
    }
    const habit = await habitModel.createHabit(
      user_id,
      name,
      frequency || "daily"
    );
    res.status(201).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando hábito" });
  }
};

// Obtener hábitos de un usuario
export const getHabitsByUser = async (req, res) => {
  try {
    const habits = await habitModel.getHabitsByUser(req.params.id);
    res.status(200).json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo hábitos" });
  }
};

// Obtener un hábito por id
export const getHabitById = async (req, res) => {
  try {
    const habit = await habitModel.getHabitById(req.params.id);
    if (!habit)
      return res.status(404).json({ message: "Hábito no encontrado" });
    res.status(200).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo hábito" });
  }
};

// Actualizar un hábito (name, frequency)
export const updateHabit = async (req, res) => {
  try {
    const { name, frequency } = req.body;
    const updated = await habitModel.updateHabit(req.params.id, {
      name,
      frequency,
    });
    if (!updated)
      return res.status(404).json({ message: "Hábito no encontrado" });
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando hábito" });
  }
};

// Eliminar hábito
export const deleteHabit = async (req, res) => {
  try {
    const deleted = await habitModel.deleteHabit(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Hábito no encontrado" });
    res.status(200).json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando hábito" });
  }
};

// ---------------- Habit Logs controllers ----------------

export const addHabitLog = async (req, res) => {
  try {
    const habit_id = req.params.id;
    const { date, completed } = req.body;
    if (!date)
      return res.status(400).json({ message: "La fecha es obligatoria" });
    const log = await habitModel.addHabitLog(
      habit_id,
      date,
      completed === true
    );
    res.status(201).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando/actualizando habit_log" });
  }
};

export const getHabitLogs = async (req, res) => {
  try {
    const habit_id = req.params.id;
    const { start, end } = req.query;
    const logs = await habitModel.getHabitLogs(
      habit_id,
      start || null,
      end || null
    );
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo habit_logs" });
  }
};

export const getHabitLogByDate = async (req, res) => {
  try {
    const habit_id = req.params.id;
    const date = req.params.date;
    const log = await habitModel.getHabitLogByDate(habit_id, date);
    if (!log) return res.status(404).json({ message: "Log no encontrado" });
    res.status(200).json(log);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo habit_log" });
  }
};

export const updateHabitLog = async (req, res) => {
  try {
    const logId = req.params.logId;
    const updated = await habitModel.updateHabitLog(logId, req.body);
    if (!updated) return res.status(404).json({ message: "Log no encontrado" });
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando habit_log" });
  }
};

export const deleteHabitLog = async (req, res) => {
  try {
    const logId = req.params.logId;
    const deleted = await habitModel.deleteHabitLog(logId);
    if (!deleted) return res.status(404).json({ message: "Log no encontrado" });
    res.status(200).json({ message: "Log eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando habit_log" });
  }
};
