"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIntercepter = void 0;
const requestIntercepter = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} ${JSON.stringify(req.body)}`);
    next();
};
exports.requestIntercepter = requestIntercepter;
