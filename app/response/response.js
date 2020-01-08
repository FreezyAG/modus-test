class Response {
    constructor(code, message, res, error, data) {
        this.code = code;
        this.message = message;
        this.res = res;
        this.error = error
        this.data = data
      }

    res_message(){
        return this.res
            .send({
                error: this.error,
                code: this.code,
                message: this.message,
                data: this.data
            })
    }
}

module.exports = Response;