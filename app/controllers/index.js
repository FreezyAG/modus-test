
// const bodyParser = require('body-parser');
// const getVehicleData = require('../controllers/vehicles.js');
// const getCrashRatingAndData = require('../controllers/crash_rating.js');
const Response = require('../response/response');
const HTTPStatus = require('../constants/http_status');


class MainController {
    /**
     * Class Constructor
     * @param logger - winston logger
     * @param vehicleControllers
     * @param crashRatingControllers
     */
    constructor(logger, vehicleControllers, crashRatingControllers) {
      this.logger = logger;
      this.vehicleControllers = vehicleControllers;
      this.crashRatingControllers = crashRatingControllers;
    };

    getVehicleRecords(req, res){
        const { modelYear, manufacturer, model } = req.params;
        const { withRating } = req.query
        if (withRating) {
            return this.crashRatingControllers.getCrashRatingAndData(modelYear, manufacturer, model)
                .then((data) => {
                    if (data.Results.length === 0) {
                        const emptyResponse = new Response(HTTPStatus.NO_CONTENT, 'No content available', res, false, data);
                        return emptyResponse.res_message();
                    }
                    const resp = new Response(HTTPStatus.OK, 'Data gotten successfully', res, false, data);
                    return resp.res_message();
                })
                .catch((err) => {
                    console.log('err from getting vehicle and crash data', err);
                });
        }
        return this.vehicleControllers.getVehicleData(modelYear, manufacturer, model)
            .then((data) => {
                if (data.Results.length === 0) {
                    const emptyResponse = new Response(HTTPStatus.NO_CONTENT, 'No content available', res, false, data);
                    return emptyResponse.res_message();
                }
                const response = new Response(HTTPStatus.OK, 'Data gotten successfully', res, false, data);
                return response.res_message();
            })
            .catch((err) => {
                console.log('err from getting vehicle data', err);
            })
    }

    postVehicleData(req, res){
        const { modelYear, manufacturer, model } = req.body;
        return this.vehicleControllers.getVehicleData(modelYear, manufacturer, model)
        .then((data) => {
            if (data.Results.length === 0) {
                const emptyResponse = new Response(HTTPStatus.NO_CONTENT, 'No content available', res, false, data);
                return emptyResponse.res_message();
            }
            const response = new Response(HTTPStatus.OK, 'Data gotten successfully', res, false, data);
            return response.res_message();
        });
    }

};

module.exports = MainController;