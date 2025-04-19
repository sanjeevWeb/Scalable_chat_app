import { Request, Response, NextFunction } from 'express';
import Api401Error from "../utility/errors/api401Error.js";

const validate = (schema: { query?: any, body?: any, params?: any }) => {
    return async (req: any, res: Response, next: NextFunction) => {
        const options = {
            abortEarly: true,
            allowUnknown: false,
            stripUnknown: true
        };

        const queryResult = schema.query ? schema.query.validate(req.query, { ...options }) : {};
        const bodyResult = schema.body ? schema.body.validate(req.body, { ...options }) : {};
        const paramsResult = schema.params ? schema.params.validate(req.params, { ...options }) : {};

        if (queryResult.error || bodyResult.error || paramsResult.error) {
            const errors = {
                ...(queryResult.error && { query: queryResult.error.details }),
                ...(bodyResult.error && { body: bodyResult.error.details }),
                ...(paramsResult.error && { params: paramsResult.error.details }),
            };
            if (queryResult.error) {
                next(new Api401Error(`${queryResult.error.details[0].message}`));
            }
            if (bodyResult.error) {
                next(new Api401Error(`${bodyResult.error.details[0].message}`));
            }
            if (paramsResult.error) {
                next(new Api401Error(`${paramsResult.error.details[0].message}`));
            }
            next(new Api401Error("Invalid parameters/body fields received"));
        }
        req.query = queryResult.value ? queryResult.value : req.query
        req.body = bodyResult.value ? bodyResult.value : req.body;
        req.params = paramsResult.value ? paramsResult.value : req.params;
        next();
    }
}

export default validate;