import React from "react";
import Peer from "peerjs";

type MultiplayerProps = {
  ss_host?: string;
  ss_port?: number;
  ss_path?: string;
  ws_server?: string;
};

/**
 * Multiplayer creates a P2P mesh
 * between clients by using PeerJS
 *
 * PeerJS API wraps WebRTC framework, supported by Peer Server
 * for signaling, and WebSockets for discovering new clients
 *
 * @param props
 * @constructor
 */
export const Multiplayer = (props: MultiplayerProps) => {
  const {
    ss_host = "127.0.0.1",
    ss_port = 3001,
    ss_path = "/signal",
    ws_server = "ws://127.0.0.1:8080",
  } = props;

  let peerId: string;
  let dataConn: Peer.DataConnection;
  let socket: WebSocket;

  // Set up handlers for Data Connection between peers
  const handleDataConn = (dataConn: Peer.DataConnection): void => {
    //TODO: Stream player position/rotation
    dataConn.on("open", () => {
      dataConn.send("Hello from " + peerId);
    });

    dataConn.on("data", (data) => {
      console.log(data);
    });

    dataConn.on("close", () => {
      console.log("Closed data connection");
    });

    dataConn.on("error", (err) => {
      alert(err);
    });
  };

  // Connect clients
  const connectPeer = (peer: Peer, newPeer: string): void => {
    if (peerId != newPeer) {
      dataConn = peer.connect(newPeer);
      handleDataConn(dataConn);
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

  // Create peer on server
  const peer = new Peer({
    host: ss_host,
    port: ss_port,
    path: ss_path,
  });

  peer.on("open", (id) => {
    peerId = id;
    // Join network of existing peers
    connectP2P(peer);

    // Listen for future peers
    socket = new WebSocket(ws_server);

    // Emit the new ID
    socket.onopen = (event) => {
      socket.send(peerId);
    };

    // Connect to any new peers
    socket.onmessage = (event) => {
      connectPeer(peer, event.data);
    };
  });

  // P2P connection established
  peer.on("connection", (conn) => {
    //TODO: Render position/rotation received
    conn.on("data", (data) => {
      console.log(data);
    });

    conn.on("close", () => {
      console.log("Closed peer");
    });
  });

  // Exit client
  peer.on("close", () => {
    peer.destroy();
    console.log("Destroyed " + peerId);
  });

  // Catch peer error
  peer.on("error", (err) => {
    alert(err);
  });

  return null;
};
