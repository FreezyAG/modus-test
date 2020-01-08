require('dotenv').config();

// eslint-disable-next-line camelcase
const app_name = 'Test project MS';

const config = {
  app_name,
  port: process.env.PORT,
  url: {
    nhtsa: process.env.NHTSA_URL,
    crash_rating_url: process.env.NHTSA_CRASH_RATING_URL
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    console: process.env.LOG_ENABLE_CONSOLE === 'true'
  }
};

module.exports = config;
