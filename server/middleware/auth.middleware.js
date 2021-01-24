const jwt = require("jsonwebtoken");
const cfg = require("config");

const config = {
    lang: cfg.has("lang") ? cfg.get("lang") : "ru",
    user: cfg.get("user"),
    jwtSecret: cfg.get("jwtSecret")
}

module.exports = (req, res, next) => {
    try {
        if (req === "OPTIONS") return next();

        config.lang = req.lang || config.lang;
        const token = req.headers?.authorization?.split(" ")[1]; // BEARER [Token]

        if (!token) throw new Error();
        const user = jwt.verify(token, config.jwtSecret);
        req.user = user;

        next();
    } catch(e) {
        res
            .status(config.user.error["login"].status)
            .json({ message: config.user.error["login"][config.lang] });
    }
}
