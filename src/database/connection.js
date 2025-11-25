// database/connection.js
const { Pool } = require('pg')
const config = require('../config')

const pool = new Pool({
    user: config.db.user,
    password: config.db.password,
    host: config.db.host,
    database: config.db.database,
    port: config.db.port,
    ssl: { rejectUnauthorized: false },
    max: 5 // penting untuk Supabase!
});


pool.connect()
    .then(() => console.log("Connected to Supabase PostgreSQL"))
    .catch(err => console.error("Database connection failed", err))

module.exports = pool