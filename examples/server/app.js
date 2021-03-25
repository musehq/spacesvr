const http = require("http");
const express = require("express");
const { ExpressPeerServer } = require("peer");
const Websocket = require("ws");
const dotenv = require("dotenv");

process.title = "muse-p2p-server";

// Get config
dotenv.config();
const PEERJS_PORT = process.env.PEERJS_PORT || 3001;
const WS_PORT = process.env.WS_PORT || 3002;

const app = express();
app.get("/", (req, res, next) => res.send("Lorem ipsum"));

// Create signalling server
const httpServer = http.createServer(app);
const peerServer = ExpressPeerServer(httpServer, {
  allow_discovery: true,
  debug: true,
});

app.use("/signal", peerServer);

// PeerJS server connection handlers
peerServer.on("connection", (client) => {
  console.log("Client connected ", client.id);
});

peerServer.on("disconnect", (client) => {
  console.log("Client disconnected ", client.id);
});

// Create Websocket server
const wsServer = new Websocket.Server({
  server: httpServer,
  port: WS_PORT,
});

// Websocket listen
wsServer.on("connection", (socket) => {
  // Send new peer ID
  socket.on("message", (peer) => {
    socket.send(peer);
  });
});

// Start server
httpServer.listen(PEERJS_PORT);
console.log("Peer server running @ http://localhost:", PEERJS_PORT);
