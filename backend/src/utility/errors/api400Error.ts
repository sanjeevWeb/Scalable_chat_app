import { ERROR_MESSAGE } from "../constants/constant";
import httpStatusCodes from "../constants/httpStatusCode";
import BaseError from "./baseError";

class Api400Error extends BaseError {
    constructor(description: string | undefined = ERROR_MESSAGE.BAD_REQUEST) {
        super(httpStatusCodes.BAD_REQUEST, description);
    }
}

export default Api400Error;
