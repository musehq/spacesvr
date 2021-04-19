// @ts-ignore
import Peer from "peerjs";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import { Entity, SimulationState, SimulationProps } from "../types/simulation";

export const SimulationContext = createContext<SimulationState>(
  {} as SimulationState
);

export function useSimulation(): SimulationState {
  return useContext(SimulationContext);
}

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
export const useSimulationState = (
  props = {} as SimulationProps
): SimulationState => {
  const {
    signalHost,
    signalPort,
    signalPath,
    socketServer,
    frequency = 30,
  } = props;

  // Check props to enable simulation
  // TODO: Assert all SimulationProps specified
  const enabled = Object.keys(props).length > 0;

  // Manage player and network data
  const dataConn = useRef<Peer.DataConnection>();
  const dataConnMap = useRef<Map<string, Peer.DataConnection>>();
  const simulationData = useRef<Map<string, Entity>>();

  // Setup sources
  const peerId = useRef<string>();
  const socket = useRef<WebSocket>();
  const [connected, setConnected] = useState(false);
  const peer = useMemo(() => {
    if (enabled) {
      return new Peer({
        host: signalHost,
        port: signalPort,
        path: signalPath,
        secure: signalPort === 443,
      });
    }
    return new Peer();
  }, [signalHost, signalPort, signalPath]);

  // Handle DataConnection between peers
  const handleDataConn = (connection: Peer.DataConnection): void => {
    connection.on("open", () => {
      if (dataConnMap.current && !dataConnMap.current.has(connection.peer)) {
        dataConnMap.current.set(connection.peer, connection);
      }
    });

    // Track remote player position and rotation
    connection.on("data", (data: any) => {
      if (simulationData.current) {
        const obj = JSON.parse(data);
        simulationData.current.set(connection.peer, {
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [obj.rotation._x, obj.rotation._y, obj.rotation._z],
        });
      }
    });

    connection.on("close", () => {
      if (dataConnMap.current && dataConnMap.current.has(connection.peer)) {
        dataConnMap.current.delete(connection.peer);
      }

      if (
        simulationData.current &&
        simulationData.current.has(connection.peer)
      ) {
        simulationData.current.delete(connection.peer);
      }
    });

    connection.on("error", (err: any) => {
      console.log(err);
    });
  };

  // Connect a client
  const connectPeer = (locPeer: Peer, newPeer: string): void => {
    if (peerId.current != newPeer) {
      dataConn.current = locPeer.connect(newPeer);
      handleDataConn(dataConn.current);
    }
  };

  // Connect all clients
  const connectP2P = (locPeer: Peer): void => {
    locPeer.listAllPeers((peers: any) => {
      if (peers && peers.length) {
        for (const p of peers) {
          connectPeer(locPeer, p);
        }
      }
    });
  };

  // Connect client WebSocket
  const connectWS = (wss: string): void => {
    socket.current = new WebSocket(wss);

    // Emit the new ID
    socket.current.onopen = (event: Event) => {
      if (peerId.current && socket.current) {
        socket.current.send(peerId.current);
      }
    };

    // Catch WebSocket errors and close
    socket.current.onerror = (event: Event) => {
      if (socket.current) {
        socket.current.close();
      }
    };

    // Connect to any new peers
    socket.current.onmessage = (event: MessageEvent) => {
      connectPeer(peer, event.data);
    };
  };

  // Send event
  const sendEvent = useCallback(
    (type: string, data: any) => {
      switch (type) {
        case "player":
          if (peer && dataConnMap.current) {
            for (const pid of dataConnMap.current.keys()) {
              if (dataConnMap.current.get(pid)!.open) {
                dataConnMap.current.get(pid)!.send(data);
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
          if (peer && simulationData.current) {
            return simulationData.current;
          }
          break;
        default:
          console.log("Invalid data type");
          break;
      }

      return new Map<string, Entity>();
    },
    [peer, simulationData]
  );

  // Make connections synced with props
  useEffect(() => {
    if (!enabled) {
      return;
    }

    peer.on("open", (id: string) => {
      if (!socketServer) return;

      peerId.current = id;
      dataConnMap.current = new Map<string, Peer.DataConnection>();
      simulationData.current = new Map<string, Entity>();

      // Join network of existing peers
      connectP2P(peer);

      // WebSocket listen for future peers
      connectWS(socketServer);

      setConnected(true);
    });

    // P2P connection established
    peer.on("connection", (conn: Peer.DataConnection) => {
      conn.on("open", () => {
        if (dataConnMap.current && !dataConnMap.current.has(conn.peer)) {
          dataConnMap.current.set(conn.peer, conn);
        }
      });

      conn.on("data", (data: any) => {
        const obj = JSON.parse(data);
        if (simulationData.current) {
          simulationData.current.set(conn.peer, {
            position: [obj.position.x, obj.position.y, obj.position.z],
            rotation: [obj.rotation._x, obj.rotation._y, obj.rotation._z],
          });
        }
      });

      conn.on("close", () => {
        if (dataConnMap.current && dataConnMap.current.has(conn.peer)) {
          dataConnMap.current.delete(conn.peer);
        }

        if (simulationData.current && simulationData.current.has(conn.peer)) {
          simulationData.current.delete(conn.peer);
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
  }, [peer, props]);

  return {
    connected,
    sendEvent,
    frequency,
    fetch,
  };
};
