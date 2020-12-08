const http = require("http");
const express = require("express");
const { ExpressPeerServer } = require("peer");

process.title = "spaces-server";

const PORT = process.env.PORT || 3001;
const app = express();
app.set("port", PORT);
app.get("/", (req, res, next) => res.send("Lorem ipsum"));

const httpServer = http.createServer(app);
const peerServer = ExpressPeerServer(httpServer, {
  debug: true,
});
app.use("/signal", peerServer);

peerServer.on("connection", (client) => {
  console.log("Client connected ", client.id);
});
peerServer.on("disconnect", (client) => {
  console.log("Client disconnected ", client.id);
});

httpServer.listen(PORT);
console.log("Peer server running @ http://localhost: ", PORT);
