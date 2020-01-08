// const rp = require('request-promise');

const getvehicleDescription = require('../services/vehicles.js');

class VehicleController {
  /**
     * Class Constructor
     * @param logger - winston logger
     * @param vehicleService
     */
  constructor(logger, vehicleService) {
    this.logger = logger;
    this.vehicleService = vehicleService;
  }

  // eslint-disable-next-line consistent-return
  async getVehicleData(modelYear, manufacturer, model) {
    try {
      const data = await this.vehicleService.getvehicleDescription(modelYear, manufacturer, model);
      const { Results, Count } = data;
      if (Results.length === 0) {
        return {
          Results: [],
          Count: 0
        };
      }
      const resultsArray = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < Results.length; i++) {
        const body = {
          Description: Results[i].VehicleDescription,
          VehicleId: Results[i].VehicleId
        };
        resultsArray.push(body);
      }
      return {
        Results: resultsArray,
        Count
      };
    } catch (err) {
      this.logger.error('Unable to get data from the service', err);
    }
  }
}


module.exports = VehicleController;
