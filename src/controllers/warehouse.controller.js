const db = require("../db");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");

exports.createWarehouse = async (req, res, next) => {
  try {
    const { name } = req.body;

    if ((await checkWarehouseByName(name)) === true) {
      throw createError(422, `Warehouse is already exists!`);
    }

    const text = `
            INSERT INTO warehouse (name, user_id) 
            VALUES ($1, $2) 
            RETURNING id
        `;

    const values = [name, req.user.id];

    const results = await db.query(text, values);

    return res.status(200).json({
      success: true,
      message: `User added with ID: ${results.rows[0].id}`,
    });
  } catch (error) {
    console.log("E", error?.message);
    next(
      createError(error?.message ? error?.message : "Cannot create warehouse!")
    );
  }
};

exports.getAllWarehouse = async (req, res, next) => {
  try {
    const text = `SELECT id,name FROM warehouse WHERE active = 1`;

    const { rows } = await db.query(text);

    return res.status(200).json({
      success: true,
      warehouses: rows,
    });
  } catch (error) {
    next(
      createError(error?.message ? error?.message : "Cannot get warehouses!")
    );
  }
};

const checkWarehouse = async (id) => {
  const text = `SELECT * FROM warehouse WHERE id = $1`;
  const values = [id];
  const { rows } = await db.query(text, values);

  if (Array.isArray(rows) && rows.length) {
    return true;
  }
  return false;
};

const checkWarehouseByName = async (name) => {
  const text = `SELECT id FROM warehouse WHERE name = $1`;
  const values = [name];
  const { rows } = await db.query(text, values);

  if (Array.isArray(rows) && rows.length) {
    return true;
  }
  return false;
};
