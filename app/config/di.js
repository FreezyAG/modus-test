const serviceLocator = require('../lib/service_locator');
const winston = require('winston');
require('winston-daily-rotate-file');

// Controllers

const MainController = require('../controllers/index');
const CrashRatingController = require('../controllers/crash_rating');
const VehicleController = require('../controllers/vehicles');

// Services
const CrashRatingServices = require('../services/crash_rating');
const VehicleServices = require('../services/vehicles');

/**
 * Returns an instance of logger
 */
serviceLocator.register('logger', () => {

  const logger =  winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
      ),
  
    defaultMeta: {service: 'modus-test'},
    transports: [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/info.log', level: 'info' })
    
    ]
  })
  
  if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
      
    }));
  }
  return logger;
});

/**
 * Creates an instance of the Crash Rating Service
 */
serviceLocator.register('crashRatingService', (servicelocator) => {
  const logger = servicelocator.get('logger');;
  return new CrashRatingServices(logger);
});

/**
 * Creates an instance of the Vehicle Service
 */
serviceLocator.register('vehicleService', (servicelocator) => {
  const logger = servicelocator.get('logger');;
  return new VehicleServices(logger);
});


/**
 * Creates an instance of the Main Controller
 */
serviceLocator.register('mainController', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const vehicleControllers = servicelocator.get('vehicleControllers');
  const crashRatingControllers = servicelocator.get('crashRatingControllers');
  return new MainController(logger, vehicleControllers, crashRatingControllers);
});

/**
 * Creates an instance of the Crash Rating Controller
 */
serviceLocator.register('crashRatingControllers', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const vehicleService = servicelocator.get('vehicleService');
  const crashRatingService = servicelocator.get('crashRatingService');
  return new CrashRatingController(logger, vehicleService, crashRatingService);
});


/**
 * Creates an instance of the Vehicle Controller
 */
serviceLocator.register('vehicleControllers', (servicelocator) => {
  const logger = servicelocator.get('logger');
  const vehicleService = servicelocator.get('vehicleService');
  return new VehicleController(logger, vehicleService);
});

module.exports = serviceLocator;
