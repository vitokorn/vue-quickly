module.exports = {
    user: "root",
    password: null,
    db: "database_development",
    host: "127.0.0.1",
    dialect: "postgres",
    ssl: true,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};