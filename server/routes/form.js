const {Router} = require("express");
const router = Router();

const {body, validationResult} = require("express-validator");

// CONFIG
const cfg = require("config");
const config = {
    lang: cfg.has("lang") ? cfg.get("lang") : "ru",
    server: cfg.get("server"),
    user: cfg.get("user"),
    form: cfg.get("form")
}

// Model
const Form = require("../models/Form.js");
const User = require("../models/User.js");

// Middleware
const auth = require("../middleware/auth.middleware.js");

const {Schema} = require("mongoose");

let lang = "ru";

router.post(
    "/create",
    (req, res, next) => {
        lang = req.body.lang || config.lang || "ru";
        next();
    },
    [
        body("email")
            .isEmail()
            .withMessage(() => config.user.error["wrongFormat"][lang]),
        body("name")
            .notEmpty()
            .withMessage(() => config.form.error["nameEmpty"][lang]),
        body("phone")
            .custom((value, {req}) => {
                // +7 (921) 123-45-67
                return value.search(/^(\+?7|8)?\s?\(?9\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/) !== -1;
            })
            .withMessage(() => config.form.error["phoneErrorFormat"][lang]),
        body("birthDate")
            .notEmpty()
            .withMessage(() => config.form.error["birthDateEmpty"][lang]),
        body("birthDate")
            .custom((value, { req }) => {
                const now = new Date();
                return now.getTime() - new Date(value).getTime() >= 16*365.25*24*3600*1000;
            })
            .withMessage(() => config.form.error["birthDateMinimum"][lang]),
        body("social")
            .isURL({host_whitelist: ["vk.com"]})
            .withMessage(() => config.form.error["socialError"][lang]),
        body("job")
            .notEmpty()
            .withMessage(() => config.form.error["jobEmpty"][lang]),
        body("position")
            .notEmpty()
            .withMessage(() => config.form.error["positionEmpty"][lang]),
        body("goal")
            .notEmpty()
            .withMessage(() => config.form.error["goalEmpty"][lang]),
    ],
    async (req, res) => {
        try {
            // Server validation
            const errors = validationResult(req);
            // check data errors
            if (!errors.isEmpty()) {
                return res
                    .status(config.form.error["create"].status)
                    .json({
                        errors: errors.array(),
                        message: config.form.error["create"][lang]
                    });
            }

            const {email, name, phone, birthDate, additionalInfo, social, job, position, goal} = req.body;
            const candidate = await Form.findOne({email});
            // already exists
            if (candidate) {
                return res
                    .status(config.form.error["emailExists"].status)
                    .json({
                        errors: [{
                            msg: config.form.error["emailExists"][lang],
                            param: "email"
                        }]
                    })
            }

            const form = new Form({ email, name, phone, birthDate, additionalInfo, social, job, position, goal });
            await form.save();

            res
                .status(config.form.message["create"].status)
                .json({message: config.form.message["create"][lang]});
        } catch (e) {
            res
                .status(config.server.error["abstract"].status)
                .json({message: config.server.error["abstract"][lang]});
        }
    }
);

router.get("/",
    (req, res, next) => {
        lang = req.query.lang || config.lang || "ru";
        req.lang = lang;
        next();
    },
    auth,
    async (req, res) => {
        try {
            const { skip, limit = 10, sort } = req.query;

            if (req.user.rights.findIndex(r => r === "canView") === -1) {
                return res
                    .status(config.user.error["noRights"].status)
                    .json({ message: config.user.error["noRights"][req.lang]} )
            }

            const findOptions = {};
            if (skip) findOptions.skip = +skip;
            if (limit) findOptions.limit = Math.min(+limit, 50);
            if (sort) findOptions.sort = sort;

            const forms = await Form.find(null, null, findOptions);

            res.json({forms});
        } catch (e) {
            res
                .status(config.server.error["abstract"].status)
                .json({message: config.server.error["abstract"][lang]});
        }
    }
)

router.get("/count",
    (req, res, next) => {
        lang = req.query.lang || config.lang || "ru";
        req.lang = lang;
        next();
    },
    auth,
    async (req, res) => {
        try {
            const { skip, limit = 10, sort } = req.query;

            if (req.user.rights.findIndex(r => r === "canView") === -1) {
                return res
                    .status(config.user.error["noRights"].status)
                    .json({ message: config.user.error["noRights"][req.lang]} )
            }

            const count = await Form.countDocuments();
            res.json({count});
        } catch (e) {
            res
                .status(config.server.error["abstract"].status)
                .json({message: config.server.error["abstract"][lang]});
        }
    }
)

router.put("/",
    (req, res, next) => {
        lang = req.body.lang || config.lang || "ru";
        req.lang = lang;
        next();
    },
    [
        body("email")
            .optional({nullable: true})
            .isEmail()
            .withMessage(() => config.user.error["wrongFormat"][lang]),
        body("name")
            .optional({nullable: true})
            .notEmpty()
            .withMessage(() => config.form.error["nameEmpty"][lang]),
        body("phone")
            .optional({nullable: true})
            .custom((value, {req}) => {
                // +7 (921) 123-45-67
                return value.search(/^(\+?7|8)?\s?\(?9\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/) !== -1;
            })
            .withMessage(() => config.form.error["phoneErrorFormat"][lang]),
        body("birthDate")
            .optional({nullable: true})
            .notEmpty()
            .withMessage(() => config.form.error["birthDateEmpty"][lang]),
        body("birthDate")
            .custom((value, { req }) => {
                if (value) {
                    const now = new Date();
                    return now.getTime() - new Date(value).getTime() >= 16 * 365.25 * 24 * 3600 * 1000;
                } else return true;
            })
            .withMessage(() => config.form.error["birthDateMinimum"][lang]),
        body("social")
            .optional({nullable: true})
            .isURL({host_whitelist: ["vk.com"]})
            .withMessage(() => config.form.error["socialError"][lang]),
        body("job")
            .optional({nullable: true})
            .notEmpty()
            .withMessage(() => config.form.error["jobEmpty"][lang]),
        body("position")
            .optional({nullable: true})
            .notEmpty()
            .withMessage(() => config.form.error["positionEmpty"][lang]),
        body("goal")
            .optional({nullable: true})
            .notEmpty()
            .withMessage(() => config.form.error["goalEmpty"][lang]),
    ],
    auth,
    async (req, res) => {
        try {
            // Server validation
            const errors = validationResult(req);
            // check data errors
            if (!errors.isEmpty()) {
                return res
                    .status(config.form.error["create"].status)
                    .json({
                        errors: errors.array(),
                        message: config.form.error["create"][lang]
                    });
            }

            const candidate = await Form.findOne({email: req.body.email});
            // already exists
            if (candidate && (req.body.id !== candidate.id)) {
                return res
                    .status(config.form.error["emailExists"].status)
                    .json({
                        errors: [{
                            msg: config.form.error["emailExists"][lang],
                            param: "email"
                        }]
                    })
            }

            if (req.user.rights.findIndex(r => r === "canEdit") === -1) {
                return res
                    .status(config.user.error["noRights"].status)
                    .json({ message: config.user.error["noRights"][req.lang]} )
            }

            await Form.findByIdAndUpdate(req.body.id, { $set: req.body })

            res.status(config.form.message["update"].status)
                .json({ message: config.form.message["update"][req.lang] })
        } catch (e) {
            res
                .status(config.server.error["abstract"].status)
                .json({message: config.server.error["abstract"][lang]});
        }
    }
)

router.delete("/",
    (req, res, next) => {
        lang = req.body.lang || config.lang || "ru";
        req.lang = lang;
        next();
    },
    auth,
    async (req, res) => {
        try {
            if (req.user.rights.findIndex(r => r === "canEdit") === -1) {
                return res
                    .status(config.user.error["noRights"].status)
                    .json({ message: config.user.error["noRights"][req.lang]} )
            }

            await Form.findByIdAndDelete(req.body.id);

            res.status(config.form.message["delete"].status)
                .json({ message: config.form.message["delete"][req.lang] })
        } catch (e) {
            res
                .status(config.server.error["abstract"].status)
                .json({message: config.server.error["abstract"][lang]});
        }
    }
)

module.exports = router;
