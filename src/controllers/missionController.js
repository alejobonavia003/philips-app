import * as missionModel from "../models/missionModel.js";

export const create = async (req, res) => {
  try {
    const { user_id, title, description, financial_goal, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ message: "El título es obligatorio" });
    }

    const newMission = await missionModel.createMission(
      user_id,
      title,
      description,
      financial_goal,
      deadline
    );

    res.status(201).json(newMission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la misión" });
  }
};

export const getAll = async (req, res) => {
  try {
    const missions = await missionModel.getAllMissions(req.params.id);
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener misiones" });
  }
};

export const remove = async (req, res) => {
  try {
    await missionModel.deleteMission(req.params.id);
    res.status(200).json({ message: "Misión eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar misión" });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMission = await missionModel.updateMission(id, req.body);

    if (!updatedMission) {
      return res.status(404).json({ message: "Misión no encontrada" });
    }

    res.status(200).json(updatedMission);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar misión" });
  }
};
