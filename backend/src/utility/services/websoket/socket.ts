import { Server, Socket } from "socket.io";
import jwtAuth, { TokenPayload } from "utility/hash/jwtAuth.js";
import { Redis } from 'ioredis'
import { produceMessages } from "../kafka/kafka.js";

interface CustomSocket extends Socket {
    userData?: TokenPayload | any;
}

export const publisher = new Redis(); // defaults to localhost:6379
export const subscriber = new Redis();

export function setupSocket(io: Server) {
    io.use((socket: CustomSocket, next) => {
        const token: string = socket.handshake.auth.token || socket.handshake.headers.token;
        if (!token) {
            return next(new Error("Invalid token"));
        }
        const userData = jwtAuth.verifyAccessToken(token)
        socket.userData = userData;
        next();
    });

    io.on("connection", (socket: CustomSocket) => {
        // * Join the room
        socket.join(socket.userData);

        socket.on("message", async (data: any) => {
          try {
            await produceMessages(data);
          } catch (error) {
            console.log("The kafka produce error is", error);
          }
          // socket.to(socket.room).emit("message", data);
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
        });
    });
}