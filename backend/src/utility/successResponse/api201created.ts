import { Request, Response, NextFunction } from "express";
import HTTP_STATUS_CODE from "../constants/httpStatusCode.js";

const returnSuccess = (data: any, req: Request, res: Response, next: NextFunction) => {
    res.status(data.statusCode || HTTP_STATUS_CODE.CREATED);
    res.json(data);
};

export default returnSuccess;
