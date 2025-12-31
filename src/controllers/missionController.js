import * as missionModel from "../models/missionModel.js";

export const create = async (req, res) => {
  try {
    const {
      user_id,
      title,
      description,
      type,
      parent_id,
      financial_goal,
      deadline,
    } = req.body;

    // Validación básica
    if (!title || !type) {
      return res
        .status(400)
        .json({ message: "Título y tipo son obligatorios" });
    }

    const newMission = await missionModel.createMission(
      user_id,
      title,
      description,
      type,
      parent_id,
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
    const missions = await missionModel.getAllMissions(req.params.userId);
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener misiones" });
  }
};

export const getPrimaries = async (req, res) => {
  try {
    const missions = await missionModel.getPrimaryMissions(req.params.userId);
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener misiones primarias" });
  }
};

export const getSecondaries = async (req, res) => {
  try {
    const missions = await missionModel.getSecondaryMissions(
      req.params.parentId
    );
    res.status(200).json(missions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener misiones secundarias" });
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
