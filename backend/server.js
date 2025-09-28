require("dotenv").config();
const path = require("path"); // правильное подключение модуля
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:8081", "http://localhost:3000"]
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// API routes first
require("./routers/spotify.router.js")(app);
require("./routers/lastfm.router.js")(app);
require("./routers/apple.router.js")(app);
require("./routers/deezer.router.js")(app);
require("./routers/tidal.router.js")(app);
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// Initialize BullMQ queues and workers
const { queues, redisConnection } = require('./queues');
console.log('BullMQ queues and workers initialized');

// Graceful shutdown handling
process.on('SIGTERM', async () => {
    console.log('Shutting down gracefully...');
    await redisConnection.quit();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await redisConnection.quit();
    process.exit(0);
});

app.get("*", (req, res) => {
    if (!req.path.startsWith("/spotify") &&
        !req.path.startsWith("/lastfm") &&
        !req.path.startsWith("/deezer") &&
        !req.path.startsWith("/apple") &&
        !req.path.startsWith("/tidal")) {
        res.sendFile(path.join(publicPath, "index.html"));
    } else {
        res.status(404).json({ error: "API endpoint not found" });
    }
});
// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
db.sequelize.sync();
