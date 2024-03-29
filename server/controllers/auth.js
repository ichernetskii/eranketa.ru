const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {validationResult} = require("express-validator");

// Model
const User = require("../models/User.js");

const login = async (req, res) => {
    try {
        // Server validation
        const errors = validationResult(req);
        // check data errors
        if (!errors.isEmpty()) {
            return res
                .status(req.config.user.error["login"].status)
                .json({
                    errors: errors.array(),
                    message: req.config.user.error["login"][req.config.lang]
                });
        }

        const {email, password} = req.body;
        const user = await User.findOne({email});

        if (!user) {
            return res
                .status(req.config.user.error["notFound"].status)
                .json({
                    errors: [{
                        msg: req.config.user.error["notFound"][req.config.lang],
                        param: "email"
                    }]
                });
        }

        const isMatch = await bcrypt.compare(password, user?.password);

        if (!isMatch) {
            return res
                .status(req.config.user.error["notMatch"].status)
                .json({
                    errors: [{
                        msg: req.config.user.error["notMatch"][req.config.lang],
                        param: "password"
                    }]
                })
        }

        // generate JWT
        const token = jwt.sign(
            { userId: user?.id, rights: user?.rights, email: user?.email },
            req.config.jwtSecret,
            { expiresIn: "1y" }
        );

        res
            .status(200)
            .json({ token })
    } catch (e) {
        res
            .status(req.config.server.error["abstract"].status)
            .json({message: req.config.server.error["abstract"][req.config.lang]});
    }
}

const register = async (req, res) => {
    try {
        // Server validation
        const errors = validationResult(req);
        // check data errors
        if (!errors.isEmpty()) {
            return res
                .status(req.config.user.error["registration"].status)
                .json({
                    errors: errors.array(),
                    message: req.config.user.error["registration"][req.config.lang]
                });
        }

        const {email, password} = req.body;
        const candidate = await User.findOne({email});
        // already exists
        if (candidate) {
            return res
                .status(req.config.user.error["exists"].status)
                .json(
                    {
                        errors: [{
                            msg: req.config.user.error["exists"][req.config.lang],
                            param: "email"
                        }]
                    })
        }

        const passwordHash = await bcrypt.hash(password, 12);
        // password hashing
        const user = new User({ email, password: passwordHash, rights: ["canView"] });
        await user.save();

        res
            .status(req.config.user.message["create"].status)
            .json({message: req.config.user.message["create"][req.config.lang]});
    } catch (e) {
        res
            .status(req.config.server.error["abstract"].status)
            .json({message: req.config.server.error["abstract"][req.config.lang]});
    }
}

module.exports = { register, login }
