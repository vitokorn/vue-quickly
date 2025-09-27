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

db.users = require('./user.js')(sequelize, Sequelize.DataTypes);

db.Artist = require('./artist.js')(sequelize);
db.Label = require('./label.js')(sequelize);
db.Genre = require('./genre.js')(sequelize);
db.Album = require('./album.js')(sequelize);
db.Track = require('./track.js')(sequelize);
db.ArtistsLabels = require('./artists-labels.js')(sequelize);
db.LabelGenres = require('./label-genres.js')(sequelize);
db.TrackArtists = require('./track-artists.js')(sequelize);

// Associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
