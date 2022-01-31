"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = require("knex");
require('dotenv').config();
const config = {
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: Number(process.env.DB_PORT),
        ssl: { rejectUnauthorized: false },
    },
};
const knexInstance = (0, knex_1.knex)(config);
exports.default = knexInstance;
