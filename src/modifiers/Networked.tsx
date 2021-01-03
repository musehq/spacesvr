import React from "react";
import Peer from "peerjs";

type NetworkedProps = {
  host: string;
  port: number;
  path: string;
};

export const Networked = (props: NetworkedProps) => {
  let peerId: string;
  let peerConn: Peer.DataConnection;
  let socket: WebSocket;

  const connectPeer = (peer: Peer, newPeer: string): void => {
    if (peerId != newPeer) {
      peerConn = peer.connect(newPeer);

      peerConn.on("open", () => {
        peerConn.send("Hello from " + peerId);
      });

      console.log("Connected with " + newPeer);
    }
  };

  const connectP2P = (peer: Peer): void => {
    peer.listAllPeers((peers) => {
      console.log(peers);

      if (peers && peers.length) {
        for (const p of peers) {
          connectPeer(peer, p);
        }
      }
    });
  };

  const peer = new Peer({
    host: props.host,
    port: props.port,
    path: props.path,
  });

  peer.on("open", (id) => {
    peerId = id;
    // Connect to existing peers
    connectP2P(peer);

    // Listen for future peers
    socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", (event) => {
      socket.send(peerId);
    });

    socket.addEventListener("message", (event) => {
      connectPeer(peer, event.data);
    });
  });

  peer.on("connection", (conn) => {
    // Handle stream
    conn.on("data", (data) => {
      console.log(data);
    });

    conn.on("close", () => {
      console.log("Closed data connection " + peerId);
    });
  });

  peer.on("close", () => {
    peer.destroy();
    console.log("Destroyed " + peerId);
  });

  peer.on("error", (err) => {
    alert(err);
  });

  return null;
};
