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

  io.on("connection", async (socket: CustomSocket) => {
    // * Join the room
    const userId = socket.userData?.user_id;

    if (!userId) return socket.disconnect();

    // Store mapping in Redis
    await publisher.set(`user:${userId}`, socket.id); // set user to redis
    // socket.join(`user:${userId}`); // allows targeted emits by room

    socket.on('joinRoom', (room) => {
      socket.join(room);
      io.to(room).emit('userJoined', socket.id + ' joined the room.');
    });

    socket.on("one-to-one:message", async (data: { toUserId: string, message: any }) => {
      try {
        // data should contain the userId of the receiving user , if receiving user found in redis, we emit
        // the message to him/her ohterwise he will besent notification .
        const targetSocketId = await subscriber.get(`user:${data.toUserId}`);
        if (targetSocketId) {
          io.to(targetSocketId).emit("one-to-one:message", {
            from: userId,
            message: data.message,
          });
        }
        else {
          // Handle offline (e.g., store for push notification)
          console.log(`User ${data.toUserId} is offline.`);
        }
        await produceMessages(data.toUserId, data.message); // Store into Kafka / DB
      }
      catch (error) {
        console.log("The kafka produce error is", error);
      }

      // socket.to(socket.room).emit("message", data);
    });

    socket.on("group:message", async (data: { groupId: string, message: any }) => {
      try {
        // data should contain the groupId of the receiving users , if receiving group found in redis, we emit
        // the message to group ohterwise he will be sent notification
        socket.join(data.groupId)
        io.to(data.groupId).emit("group:message", {
          from: userId,
          message: data.message,
        });

        await produceMessages(data.groupId, data.message);
      }
      catch (error) {
        console.log("The kafka produce error is", error);
      }
      // socket.to(socket.room).emit("message", data);
    });

    socket.on('joinGroup', (group) => {
      socket.join(group);
      io.to(group).emit('userJoined', socket.id + ' joined the group.');
    });

    // User starts typing
    socket.on('typing:start', (data: { toUserId?: string, groupId?: string }) => {
      if (data.groupId) {
        // Group typing
        socket.to(data.groupId).emit('typing:start', {
          from: socket.userData.user_id,
          groupId: data.groupId
        });
      } 
      else if (data.toUserId) {
        // One-to-one typing
        subscriber.get(`user:${data.toUserId}`).then((targetSocketId) => {
          if (targetSocketId) {
            io.to(targetSocketId).emit('typing:start', {
              from: socket.userData.user_id,
            });
          }
        });
      }
    });

    // User stops typing
    socket.on('typing:stop', (data: { toUserId?: string, groupId?: string }) => {
      if (data.groupId) {
        socket.to(data.groupId).emit('typing:stop', {
          from: socket.userData.user_id,
          groupId: data.groupId
        });
      }
       else if (data.toUserId) {
        subscriber.get(`user:${data.toUserId}`).then((targetSocketId) => {
          if (targetSocketId) {
            io.to(targetSocketId).emit('typing:stop', {
              from: socket.userData.user_id,
            });
          }
        });
      }
    });


    socket.on("disconnect", async () => {
      await publisher.del(`user:${userId}`);
      console.log("A user disconnected:", socket.id);
    });
  });
}