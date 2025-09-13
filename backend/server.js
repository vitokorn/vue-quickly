require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const path = __dirname + '/../public/'

var corsOptions = {
    origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// API routes first
require("./routers/spotify.router.js")(app);
require("./routers/lastfm.router.js")(app);

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to DM." });
});

// Serve static files after API routes
app.use(express.static(path));

// Catch all handler: send back index.html for client-side routing (only for non-API routes)
app.get('*', (req, res) => {
    // Only handle non-API routes
    if (!req.path.startsWith('/spotify') &&
        !req.path.startsWith('/lastfm') &&
        !req.path.startsWith('/deezer')) {
        res.sendFile(path + '/index.html');
    } else {
        res.status(404).json({ error: 'API endpoint not found' });
    }
});
// set port, listen for requests
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

const db = require("./models");
db.sequelize.sync();
