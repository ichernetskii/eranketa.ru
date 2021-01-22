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
            .notEmpty()
            .withMessage(() => config.form.error["phoneEmpty"][lang]),
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

            const {email, name, phone, additionalInfo} = req.body;
            const candidate = await Form.findOne({email});
            // already exists
            if (candidate) {
                return res
                    .status(config.form.error["emailExists"].status)
                    .json({
                        message: config.form.error["emailExists"][lang]
                    })
            }


            const form = new Form({ email, name, phone, additionalInfo });
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

module.exports = router;
