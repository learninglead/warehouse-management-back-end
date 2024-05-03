const db = require("../db");
const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.getUserAuth = async (id) => {
  try {
  } catch (error) {
    if (error.status !== 404) {
      next(createError("Cannot get user!"));
    }
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const text = `SELECT id, name, email, role FROM users ORDER BY id ASC`;
    const { rows } = await db.query(text);

    if (Array.isArray(rows) && !rows.length) {
      throw createError(404, "There is no user!");
    }

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    if (error.status !== 404) {
      next(createError("Cannot get user list!"));
    }
    next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const text = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const { rows } = await db.query(text, values);

    if (Array.isArray(rows) && !rows.length) {
      throw createError(404, "User not found!");
    }

    return res.status(200).json({
      success: true,
      users: rows,
    });
  } catch (error) {
    if (error.status !== 404) {
      next(createError("Cannot get user!"));
    }
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;

    if ((await checkUserByEmail(email)) === true) {
      throw createError(422, `Email is already exists!`);
    }

    const text = `
            INSERT INTO users (name, email, role, password) 
            VALUES ($1, $2, 'admin', $3) 
            RETURNING id
        `;
    const encryptedPassword = await bcrypt.hash(password, 8);
    const values = [name, email, encryptedPassword];

    const results = await db.query(text, values);

    return res.status(200).json({
      success: true,
      message: `User added with ID: ${results.rows[0].id}`,
    });
  } catch (error) {
    next(createError(error?.message ? error?.message : "Cannot create user!"));
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const text = `
            SELECT id,name,email,password,role 
            FROM users
            WHERE email = $1
        `;
    const values = [email];
    const { rows } = await db.query(text, values);
    const [user] = rows;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Invalid Credentials`,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: `Invalid Credentials`,
      });
    }
    const token = await jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    delete user.password;
    return res.status(200).json({
      success: true,
      message: "Logged In Successfully!",
      user,
      token: token,
    });
  } catch (error) {
    next(createError(error?.message ? error?.message : "Cannot create user!"));
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;

    if ((await checkUserByEmail(email)) === true) {
      throw createError(422, `Email is already exists!`);
    }

    const text = `
            INSERT INTO users (name, email, role, password) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id
        `;
    const encryptedPassword = await bcrypt.hash(password, 8);
    const values = [name, email, role, encryptedPassword];

    const results = await db.query(text, values);

    return res.status(200).json({
      success: true,
      message: `User added with ID: ${results.rows[0].id}`,
    });
  } catch (error) {
    console.log("E", error?.message);
    next(createError(error?.message ? error?.message : "Cannot create user!"));
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if ((await checkUser(id)) === false) {
      throw createError(404, `There is no user who have id: ${id}`);
    }

    const { name, email } = req.body;
    const text = `UPDATE users SET name = $1, email = $2 WHERE id = $3`;
    const values = [name, email, id];

    await db.query(text, values);

    return res.status(200).json({
      success: true,
      message: `User modified with ID: ${id}`,
    });
  } catch (error) {
    if (error.status !== 404) {
      next(createError("Cannot modify user!"));
    }
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if ((await checkUser(id)) === false) {
      throw createError(404, `There is no user who have id: ${id}`);
    }

    const text = `DELETE FROM users WHERE id = $1`;
    const values = [id];

    await db.query(text, values);

    return res.status(200).json({
      success: true,
      message: `User deleted with ID: ${id}`,
    });
  } catch (error) {
    if (error.status !== 404) {
      next(createError("Cannot modify user!"));
    }
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const id = parseInt(req.user.id);

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    if (error.status !== 404) {
      next(createError("Cannot modify user!"));
    }
    next(error);
  }
};

const checkUser = async (id) => {
  const text = `SELECT * FROM users WHERE id = $1`;
  const values = [id];
  const { rows } = await db.query(text, values);

  if (Array.isArray(rows) && rows.length) {
    return true;
  }
  return false;
};

const checkUserByEmail = async (email) => {
  const text = `SELECT id FROM users WHERE email = $1`;
  const values = [email];
  const { rows } = await db.query(text, values);

  if (Array.isArray(rows) && rows.length) {
    return true;
  }
  return false;
};
