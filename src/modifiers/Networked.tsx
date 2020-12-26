import React from "react";
import Peer from "peerjs";

type NetworkedProps = {
  host: string;
  port: number;
  path: string;
};

export const Networked = (props: NetworkedProps) => {
  let peerId: string;
  let conn: Peer.DataConnection;

  const peer = new Peer({
    host: props.host,
    port: props.port,
    path: props.path,
  });

  peer.on("open", (id) => {
    peerId = id;
    // Connect to other peers
    // fetch('http://localhost:3001/listPeers')
    // .then(res => res.json())
    // .then(data => { for (let pid of data) {
    // 	if (pid != peerId) {
    // 		conn = peer.connect(pid)
    // 		conn.send('hello');
    // 	}
    // }})
    // .catch(err => console.log(err));
    peer.listAllPeers((peers) => {
      console.log(peers);
      for (const p of peers) {
        if (p != peerId) {
          conn = peer.connect(p);

          conn.on("open", () => {
            conn.send("Hello from " + peerId);
          });

          conn.on("data", (data) => {
            console.log(data);
          });
        }
      }
    });
  });

  peer.on("close", () => {
    console.log("Closed connection");
  });

  peer.on("error", (err) => {
    alert(err);
  });

  return null;
};
