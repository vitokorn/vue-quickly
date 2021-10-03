const dbConfig = require("../db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize("d3h0qdnv96tsra", "pjisvdjipewfdu","0ad2bb2996624383817b2c4ceb8eb2d8bbe3b80fe1863f6d5b57092ff17d9703", {
    host: "ec2-63-32-7-190.eu-west-1.compute.amazonaws.com",
    dialect:  "postgres",
    dialectOptions: {
        "ssl": {
            "require": true,
            "rejectUnauthorized": false
        }
    },
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.js")(sequelize, Sequelize);
db.playlists = require("./playlist.js")(sequelize, Sequelize);

module.exports = db;