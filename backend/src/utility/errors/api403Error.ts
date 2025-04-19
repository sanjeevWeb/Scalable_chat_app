import { ERROR_MESSAGE } from "utility/constants/constant";
import BaseError from "./baseError";
import HTTP_STATUS_CODE from "utility/constants/httpStatusCode";


class Api403Error extends BaseError {
    constructor(description: string | undefined = ERROR_MESSAGE.FORBIDDEN) {
        super(HTTP_STATUS_CODE.FORBIDDEN, description);
    }
}

export default Api403Error;