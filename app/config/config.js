require('dotenv').config();
const app_name = 'Test project MS';

require('dotenv').config();

const config = {
    app_name,
    url: {
        nhtsa: process.env.NHTSA_URL,
        crash_rating_url: process.env.NHTSA_CRASH_RATING_URL
    },
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      console: process.env.LOG_ENABLE_CONSOLE === 'true'
    }
}

module.exports = config;
