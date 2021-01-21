const path = require("path");

// EXPRESS
const express = require("express");
const app = express();
const helmet = require("helmet");

// CONFIG
process.env["NODE_CONFIG_DIR"] = path.resolve("server", "config");
const config = require("config");
let PORT;
try {
    PORT = config.get("port") || 5000;
} catch (e) {
    PORT = 5000;
}

app.use(express.json({ extended: true }));
app.use(helmet());

// ROUTES
app.use("/api/auth", require("./routes/auth.js"));

try {
    app.listen(PORT, () => {
        console.log("\x1b[32m\x1b[1m%s\x1b[0m", `Application started on port ${PORT}`);
    });
} catch (e) {

}
