const path = require("path");

const {Router} = require("express");
const router = Router();

const config = require("config");
const lang = config.get("lang");
const network = config.get("network");
const user = config.get("user");

router.post("/register", async (req, res) => {
    try {
        res
            .status(user.message.create.status)
            .json({message: user.message.create[lang]});
    } catch (e) {
        res
            .status(network.error.abstract.status)
            .json({message: network.error.abstract[lang]});
    }
});

module.exports = router;
