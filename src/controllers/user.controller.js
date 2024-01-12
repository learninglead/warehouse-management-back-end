const db = require('../db');
const createError = require('http-errors');

exports.getUsers = async (req, res, next) => {
    try {
        const text = `SELECT * FROM users ORDER BY id ASC`;
        const { rows } = await db.query(text);

        if (Array.isArray(rows) && !rows.length) {
            throw createError(404, 'There is no user!')
        }        
        
        return res.status(200).json({
            success: true,
            users: rows
        });

    } catch (error) {
        if (error.status !== 404) {
            next(createError('Cannot get user list!'));
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
            throw createError(404, 'User not found!')
        }  
        
        return res.status(200).json({
            success: true,
            users: rows
        });

    } catch (error) {
        if (error.status !== 404) {
            next(createError('Cannot get user!'));
        }
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const {name, email} = req.body;
        const text = `
            INSERT INTO users (name, email) 
            VALUES ($1, $2) 
            RETURNING id
        `;
        const values = [name, email];

        const results = await db.query(text, values);
        
        return res.status(200).json({
            success: true,
            message: `User added with ID: ${results.rows[0].id}`
        });

    } catch (error) {
        next(createError('Cannot create user!'));
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        if (await checkUser(id) === false) {
            throw createError(404, `There is no user who have id: ${id}`);
        }

        const {name, email} = req.body;
        const text = `UPDATE users SET name = $1, email = $2 WHERE id = $3`;
        const values = [name, email, id];

        await db.query(text, values);
        
        return res.status(200).json({
            success: true,
            message: `User modified with ID: ${id}`
        });

    } catch (error) {
        if (error.status !== 404) {
            next(createError('Cannot modify user!'));
        }
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        if (await checkUser(id) === false) {
            throw createError(404, `There is no user who have id: ${id}`);
        }

        const text = `DELETE FROM users WHERE id = $1`;
        const values = [id];

        await db.query(text, values);
        
        return res.status(200).json({
            success: true,
            message: `User deleted with ID: ${id}`
        });

    } catch (error) {
        if (error.status !== 404) {
            next(createError('Cannot modify user!'));
        }
        next(error);
    }
};

const checkUser = async (id) => {
    const text = `SELECT * FROM users WHERE id = $1`;
    const values = [id];
    const { rows } = await db.query(text, values);

    if (Array.isArray(rows) && rows.length){
        return true;
    }
    return false;
}