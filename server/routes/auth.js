const {Router} = require("express");
const router = Router();

const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// CONFIG
const cfg = require("config");
const config = {
    lang: cfg.has("lang") ? cfg.get("lang") : "ru",
    server: cfg.get("server"),
    user: cfg.get("user"),
    jwtSecret: cfg.get("jwtSecret")
}

// Model
const User = require("../models/User.js");

let lang = "ru";

router.post(
    "/register",
    (req, res, next) => {
        lang = req.body.lang || config.lang || "ru";
        next();
    },
    [
        body("email")
            .isEmail()
            .withMessage(() => config.user.error["wrongFormat"][lang]),
        body("password")
            .isLength({min: 6})
            .withMessage(() => config.user.error["passwordLength"][lang])
    ],
    async (req, res) => {
        try {
            // Server validation
            const errors = validationResult(req);
            // check data errors
            if (!errors.isEmpty()) {
                return res
                    .status(config.user.error["registration"].status)
                    .json({
                        errors: errors.array(),
                        message: config.user.error["registration"][lang]
                    });
            }

            const {email, password} = req.body;
            const candidate = await User.findOne({email});
            // already exists
            if (candidate) {
                return res
                    .status(config.user.error["exists"].status)
                    .json(
                        {
                            errors: [{
                                msg: config.user.error["exists"][lang],
                                param: "email"
                            }]
                        })
            }

            const passwordHash = await bcrypt.hash(password, 12);
            // password hashing
            const user = new User({ email, password: passwordHash, rights: [] });
            await user.save();

            res
                .status(config.user.message["create"].status)
                .json({message: config.user.message["create"][lang]});
        } catch (e) {
            res
                .status(config.server.error["abstract"].status)
                .json({message: config.server.error["abstract"][lang]});
        }
    }
);

router.post(
    "/login",
    (req, res, next) => {
        lang = req.body.lang || config.lang || "ru";
        next();
    },
    [
        body("email")
            .isEmail()
            .withMessage(() => config.user.error["wrongFormat"][lang]),
        body("password")
            .exists()
            .notEmpty()
            .withMessage(() => config.user.error["passwordExists"][lang])
    ],
    async (req, res) => {
        try {
            // Server validation
            const errors = validationResult(req);
            // check data errors
            if (!errors.isEmpty()) {
                return res
                    .status(config.user.error["login"].status)
                    .json({
                        errors: errors.array(),
                        message: config.user.error["login"][lang]
                    });
            }

            const {email, password} = req.body;
            const user = await User.findOne({email});

            if (!user) {
                return res
                    .status(config.user.error["notFound"].status)
                    .json({
                        errors: [{
                            msg: config.user.error["notFound"][lang],
                            param: "email"
                        }]
                    });
            }

            const isMatch = await bcrypt.compare(password, user?.password);

            if (!isMatch) {
                return res
                    .status(config.user.error["notMatch"].status)
                    .json({
                        errors: [{
                            msg: config.user.error["notMatch"][lang],
                            param: "password"
                        }]
                    })
            }

            // generate JWT
            const token = jwt.sign(
                { userId: user?.id, rights: user?.rights, email: user?.email },
                config.jwtSecret,
                { expiresIn: "1y" }
            );

            res
                .status(200)
                .json({ token })
        } catch (e) {
            console.log(e);
            res
                .status(config.server.error["abstract"].status)
                .json({message: config.server.error["abstract"][lang]});
        }
    }
);

module.exports = router;
