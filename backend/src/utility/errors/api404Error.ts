import { ERROR_MESSAGE } from "../constants/constant";
import httpStatusCodes from "../constants/httpStatusCode";
import BaseError from "./baseError";

class Api404Error extends BaseError {
    constructor(description: string | undefined = ERROR_MESSAGE.NOT_FOUND) {
        super(httpStatusCodes.NOT_FOUND, description);
    }
}

export default Api404Error;
