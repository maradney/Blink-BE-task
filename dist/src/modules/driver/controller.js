"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const express_validator_1 = require("express-validator");
const queryBuilder_1 = __importDefault(require("../../utils/queryBuilder"));
const drivers = async (req, res) => {
    const db = new queryBuilder_1.default('drivers');
    const drivers = await db.select();
    return res.json({
        drivers: drivers,
    });
};
const driver = async (req, res) => {
    const db = new queryBuilder_1.default('drivers');
    const drivers = await db.where([['id', '=', req.params.id]]).select();
    return res.json({
        driver: drivers && drivers.length > 0 ? drivers[0] : null,
    });
};
const create = async (req, res) => {
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(400).json((0, express_validator_1.validationResult)(req).formatWith((error) => {
            return error.msg;
        }));
    }
    const db = new queryBuilder_1.default('drivers');
    await db.insert(['firstName', 'lastName', 'email', 'phoneNumber'], [[req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber]]);
    res.json({
        message: 'success',
    });
};
const update = async (req, res) => {
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(400).json((0, express_validator_1.validationResult)(req).formatWith((error) => {
            return error.msg;
        }));
    }
    if (Object.keys(req.body).length > 0) {
        const db = new queryBuilder_1.default('drivers');
        await db.where([['id', '=', req.params.id]]).update(req.body);
    }
    res.json({
        message: 'success',
    });
};
const deleteOne = async (req, res) => {
    const validation = (0, express_validator_1.validationResult)(req);
    if (!validation.isEmpty()) {
        return res.status(400).json((0, express_validator_1.validationResult)(req).formatWith((error) => {
            return error.msg;
        }));
    }
    const db = new queryBuilder_1.default('drivers');
    await db.where([['id', '=', req.params.id]]).delete();
    res.json({
        message: 'success',
    });
};
exports.controller = {
    driver,
    drivers,
    create,
    update,
    deleteOne,
};
