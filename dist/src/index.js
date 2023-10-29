"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("./modules/driver/router"));
(0, dotenv_1.config)();
exports.app = (0, express_1.default)();
const port = process.env.PORT || 3000;
exports.app.use(express_1.default.json());
exports.app.use((req, res, next) => {
    if (process.env.ENV !== 'testing') {
        console.log(`API called: [${req.method}] ${req.originalUrl}`);
    }
    next();
});
exports.app.use('/api/drivers', router_1.default);
exports.app.get('/', (req, res) => {
    res.send('Hello, TypeScript Express!');
});
exports.server = exports.app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
process.on('SIGINT', () => {
    exports.server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});
