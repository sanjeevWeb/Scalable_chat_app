import { config } from "config/config.js";
import jwt from "jsonwebtoken"
import Api403Error from "utility/errors/api403Error.js";

const refreshTokenSercretKey: string | undefined = config.refreshTokenSercretKey;
const accessTokenSecretKey: string | undefined = config.accessTokenSecretKey;

console.log(refreshTokenSercretKey);

export interface TokenPayload {
    email: string;
    user_id: number
}

class JsonWebTokenService {

    signRefreshToken(user_id: number, email: string) {
        return new Promise<string>((resolve, reject) => {
            const signOptions: jwt.SignOptions = {
                issuer: "chatapp",
                expiresIn: "30d"
            };

            const token: string = jwt.sign({ user_id, email }, refreshTokenSercretKey!, signOptions);
            resolve(token as string);
        })
    }

    signAccessToken(user_id: number, email: string) {
        return new Promise<string>((resolve, reject) => {
            try {
                const signOptions: jwt.SignOptions = {  //Throwing error without jwt.SignOptions
                    issuer: "chatapp",
                    expiresIn: "1d",
                    // algorithm: "RS256"
                };
                const payLoad = { user_id, email };
                const token: string = jwt.sign({ user_id, email }, accessTokenSecretKey!, signOptions);
                resolve(token);
            } catch (error) {
                reject(error);
            }

        })
    }

    verifyAccessToken(token: string) {
        return new Promise<TokenPayload>((resolve, reject) => {
            try {
                jwt.verify(token, accessTokenSecretKey!, ((err: any, data: any) => {
                    if (err) {
                        throw new Api403Error("invalid or expired access token!");
                    } else {
                        resolve(data as TokenPayload);
                    }
                }));
            } catch (error) {
                throw error;
            }
        })
    }

    // verifyRefreshToken(token: string) {
    //     return new Promise<TokenPayload>((resolve, reject) => {
    //         try {
    //             jwt.verify(token, refreshTokenSercretKey!, ((err: any, data: any) => {
    //                 if (err) {
    //                     throw err;
    //                 } else {
    //                     resolve(data as TokenPayload);
    //                 }
    //             }));
    //         } catch (error) {
    //             reject(error);
    //         }
    //     })
    // }
}

export default new JsonWebTokenService();