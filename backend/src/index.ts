import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { createServer } from 'http';
import { Server } from "socket.io";
import { publisher, setupSocket, subscriber } from "utility/services/websoket/socket.js";
import { createAdapter} from '@socket.io/redis-adapter'

dotenv.config()

const app:Application = express();

app.use(
  cors({
    origin: ["*"], // Comma separated list of  urls
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}))

// Logging Middleware, can be done with some third party lib like winston too.
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${req.method} ${req.originalUrl}`);
  next();
});


const server = createServer(app); //http server
const io = new Server(server, {
  cors: {
    // origin: [process.env.CLIENT_APP_URL, "https://admin.socket.io"],
    origin: ["*"],
  },
  adapter: createAdapter(publisher, subscriber),
});

export { io };
setupSocket(io);

app.get("/", async (req: express.Request, res: express.Response) => {
  try {
    res.send(
      "Welcome to unit testing!"
    );
  } catch (err) {
    console.log(err);
  }
});

// Start backend server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`This is working in port ${PORT}`);
});

export default app;