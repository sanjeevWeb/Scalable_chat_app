import { ERROR_MESSAGE } from "../constants/constant";
import httpStatusCodes from "../constants/httpStatusCode";
import BaseError from "./baseError";

class Api403Error extends BaseError {
    constructor(description: string | undefined = ERROR_MESSAGE.FORBIDDEN) {
        super(httpStatusCodes.FORBIDDEN, description);
    }
}

export default Api403Error;
