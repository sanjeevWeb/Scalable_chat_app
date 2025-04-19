
import { Socket } from "socket.io";
import MySocketInterface from "./socket.Interface.js";

class OrdersSocket implements MySocketInterface {

    handleConnection(socket: Socket) {

        socket.emit('ping', 'Hello I am a live socket connection');

    }

    middlewareImplementation(socket: Socket, next: any) {
        //Implement your middleware for orders here
        return next();
    }
}

export default OrdersSocket;