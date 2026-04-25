import express from "express";
import createWebSocket from "./socket.js";
import http from "http"

const app = express();

const server = http.createServer(app);

createWebSocket(server);

server.listen(3000);