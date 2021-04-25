const cfg = require("config");

const config = {
    lang: cfg.has("lang") ? cfg.get("lang") : "ru",
    server: cfg.get("server"),
    user: cfg.get("user"),
    jwtSecret: cfg.get("jwtSecret"),
    form: cfg.get("form")
}

module.exports = (req, res, next) => {
    req.config = {
        ...config,
        lang: req.body?.lang ?? config?.lang ?? "ru"
    };
    next();
}
