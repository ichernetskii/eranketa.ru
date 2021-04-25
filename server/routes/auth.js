const {Router} = require("express");
const router = Router();

const {body} = require("express-validator");

// Controllers
const {login, register} = require("../controllers/auth.js");

// Middleware
const config = require("../middleware/config.middleware.js");
router.use(config);

router.post(
    "/register",
    [
        body("email")
            .isEmail()
            .withMessage((value, {req}) => req.config.user.error["wrongFormat"][req.config.lang]),
        body("password")
            .isLength({min: 6})
            .withMessage((value, {req}) => req.config.user.error["passwordLength"][req.config.lang])
    ],
    register
);

router.post(
    "/login",
    [
        body("email")
            .isEmail()
            .withMessage((value, {req}) => req.config.user.error["wrongFormat"][req.config.lang]),
        body("password")
            .exists()
            .notEmpty()
            .withMessage((value, {req}) => req.config.user.error["passwordExists"][req.config.lang])
    ],
    login
);

module.exports = router;
