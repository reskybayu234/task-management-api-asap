const Joi = require('joi');
const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');
const resolver = {
    Query: {
        async getTask(_, args, { user, db }) {
            console.log('user', user);
            console.log('db', db);
            const { filterByStatus, filterByDueDate } = args;
            let query = "SELECT * FROM tasks WHERE 1=1";

            const params = [];

            if (filterByStatus) {
                query += " AND status = ?";
                params.push(filterByStatus);
            }

            if (filterByDueDate) {
                query += " AND dueDate = ?";
                params.push(filterByDueDate);

            }

            const [rows] = await db.query(query, params);
            return rows;
        },

        async getTaskDetail(_, { id }) {
            const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
            return rows[0] || null;
        }
    },

    Mutation: {
        async register(_, { user }) {
            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            });

            await schema.validateAsync(user);

            const { username, password } = user;

            const [existingUser] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

            if (existingUser.length > 0) {
                throw new Error("Username already exists");
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const [result] = await db.query("INSERT INTO users (username, password) VALUES(?,?)", [username, hashPassword]);

            return {
                id: result.insertId,
                username,
            }
        },

        async login(_, { user }) {
            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })

            await schema.validateAsync(user);

            const { username, password } = user;

            const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
            const dbUser = rows[0];

            if (!dbUser) {
                throw new Error("User not found");
            }

            const isValid = await bcrypt.compare(password, dbUser.password);
            if (!isValid) {
                throw new Error("Invalid password");
            }

            const token = jwt.sign({
                id: dbUser.id,
                username: dbUser.username
            }, JWT_SECRET_KEY);

            return ({
                id: dbUser.id,
                username: dbUser.username,
                token
            })
        },

        async createTask(_, { task }) {

            console.log('task', task);

            const schema = Joi.object({
                title: Joi.string().required(),
                description: Joi.string().optional(),
                dueDate: Joi.date().iso().optional(),
                status: Joi.string().valid("pending", "in-progress", "completed").required()
            });

            await schema.validateAsync(task);

            const { title, description, dueDate, status } = task;
            const [result] = await db.query("INSERT INTO tasks (title, description, dueDate, status) VALUES(?,?,?,?)", [title, description, dueDate, status]);
            return {
                id: result.insertId, ...task
            }
        },

        async updateTask(_, { id, task }) {
            const schema = Joi.object({
                title: Joi.string().required(),
                description: Joi.string().optional(),
                dueDate: Joi.date().iso().optional(),
                status: Joi.string().valid("pending", "in-progress", "completed").required()
            });

            await schema.validateAsync(task);

            const { title, description, dueDate, status } = task;
            await db.query("UPDATE tasks SET title = ?, description =?, dueDate = ?, status = ? WHERE id = ?", [title, description, dueDate, status, id]);

            return {
                id, ...task
            }
        },

        async deleteTask(_, { id }) {
            const [rows] = await db.query("SELECT * FROM tasks WHERE id = ?", [id]);
            const task = rows[0];
            if (!task) {
                throw new Error("Task not found");
            }

            await db.query("DELETE FROM tasks WHERE id = ?", [id]);
            return task
        }
    }
}

module.exports = resolver;