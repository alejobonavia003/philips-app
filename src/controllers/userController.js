import * as userModel from "../models/userModel.js";

/**
 * obtener un usuario por id
 * @param {id del usuario} req
 * @param {*} res
 */
export const getUserByID = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.params.id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      message: "Error al buscar el usuario por id",
    });
  }
};

/**
 * obtener un usuario por email
 */
export const getUserbyEmail = async (req, res) => {
  try {
    const user = await userModel.getUserByEmail(req.params.email);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      message: "error al obtener el usuario por mail",
    });
  }
};
