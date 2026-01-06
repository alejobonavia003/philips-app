import * as habitModel from "../models/habitModel.js";

export const createHabit = async (req, res) => {
  try {
    const { user_id, title, description, frequency } = req.body;
    if (!user_id || !title) return res.status(400).json({ message: "user_id y title son obligatorios" });
    const habit = await habitModel.createHabit(user_id, title, description || null, frequency || 'daily');
    res.status(201).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando hábito" });
  }
};

export const getHabitsByUser = async (req, res) => {
  try {
    const habits = await habitModel.getHabitsByUser(req.params.id);
    res.status(200).json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo hábitos" });
  }
};

export const getHabitById = async (req, res) => {
  try {
    const habit = await habitModel.getHabitById(req.params.id);
    if (!habit) return res.status(404).json({ message: "Hábito no encontrado" });
    res.status(200).json(habit);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo hábito" });
  }
};

export const updateHabit = async (req, res) => {
  try {
    const updated = await habitModel.updateHabit(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Hábito no encontrado" });
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error actualizando hábito" });
  }
};

export const deleteHabit = async (req, res) => {
  try {
    const deleted = await habitModel.deleteHabit(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Hábito no encontrado" });
    res.status(200).json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error eliminando hábito" });
  }
};
