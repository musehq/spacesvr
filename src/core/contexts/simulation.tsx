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
  let dataConn: Peer.DataConnection;
  let dataConnMap: Map<string, Peer.DataConnection>;
  let simulationData: Map<string, Entity>;

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
  const handleDataConn = (dataConn: Peer.DataConnection): void => {
    dataConn.on("open", () => {
      if (dataConnMap && !dataConnMap.has(dataConn.peer)) {
        dataConnMap.set(dataConn.peer, dataConn);
      }
    });

    // Track remote player position and rotation
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

    dataConn.on("error", (err: any) => {
      console.log(err);
    });
  };

  // Connect a client
  const connectPeer = (locPeer: Peer, newPeer: string): void => {
    if (peerId.current != newPeer) {
      dataConn = locPeer.connect(newPeer);
      handleDataConn(dataConn);
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

  // Make connections synced with props
  useEffect(() => {
    if (!enabled) {
      return;
    }

    peer.on("open", (id: string) => {
      if (!socketServer) return;

      peerId.current = id;
      dataConnMap = new Map<string, Peer.DataConnection>();
      simulationData = new Map<string, Entity>();

      // Join network of existing peers
      connectP2P(peer);

      // WebSocket listen for future peers
      connectWS(socketServer);

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
  }, [peer, props]);

  return {
    connected,
    sendEvent,
    frequency,
    fetch,
  };
};
