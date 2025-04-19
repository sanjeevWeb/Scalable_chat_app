import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from "utility/database/db.js";
import "dotenv/config"

declare module "express-serve-static-core" {
    interface Request {
        user?: any; // can be used a proper type like `UserPayload`
    }
}

export const RequestJwtValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token: any = req.headers['Authorization'];

        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as JwtPayload;
        const userId = decode.user_id
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token payload' });
        }
        const user = await prisma.user.findUnique({ where: { userId } });
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(401).send({ message: "Unauthorized" });
        }
    }
    catch (error) {
        return res.status(500).json({ error: "Internal server error." });
    }
};