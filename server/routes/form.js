const {Router} = require("express");
const router = Router();

// Middleware
const config = require("../middleware/config.middleware.js");
router.use(config);
const auth = require("../middleware/auth.middleware.js");
const checkErrors = require("../middleware/checkErrors.middleware.js");

// Controllers
const {create, get, update, erase, getCount} = require("../controllers/form.js");

router.post(
    "/create",
    checkErrors(false),
    create
);

router.get("/",
    auth,
    get
)

router.get("/count",
    auth,
    getCount
)

router.put("/",
    checkErrors(true),
    auth,
    update
)

router.delete("/",
    auth,
    erase
)

module.exports = router;
