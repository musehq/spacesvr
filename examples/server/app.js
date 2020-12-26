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

const httpServer = http.createServer(app);
const peerServer = ExpressPeerServer(httpServer, {
  allow_discovery: true,
  debug: true,
});
const wsServer = new Websocket.Server({ port: 8080 });

app.use("/signal", peerServer);
const peers = {};

peerServer.on("connection", (client) => {
  peers[client.id] = client;
  console.log("Client connected ", client.id);
});

peerServer.on("disconnect", (client) => {
  delete peers[client.id];
  console.log("Client disconnected ", client.id);
});

wsServer.on("connection", (socket) => {
  // socket.on('message', message => {
  // 	console.log('Msg from client: '+message)
  // })
  // socket.send();
  wsServer.clients.forEach((wsClient) => {
    wsClient.send(JSON.stringify(Object.keys(peers)));
  });
});

httpServer.listen(PORT);
console.log("Peer server running @ http://localhost: ", PORT);
