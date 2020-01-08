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

    async getVehicleRecords(req, res){
        const { modelYear, manufacturer, model } = req.params;
        const { withRating } = req.query
        if (withRating) {
            try {
                const data = await this.crashRatingControllers.getCrashRatingAndData(modelYear, manufacturer, model);

                // check if data is undefined
                if(data === undefined){
                    this.logger.error('Error from getting vehicle data');
                    const resp = new Response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal server error', res, true, []);
                    return resp.res_message();
                };

                if (data.Results.length === 0) {
                    this.logger.info('There is no vehicle data ');
                    const emptyResponse = new Response(HTTPStatus.NO_CONTENT, 'No content available', res, false, data);
                    return emptyResponse.res_message();
                }
                this.logger.info('Data gotten successfully');
                const resp = new Response(HTTPStatus.OK, 'Data gotten successfully', res, false, data);
                return resp.res_message();
            } catch (err){
                this.logger.error('Error from getting vehicle and crash data ', err);
                const resp = new Response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal server error', res, true, data = []);
                return resp.res_message();
            }
        }

        try {
            const data = await this.vehicleControllers.getVehicleData(modelYear, manufacturer, model);

            // Error checking if data is undefined
            if(data === undefined){
                this.logger.error('Error from getting vehicle data ',);
                const resp = new Response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal server error', res, true, []);
                return resp.res_message();
            };
            if (data.Results.length === 0) {
                this.logger.info('There is no vehicle data ');
                const emptyResponse = new Response(HTTPStatus.NO_CONTENT, 'No content available', res, false, data);
                return emptyResponse.res_message();
            };
            this.logger.info('vehicle data gotten successfully');
            const response = new Response(HTTPStatus.OK, 'Data gotten successfully', res, false, data);
            return response.res_message();
        } catch (err){
            this.logger.error('Error from getting vehicle data', err);
            const resp = new Response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal server error', res, true, []);
            return resp.res_message();
        }
    }

    async postVehicleData(req, res){
        const { modelYear, manufacturer, model } = req.body;

        try {
            const data = await this.vehicleControllers.getVehicleData(modelYear, manufacturer, model);
            if(data === undefined){
                this.logger.error('Error from getting vehicle data');
                const resp = new Response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal server error', res, true, []);
                return resp.res_message();
            };
            if (data.Results.length === 0) {
                this.logger.info('There is no vehicle data ', err);
                const emptyResponse = new Response(HTTPStatus.NO_CONTENT, 'No content available', res, false, data);
                return emptyResponse.res_message();
            };

            this.logger.info('vehicle data gotten successfully');
            const response = new Response(HTTPStatus.OK, 'Data gotten successfully', res, false, data);
            return response.res_message();
        } catch (err){
            this.logger.error('Error from getting vehicle data', err);
            const resp = new Response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal server error', res, true, []);
            return resp.res_message();
        };
    }

};

module.exports = MainController;