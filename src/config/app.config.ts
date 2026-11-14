import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '4000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'https://adltunisie.org',
  apiUrl: process.env.API_URL || 'https://adl-kairouan-backend.onrender.com',
}));
