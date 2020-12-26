import React from "react";
import Peer from "peerjs";

type NetworkedProps = {
  host: string;
  port: number;
  path: string;
};

export const Networked = (props: NetworkedProps) => {
  let peerId: string;
  let peerIds: string[];
  let peerConn: Peer.DataConnection;

  const peer = new Peer({
    host: props.host,
    port: props.port,
    path: props.path,
  });

  peer.on("open", (id) => {
    // Connect to existing peers
    peerId = id;
    peer.listAllPeers((peers) => {
      // console.log(peers);
      for (const p of peers) {
        if (p != peerId) {
          peerConn = peer.connect(p);
        }
      }
    });
  });

  peer.on("connection", (conn) => {
    // Handle streams
    conn.on("data", (data) => {
      console.log(data);
    });

    conn.on("close", () => {
      console.log("Closed data connection");
    });
  });

  peer.on("close", () => {
    console.log("Destroyed " + peerId);
  });

  peer.on("error", (err) => {
    alert(err);
  });

  const socket = new WebSocket("ws://localhost:8080");
  // socket.addEventListener('open', () => {
  //   socket.send('Hello world');
  // });
  // Connect to future peers
  socket.addEventListener("message", (event) => {
    peerIds = JSON.parse(event.data);
    console.log(peerIds);
    for (const pid of peerIds) {
      if (pid != peerId) {
        peerConn = peer.connect(pid);
        peerConn.on("open", () => {
          peerConn.send("Hello from " + peerId);
        });
      }
    }
  });

  return null;
};
