import Peer from "peerjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Entity, SimulationState } from "../types/simulation";

export type SimulationProps = {
  signalHost?: string;
  signalPort?: number;
  signalPath?: string;
  socketServer?: string;
  frequency?: number;
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
    frequency = 20,
    disableSimulation,
  } = props;

  let dataConn: Peer.DataConnection;
  let dataConnMap: Map<string, Peer.DataConnection>;
  let simulationData: Map<string, Entity>;

  const peerId = useRef<string>();
  const socket = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);
  const peer = useMemo(() => {
    if (!disableSimulation) {
      return new Peer({
        host: signalHost,
        port: signalPort,
        path: signalPath,
      });
    }
    return new Peer();
  }, [signalHost, signalPort, signalPath, disableSimulation]);

  // Set up handlers for Data Connection between peers
  const handleDataConn = (dataConn: Peer.DataConnection): void => {
    dataConn.on("open", () => {
      if (dataConnMap && !dataConnMap.has(dataConn.peer)) {
        dataConnMap.set(dataConn.peer, dataConn);
      }
    });

    // Track remote position/rotation
    dataConn.on("data", (data: any) => {
      if (simulationData) {
        const obj = JSON.parse(data);
        simulationData.set(dataConn.peer, {
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [obj.rotation._x, obj.rotation._y, obj.rotation._z],
        });
      }
    });

    dataConn.on("close", () => {
      if (dataConnMap && dataConnMap.has(dataConn.peer)) {
        dataConnMap.delete(dataConn.peer);
      }

      if (simulationData && simulationData.has(dataConn.peer)) {
        simulationData.delete(dataConn.peer);
      }
    });

    dataConn.on("error", (err) => {
      console.log(err);
    });
  };

  // Connect clients
  const connectPeer = (locPeer: Peer, newPeer: string): void => {
    if (peerId.current != newPeer) {
      dataConn = locPeer.connect(newPeer);
      handleDataConn(dataConn);
    }
  };

  // Connect P2P
  const connectP2P = (locPeer: Peer): void => {
    locPeer.listAllPeers((peers) => {
      if (peers && peers.length) {
        for (const p of peers) {
          connectPeer(locPeer, p);
        }
      }
    });
  };

  // Send event
  const sendEvent = useCallback(
    (type: string, data: any) => {
      switch (type) {
        case "player":
          if (peer && dataConnMap) {
            for (const pid of dataConnMap.keys()) {
              if (dataConnMap.get(pid)!.open) {
                dataConnMap.get(pid)!.send(data);
              }
            }
          }
          break;
        default:
          console.log("Invalid event type");
          break;
      }
    },
    [peer]
  );

  // Get player data
  const fetch = useCallback(
    (type: string) => {
      switch (type) {
        case "entities":
          if (peer && simulationData) {
            return simulationData;
          }
          break;
        default:
          console.log("Invalid data type");
          break;
      }

      return new Map<string, Entity>();
    },
    [peer]
  );

  // Establish p2p connection synced with props
  useEffect(() => {
    if (disableSimulation) {
      return;
    }

    peer.on("open", (id: string) => {
      peerId.current = id;
      dataConnMap = new Map<string, Peer.DataConnection>();
      simulationData = new Map<string, any>();

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
      socket.current.onmessage = (event: MessageEvent) => {
        connectPeer(peer, event.data);
      };

      setConnected(true);
    });

    // P2P connection established
    peer.on("connection", (conn: Peer.DataConnection) => {
      conn.on("open", () => {
        if (dataConnMap && !dataConnMap.has(conn.peer)) {
          dataConnMap.set(conn.peer, conn);
        }
      });

      conn.on("data", (data: any) => {
        const obj = JSON.parse(data);
        if (simulationData) {
          simulationData.set(conn.peer, {
            position: [obj.position.x, obj.position.y, obj.position.z],
            rotation: [obj.rotation._x, obj.rotation._y, obj.rotation._z],
          });
        }
      });

      conn.on("close", () => {
        if (dataConnMap && dataConnMap.has(conn.peer)) {
          dataConnMap.delete(conn.peer);
        }

        if (simulationData && simulationData.has(conn.peer)) {
          simulationData.delete(conn.peer);
        }
      });
    });

    // Exit client
    peer.on("close", () => {
      setConnected(false);
      peer.disconnect();
      peer.destroy();
    });

    // Catch peer error
    peer.on("error", (err: Error) => {
      console.log(err);
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
    frequency,
    fetch,
  };
};
