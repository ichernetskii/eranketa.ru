const path = require("path");

// EXPRESS
const express = require("express");
const app = express();
const helmet = require("helmet");

const mongoose = require("mongoose");

// CONFIG
process.env["NODE_CONFIG_DIR"] = path.resolve("server", "config");
const cfg = require("config");
const config = {
    mongoUri: cfg.get("mongoUri"),
    server: cfg.get("server"),
    lang: cfg.has("lang") ? cfg.get("lang") : "ru",
    port: cfg.has("port") ? cfg.get("port") : 5000
}

app.use(express.json({ extended: true }));
app.use(helmet());

// ROUTES
app.use("/api/auth", require("./routes/auth.js"));
app.use("/api/form", require("./routes/form.js"));

async function start() {
    try {
        // MONGOOSE
        await mongoose.connect(config.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        // LISTEN
        app.listen(config.port, () => {
            console.log("\x1b[32m\x1b[1m%s\x1b[0m", `Application started on port ${config.port}`);
        })
    } catch (e) {
        console.error(config.server.error["abstract"][config.lang], e.message);
        process.exit(1);
    }
}
start();
