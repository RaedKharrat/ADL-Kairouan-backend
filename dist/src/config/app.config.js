"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
    frontendUrl: process.env.FRONTEND_URL || 'https://adl-kairouan.vercel.app',
    apiUrl: process.env.API_URL || 'https://adl-kairouan-backend.onrender.com',
}));
//# sourceMappingURL=app.config.js.map