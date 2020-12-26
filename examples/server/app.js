const http = require("http");
const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

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

app.use("/signal", peerServer);
// var connections = [];

peerServer.on("connection", (client) => {
  console.log("Client connected ", client.id);
  // var idx = connected.indexOf(client.id);
  // if (idx != -1) { connected.push(client.id) }
});

peerServer.on("disconnect", (client) => {
  console.log("Client disconnected ", client.id);
  // var idx = connected.indexOf(client.id);
  // if (idx != -1) { connected.splice(idx, 1) }
});

// app.get('/listPeers', (req, res) => {
//   return res.json(connected);
// });

httpServer.listen(PORT);
console.log("Peer server running @ http://localhost: ", PORT);
