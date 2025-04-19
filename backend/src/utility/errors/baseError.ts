class BaseError extends Error {
    statusCode: number;
    constructor(statusCode: number, description: string | undefined) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = Error.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this);
    }
}

export default BaseError;
