const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        if (req === "OPTIONS") return next();

        const token = req.headers?.authorization?.split(" ")[1]; // BEARER [Token]

        if (!token) throw new Error();
        const user = jwt.verify(token, req.config.jwtSecret);
        req.user = user;

        next();
    } catch(e) {
        res
            .status(req.config.user.error["login"].status)
            .json({ message: req.config.user.error["login"][req.config.lang] });
    }
}
