import CustomAPIError from "./custom-error"

class BadRequestError extends CustomAPIError{
    constructor(message: string){
        super(message, 400),
        this.statusCode = 400
        Object.setPrototypeOf(this, CustomAPIError.prototype);
    }
};

export default BadRequestError;