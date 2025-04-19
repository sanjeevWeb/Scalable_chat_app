import { NextFunction, Request, Response } from "express";
import { LoginInterface } from "./interface.js";
import prisma from "utility/database/db.js";
import jwtAuth from "utility/hash/jwtAuth.js";
import HTTP_STATUS_CODE from "utility/constants/httpStatusCode.js";
import { API_RESPONSE_MESSAGE, ERROR_MESSAGE } from "utility/constants/constant.js";
import { comparePassword, hashPassword } from "utility/hash/hashPassword.js";


class AuthController {
    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { username, email, password, provider, oauth_id, profile_image, profile_status } = req.body;

            let findUser: LoginInterface = await prisma.user.findUnique({
                where: { email }
            });

            // If the user does not exist, create a new one
            if (!findUser) {
                let hashedPassword: string | undefined;

                if (password) {
                    hashedPassword = await hashPassword(password); // Hash the password before saving
                }

                findUser = await prisma.user.create({
                    data: {
                        username,
                        email,
                        password: hashedPassword, // Store only hashed passwords
                        provider: provider || (password ? "local" : "google"), // Default provider
                        oauth_id: oauth_id || null,
                        profile_image,
                        profile_status,
                    }
                });
            }
            else {
                // If the user is found but is trying to log in with a password when they registered via OAuth
                if (!findUser.password && password) {
                    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ error: "This account was registered using Google. Please log in with Google." });
                }

                // If the user registered with a password, verify it
                if (findUser.password && password) {
                    const isValid = await comparePassword(password, findUser.password);
                    if (!isValid) {
                        return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send(API_RESPONSE_MESSAGE.UNAUTHORIZED);
                    }
                }
            }

            // Generate tokens
            const accessToken: string = await jwtAuth.signAccessToken(findUser.userId, findUser.email);
            // const refreshToken: string = await jwtAuth.signRefreshToken(findUser.userId, findUser.email);

            return res.status(HTTP_STATUS_CODE.OK).json({ accessToken });
        }
        catch (error: any) {
            if (error.code === "P1000") {
                return res.status(401).send({ error: "Authentication failed" });
            }
            console.error("Auth Error:", error);
            return res.status(500).send(ERROR_MESSAGE.INTERNAL_SERVER);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, email } = req.user
            const { username, password } = req.body
            let findUser: LoginInterface = await prisma.user.findUnique({
                where: { userId: user_id }
            });

            if (!findUser) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).send(API_RESPONSE_MESSAGE.NOT_FOUND)
            }
            if (!findUser.password && password) {
                return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ error: "This account was registered using Google. Please log in with Google." });
            }

            if (findUser.password && password) {
                const isValid = await comparePassword(password, findUser.password);
                if (!isValid) {
                    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send(API_RESPONSE_MESSAGE.UNAUTHORIZED);
                }
            }
            let user: { username?: string, password?: string };
            if (username && password) {
                user.username = username
                user.password = password
            }
            else if (username) {
                user.username = username
            }
            else {
                user.password = password
            }
            await prisma.user.update({
                where: { email },
                data: user
            })
            return res.status(HTTP_STATUS_CODE.OK).send(API_RESPONSE_MESSAGE.SUCCESS);
        }
        catch (error: any) {
            if (error.code === "P1000") {
                return res.status(401).send({ error: "Authentication failed" });
            }
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER);
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, email } = req.user
            let findUser: LoginInterface = await prisma.user.findUnique({
                where: { email }
            });

            if (!findUser) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).send(API_RESPONSE_MESSAGE.NOT_FOUND)
            }
            await prisma.user.delete({ where: { email } })
            return res.status(HTTP_STATUS_CODE.OK).send(API_RESPONSE_MESSAGE.SUCCESS);
        }
        catch (error: any) {
            if (error.code === "P1000") {
                return res.status(401).send({ error: "Authentication failed" });
            }
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId, username, email } = req.query;

            let user;
            if (userId) {
                user = await prisma.user.findUnique({
                    where: { userId: Number(userId) } // Ensure userId is a number
                });
            } else if (email) {
                user = await prisma.user.findUnique({
                    where: { email: String(email) }
                });
            } else if (username) {
                user = await prisma.user.findMany({
                    where: { username: String(username) } // Multiple users can have the same username
                });
            }

            if (!user || (Array.isArray(user) && user.length === 0)) {
                return res.status(HTTP_STATUS_CODE.NOT_FOUND).send({ error: "User not found." });
            }
            return res.status(HTTP_STATUS_CODE.FOUND).send(user)

        }
        catch (error: any) {
            return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER).send(ERROR_MESSAGE.INTERNAL_SERVER);
        }
    }
}

export default new AuthController()