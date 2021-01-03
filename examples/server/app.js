const http = require("http");
const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");
const Websocket = require("ws");

process.title = "spaces-server";

const PORT = process.env.PORT || 3001;
const app = express();
// app.use(cors({origin: true, credentials: true}));
app.set("port", PORT);
app.get("/", (req, res, next) => res.send("Lorem ipsum"));

// Signal peer ids
const server = http.createServer(app);
const peerServer = ExpressPeerServer(server, {
  allow_discovery: true,
  debug: true,
});

app.use("/signal", peerServer);
// const peers = {};

peerServer.on("connection", (client) => {
  // peers[client.id] = client;
  console.log("Client connected ", client.id);
});

peerServer.on("disconnect", (client) => {
  // delete peers[client.id];
  console.log("Client disconnected ", client.id);
});

// Websocket listen
const wsServer = new Websocket.Server({
  httpServer: server,
  port: 8080,
});

wsServer.on("connection", (socket) => {
  // Send new peer ID
  socket.on("message", (peer) => {
    socket.send(peer);
  });
  // wsServer.clients.forEach((peer) => {
  //   peer.send(JSON.stringify(Object.keys(peers)));
  // });
});

server.listen(PORT);
console.log("Peer server running @ http://localhost: ", PORT);
