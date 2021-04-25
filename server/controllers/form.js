const {validationResult} = require("express-validator");
const Form = require("../models/Form.js");

const create = async (req, res) => {
    try {
        // Server validation
        const errors = validationResult(req);
        // check data errors
        if (!errors.isEmpty()) {
            return res
                .status(req.config.form.error["create"].status)
                .json({
                    errors: errors.array(),
                    message: req.config.form.error["create"][req.config.lang]
                });
        }

        const {email, name, phone, birthDate, additionalInfo, social, job, position, goal} = req.body;
        const candidate = await Form.findOne({email});
        // already exists
        if (candidate) {
            return res
                .status(req.config.form.error["emailExists"].status)
                .json({
                    errors: [{
                        msg: req.config.form.error["emailExists"][req.config.lang],
                        param: "email"
                    }]
                })
        }

        const form = new Form({ email, name, phone, birthDate, additionalInfo, social, job, position, goal });
        await form.save();

        res
            .status(req.config.form.message["create"].status)
            .json({message: req.config.form.message["create"][req.config.lang]});
    } catch (e) {
        res
            .status(req.config.server.error["abstract"].status)
            .json({message: req.config.server.error["abstract"][req.config.lang]});
    }
}

const get = async (req, res) => {
    try {
        const { skip, limit = 10, sort } = req.query;

        if (req.user.rights.findIndex(r => r === "canView") === -1) {
            return res
                .status(req.config.user.error["noRights"].status)
                .json({ message: req.config.user.error["noRights"][req.config.lang]} )
        }

        const findOptions = {};
        if (skip) findOptions.skip = +skip;
        if (limit) findOptions.limit = Math.min(+limit, 50);
        if (sort) findOptions.sort = sort;

        const forms = await Form.find(null, null, findOptions);

        res.json({forms});
    } catch (e) {
        res
            .status(req.config.server.error["abstract"].status)
            .json({message: req.config.server.error["abstract"][req.config.lang]});
    }
}

const getCount = async (req, res) => {
    try {
        const { skip, limit = 10, sort } = req.query;

        if (req.user.rights.findIndex(r => r === "canView") === -1) {
            return res
                .status(req.config.user.error["noRights"].status)
                .json({ message: req.config.user.error["noRights"][req.config.lang]} )
        }

        const count = await Form.countDocuments();
        res.json({count});
    } catch (e) {
        res
            .status(req.config.server.error["abstract"].status)
            .json({message: req.config.server.error["abstract"][req.config.lang]});
    }
}

const update = async (req, res) => {
    try {
        // Server validation
        const errors = validationResult(req);
        // check data errors
        if (!errors.isEmpty()) {
            return res
                .status(req.config.form.error["create"].status)
                .json({
                    errors: errors.array(),
                    message: req.config.form.error["create"][req.config.lang]
                });
        }

        const candidate = await Form.findOne({email: req.body.email});
        // already exists
        if (candidate && (req.body.id !== candidate.id)) {
            return res
                .status(req.config.form.error["emailExists"].status)
                .json({
                    errors: [{
                        msg: req.config.form.error["emailExists"][req.config.lang],
                        param: "email"
                    }]
                })
        }

        if (req.user.rights.findIndex(r => r === "canEdit") === -1) {
            return res
                .status(req.config.user.error["noRights"].status)
                .json({ message: req.config.user.error["noRights"][req.config.lang]} )
        }

        await Form.findByIdAndUpdate(req.body.id, { $set: req.body })

        res.status(req.config.form.message["update"].status)
            .json({ message: req.config.form.message["update"][req.config.lang] })
    } catch (e) {
        res
            .status(req.config.server.error["abstract"].status)
            .json({message: req.config.server.error["abstract"][req.config.lang]});
    }
}

const erase = async (req, res) => {
    try {
        if (req.user.rights.findIndex(r => r === "canEdit") === -1) {
            return res
                .status(req.config.user.error["noRights"].status)
                .json({ message: req.config.user.error["noRights"][req.config.lang]} )
        }

        await Form.findByIdAndDelete(req.body.id);

        res.status(req.config.form.message["delete"].status)
            .json({ message: req.config.form.message["delete"][req.config.lang] })
    } catch (e) {
        res
            .status(req.config.server.error["abstract"].status)
            .json({message: req.config.server.error["abstract"][req.config.lang]});
    }
}

module.exports = {
    create, get, getCount, update, erase
}
