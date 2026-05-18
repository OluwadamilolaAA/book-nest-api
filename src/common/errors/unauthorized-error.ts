import CustomAPIError from "../errors/custom-error"

class UnauthorizedError extends CustomAPIError{
    constructor(message: string){
        super(message, 401),
        this.statusCode = 401;

        Object.setPrototypeOf(this, CustomAPIError.prototype)
    }
}
export default UnauthorizedError;