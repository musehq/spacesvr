const http = require("http");
const express = require("express");

const app = express();
app.get("/", (req, res) => res.send("hello world"));

const servers = new Map();
app.get("/join", (req, res) => {
  const hash = req.query.hash;
  const id = req.query.id;

  if (!hash || !id) {
    res.end("bad request, need hash and id");
    return;
  }

  if (!servers.get(hash)) {
    console.log("creating new server");
    servers.set(hash, [id]);
  } else {
    console.log("using existing server");
    const ids = servers.get(hash);
    ids.push(id);
    servers.set(hash, [...new Set(ids)]);
  }

  res.send({ ids: servers.get(hash) }).end();
});

const httpServer = http.createServer(app);
httpServer.listen(3009);
console.log("Server running on http://localhost:3009");

// // Create signalling server
// const httpServer = http.createServer(app);
// const peerServer = ExpressPeerServer(httpServer, {
//   generateClientId: uuidv4,
//   allow_discovery: true,
//   debug: true,
// });
//
// app.use("/signal", peerServer);
//
// // PeerJS server connection handlers
// peerServer.on("connection", (client) => {
//   console.log("Client connected ", client.id);
// });
//
// peerServer.on("disconnect", (client) => {
//   console.log("Client disconnected ", client.id);
// });
//
// // Create Websocket server
// const wsServer = new Websocket.Server({
//   server: httpServer,
//   port: WS_PORT,
// });
//
// // Websocket listen
// wsServer.on("connection", (socket) => {
//   // Send new peer ID
//   socket.on("message", (peer) => {
//     socket.send(peer);
//   });
// });
//
// // Start server
// console.log("Peer server running @ http://localhost:", PEERJS_PORT);
