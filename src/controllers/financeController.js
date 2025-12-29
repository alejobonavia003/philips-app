import * as financeModel from "../models/financeModel.js";

/**
 * REGISTRAR UN MOVIMIENTO FINANCIERO (Ingreso o Egreso)
 * Body: { user_id, amount, type, description, todo_id (opcional) }
 */
export const addTransaction = async (req, res) => {
  try {
    const { user_id, amount, type, description, todo_id } = req.body;

    // Validaciones básicas
    if (!user_id || !amount || !type) {
      return res.status(400).send({
        message: "Faltan datos obligatorios.",
      });
    }

    const record = await financeModel.addFinanceRecord(
      user_id,
      amount,
      type,
      description,
      todo_id
    );

    res.status(201).send(record);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error al registrar el movimiento financiero.",
    });
  }
};

/**
 * OBTENER EL BALANCE TOTAL DE UN USUARIO
 */
export const getBalance = async (req, res) => {
  try {
    const balance = await financeModel.getUserBalance(req.params.id);
    res.status(200).send(balance);
  } catch (error) {
    res.status(500).send({
      message: "Error al obtener el balance.",
    });
  }
};

/**
 * OBTENER HISTORIAL FINANCIERO DE UN USUARIO
 */
export const getHistory = async (req, res) => {
  try {
    const history = await financeModel.getFinanceHistory(req.params.id);
    res.status(200).send(history);
  } catch (error) {
    res.status(500).send({
      message: "Error al obtener el historial.",
    });
  }
};
