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
  }

  async getVehicleRecords(req, res) {
    const { modelYear, manufacturer, model } = req.params;
    // check if required parameters are passed
    if (modelYear === 'undefined' || manufacturer === 'undefined' || model === 'undefined') {
      return this.handleBadRequest(res);
    }
    const { withRating } = req.query;
    if (withRating === 'true') {
      try {
        // eslint-disable-next-line max-len
        const data = await this.crashRatingControllers.getCrashRatingAndData(modelYear, manufacturer, model);

        // check if data is undefined
        if (data === undefined) {
          return this.handleInternalServerError(res, data);
        }

        if (data.Results.length === 0) {
          return this.handleNoContent(res, data);
        }
        return this.handleOk(res, data);
      } catch (err) {
        return this.handleInternalServerError(res, err);
      }
    }

    try {
      const data = await this.vehicleControllers.getVehicleData(modelYear, manufacturer, model);

      // Error checking if data is undefined
      if (data === undefined) {
        return this.handleInternalServerError(res, data);
      }
      if (data.Results.length === 0) {
        return this.handleNoContent(res, data);
      }
      return this.handleOk(res, data);
    } catch (err) {
      return this.handleInternalServerError(res, err);
    }
  }

  async postVehicleData(req, res) {
    const { modelYear, manufacturer, model } = req.body;
    if (!modelYear || !manufacturer || !model) {
      return this.handleBadRequest(res);
    }
    try {
      const data = await this.vehicleControllers.getVehicleData(modelYear, manufacturer, model);
      if (data === undefined) {
        return this.handleInternalServerError(res, data);
      }
      if (data.Results.length === 0) {
        return this.handleNoContent(res, data);
      }
      return this.handleOk(res, data);
    } catch (err) {
      return this.handleInternalServerError(res, err);
    }
  }

  handleOk(res, data) {
    this.logger.info('vehicle data gotten successfully');
    const response = new Response(HTTPStatus.OK, 'Data gotten successfully', res, false, data);
    return response.res_message();
  }

  handleNoContent(res, data) {
    this.logger.info('There is no vehicle data ');
    const emptyResponse = new Response(HTTPStatus.NO_CONTENT, 'No content available', res, false, data);
    return emptyResponse.res_message();
  }

  handleInternalServerError(res, err) {
    this.logger.error('Error from getting vehicle data', err);
    const resp = new Response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Internal server error', res, true, []);
    return resp.res_message();
  }

  // eslint-disable-next-line class-methods-use-this
  handleBadRequest(res) {
    const resp = new Response(HTTPStatus.BadRequest, 'Bad request, Add all required fields, modelYear, manufacturer, model', res, true, []);
    return resp.res_message();
  }
}

module.exports = MainController;
