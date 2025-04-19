import dotenv from 'dotenv'
import __dirname from "path"
export interface ProcessEnv {
    [key: string]: string | undefined
}
dotenv.config({ path: __dirname + "../../.env" }); // Adjust if needed

export const config:ProcessEnv = {
    refreshTokenSercretKey: process.env.REFRESH_TOKEN_SECRET,
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET
}

// console.log(config.refreshTokenSercretKey);
// console.log(config.accessTokenSecretKey);
// console.log(process.env.REFRESH_TOKEN_SECRET);