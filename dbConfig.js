// require ENV variables
require("dotenv").config();

const { Pool } = require("pg");

// is our app hosted in production
const isProduction = process.env.NODE_ENV === "production";

// establish connection to database via the .ENV variables
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction
        ? process.env.DATABASE_URL
        : connectionString,
});

module.exports = { pool };
