const {body} = require("express-validator");

module.exports = allowNullabe => [
    body("email")
        .optional({nullable: allowNullabe})
        .isEmail()
        .withMessage((value, {req}) => req.config.user.error["wrongFormat"][req.config.lang]),
    body("name")
        .optional({nullable: allowNullabe})
        .notEmpty()
        .withMessage((value, {req}) => req.config.form.error["nameEmpty"][req.config.lang]),
    body("phone")
        .optional({nullable: allowNullabe})
        .custom((value) => {
            // +7 (921) 123-45-67
            return value.search(/^(\+?7|8)?\s?\(?9\d{2}\)?\s?\d{3}-?\d{2}-?\d{2}$/) !== -1;
        })
        .withMessage((value, {req}) => req.config.form.error["phoneErrorFormat"][req.config.lang]),
    body("birthDate")
        .optional({nullable: allowNullabe})
        .notEmpty()
        .withMessage((value, {req}) => req.config.form.error["birthDateEmpty"][req.config.lang]),
    body("birthDate")
        .custom((value) => {
            if (value) {
                return Date.now() - new Date(value).getTime() >= 16 * 365.25 * 24 * 3600 * 1000;
            } else return true;
        })
        .withMessage((value, {req}) => req.config.form.error["birthDateMinimum"][req.config.lang]),
    body("social")
        .optional({nullable: allowNullabe})
        .isURL({host_whitelist: ["vk.com"]})
        .isLength({min: 18}) // https://vk.com/id1
        .withMessage((value, {req}) => req.config.form.error["socialError"][req.config.lang]),
    body("job")
        .optional({nullable: allowNullabe})
        .notEmpty()
        .withMessage((value, {req}) => req.config.form.error["jobEmpty"][req.config.lang]),
    body("position")
        .optional({nullable: allowNullabe})
        .notEmpty()
        .withMessage((value, {req}) => req.config.form.error["positionEmpty"][req.config.lang]),
    body("goal")
        .optional({nullable: allowNullabe})
        .notEmpty()
        .withMessage((value, {req}) => req.config.form.error["goalEmpty"][req.config.lang]),
]
