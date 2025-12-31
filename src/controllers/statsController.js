import * as statsModel from "../models/statsModel.js";

// 1. Horas por tarea hoy (Para el gráfico de barras)
export const getDaily = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await statsModel.getDailyStats(id);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error en getDaily:", error);
    res.status(500).json({ message: "Error al obtener estadísticas diarias" });
  }
};

// 2. Productividad de la última semana
export const getWeekly = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await statsModel.getWeeklyProductivity(id);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error en getWeekly:", error);
    res.status(500).json({ message: "Error al obtener productividad semanal" });
  }
};

// 3. Correlación tiempo vs dinero (La "rentabilidad" de Philips Manager)
export const getCorrelation = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await statsModel.getTimeMoneyCorrelation(id);
    res.status(200).json(stats);
  } catch (error) {
    console.error("Error en getCorrelation:", error);
    res
      .status(500)
      .json({ message: "Error al calcular correlación tiempo/dinero" });
  }
};

export const getHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await statsModel.getTimeHistory(id);
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo historial de tiempo" });
  }
};
