import Peer from "peerjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SimulationState } from "../types/simulation";

export type SimulationProps = {
  signalHost?: string;
  signalPort?: number;
  signalPath?: string;
  socketServer?: string;
  disableSimulation?: boolean;
};

/**
 * Simulation creates a P2P mesh
 * between clients by using PeerJS
 *
 * PeerJS API wraps WebRTC framework, supported by Peer Server
 * for signaling, and WebSockets for discovering new clients
 *
 * @param props
 * @constructor
 */
export const useSimulationState = (props: SimulationProps): SimulationState => {
  const {
    signalHost = "127.0.0.1",
    signalPort = 3001,
    signalPath = "/signal",
    socketServer = "ws://127.0.0.1:8080",
    disableSimulation,
  } = props;

  let dataConn: Peer.DataConnection;
  const peerId = useRef<string>();
  const socket = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);
  const peer = useMemo(
    () => new Peer({ host: signalHost, port: signalPort, path: signalPath }),
    [signalHost, signalPort, signalPath]
  );

  // Set up handlers for Data Connection between peers
  const handleDataConn = (dataConn: Peer.DataConnection): void => {
    //TODO: Stream player position/rotation
    dataConn.on("open", () => {
      dataConn.send("Hello from " + peerId.current);
    });

    dataConn.on("data", (data: any) => {
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
  const connectPeer = (locPeer: Peer, newPeer: string): void => {
    if (peerId.current != newPeer) {
      dataConn = locPeer.connect(newPeer);
      handleDataConn(dataConn);
      console.log("Connected with " + newPeer);
    }
  };

  // Connect P2P
  const connectP2P = (locPeer: Peer): void => {
    locPeer.listAllPeers((peers) => {
      console.log(peers);
      if (peers && peers.length) {
        for (const p of peers) {
          connectPeer(locPeer, p);
        }
      }
    });
  };

  // event send example func
  const sendEvent = useCallback(
    (type: string, data: any) => {
      if (peer) {
        dataConn.send(data);
      }
    },
    [peer]
  );

  // establish p2p connection synced with props
  useEffect(() => {
    if (disableSimulation) {
      return;
    }

    peer.on("open", (id) => {
      peerId.current = id;
      // Join network of existing peers
      connectP2P(peer);

      // Listen for future peers
      socket.current = new WebSocket(socketServer);

      // Emit the new ID
      socket.current.onopen = () => {
        if (peerId.current && socket.current) {
          socket.current.send(peerId.current);
        }
      };

      // Connect to any new peers
      socket.current.onmessage = (event) => {
        connectPeer(peer, event.data);
      };

      setConnected(true);
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
      console.log("Destroyed " + peerId.current);
    });

    // Catch peer error
    peer.on("error", (err) => {
      alert(err);
    });

    return () => {
      setConnected(false);
      if (peer) {
        peer.disconnect();
        peer.destroy();
      }
    };
  }, [peer, disableSimulation]);

  return {
    signalHost,
    signalPort,
    signalPath,
    connected,
    sendEvent,
  };
};
