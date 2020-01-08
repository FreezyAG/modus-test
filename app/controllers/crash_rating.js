
const getCrashRating = require('../services/crash_rating');
const getvehicleDescription = require('../services/vehicles.js');

class CrashRatingController {
    /**
     * Class Constructor
     * @param logger - winston logger
     * @param vehicleService
     * @param crashRatingService
     */
    constructor(logger, vehicleService, crashRatingService) {
      this.logger = logger;
      this.vehicleService = vehicleService;
      this.crashRatingService = crashRatingService;
    }

    getCrashRatingAndData (modelYear, manufacturer, model) {
        return this.vehicleService.getvehicleDescription(modelYear, manufacturer, model)
            .then((data) => {
                const { Results, Count } = data;
                return getDataAndLoop(Results, Count);
            });
    }

    async getDataAndLoop(Results, Count) {
        if ( Results.length === 0) {
            return {
                Results: [],
                Count: 0
            };
        }
        let resultArray = [];
        let vehicleId = '';
        let dataObj = {};
        for (let i = 0; i < Results.length; i++) {
            vehicleId = Results[i].VehicleId
            await this.crashRatingService.getCrashRating(vehicleId)
                .then((res) => {
                    const rating = res.Results[0].OverallRating;
                    dataObj = {
                        CrashRating: rating,
                        Description: Results[i].VehicleDescription,
                        VehicleId: Results[i].VehicleId
                    }
                    resultArray.push(dataObj);
                })
        }
        return {
            Results: resultArray,
            Count
        };
    }
}

module.exports = CrashRatingController;
