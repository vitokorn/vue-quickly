// const dbConfig = require("../db.config.js");

const Sequelize = require("sequelize");
let config = {
    host: process.env.host,
    dialect: "postgres",
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
if (process.env.ssl === "true") {
    config.dialectOptions = {
        ssl: {
            require: true,
                rejectUnauthorized: false
        }}
}
const sequelize = new Sequelize(process.env.db, process.env.user, process.env.password,config)
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);

module.exports = db;
