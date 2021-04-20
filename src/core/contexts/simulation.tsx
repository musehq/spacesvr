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

  const updateSimulationData = (
    dataConn: Peer.DataConnection,
    data: any
  ): void => {
    if (simulationData.current) {
      const obj = JSON.parse(data);
      if (simulationData.current.has(dataConn.peer)) {
        [
          ["x", "_x"],
          ["y", "_y"],
          ["z", "_z"],
        ].forEach((key, idx) => {
          simulationData.current!.get(dataConn.peer)!.position[idx] =
            obj.position[key[0]];
          simulationData.current!.get(dataConn.peer)!.rotation[idx] =
            obj.rotation[key[1]];
        });
      } else {
        simulationData.current.set(dataConn.peer, {
          position: [obj.position.x, obj.position.y, obj.position.z],
          rotation: [obj.rotation._x, obj.rotation._y, obj.rotation._z],
        });
      }
    }
  };

  // Handle DataConnection between peers
  const handleDataConn = (dataConn: Peer.DataConnection): void => {
    dataConn.on("open", () => {
      if (dataConnMap.current) {
        if (!dataConnMap.current.has(dataConn.peer)) {
          dataConnMap.current.set(dataConn.peer, dataConn);
        }
      }
    });

    // Track remote player position and rotation
    dataConn.on("data", (data: any) => {
      updateSimulationData(dataConn, data);
    });

    dataConn.on("close", () => {
      if (dataConnMap.current) {
        if (dataConnMap.current.has(dataConn.peer)) {
          dataConnMap.current.delete(dataConn.peer);
        }
      }

      if (simulationData.current) {
        if (simulationData.current.has(dataConn.peer)) {
          simulationData.current.delete(dataConn.peer);
        }
      }
    });

    dataConn.on("error", (err: any) => {
      console.log(err);
    });
  };

  // Connect a client
  const connectPeer = (locPeer: Peer, newPeer: string): void => {
    if (peerId.current != newPeer) {
      handleDataConn(locPeer.connect(newPeer));
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
    peer.on("connection", (dataConn: Peer.DataConnection) => {
      handleDataConn(dataConn);
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
