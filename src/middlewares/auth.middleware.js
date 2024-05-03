const jwt = require("jsonwebtoken");
const db = require("../db");

const authHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const id = parseInt(decode?.id);
    const text = `SELECT id, name, email, role FROM users WHERE id = $1 AND active = 1`;
    const values = [id];
    const { rows } = await db.query(text, values);

    if (Array.isArray(rows) && !rows.length) {
      res.status(401).send({ error: "You are not authorized!" });
    }
    req.token = token;
    req.user = rows[0];
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate!" });
  }
};

const authPurchaseHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const id = parseInt(decode?.id);
    const text = `SELECT id, name, email, role FROM users WHERE id = $1 AND active = 1`;
    const values = [id];
    const { rows } = await db.query(text, values);

    if ((Array.isArray(rows) && !rows.length) || rows[0].role !== "purchase") {
      res.status(401).send({ error: "You are not authorized!" });
    }
    req.token = token;
    req.user = rows[0];
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate!" });
  }
};

module.exports = { authHandler, authPurchaseHandler };
