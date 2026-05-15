"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonConfig = void 0;
const winston = require("winston");
const { combine, timestamp, errors, json, colorize, simple } = winston.format;
exports.winstonConfig = {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), json()),
    transports: [
        new winston.transports.Console({
            format: process.env.NODE_ENV !== 'production'
                ? combine(colorize(), simple())
                : combine(json()),
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5,
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 10,
        }),
    ],
};
//# sourceMappingURL=winston.config.js.map