import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataConnection, Peer } from "peerjs";
import { generateHash } from "./hash";
import nodeFetch from "node-fetch";
import { Entity } from "./oldNetwork";
import { NetworkedState } from "../index";
import { getIceServers } from "./servers";

export const usePeerConnection = (): NetworkedState => {
  const [connected, setConnected] = useState(false);
  const hash = useMemo(() => generateHash(), []);
  const connections = useMemo(() => new Map<string, DataConnection>(), []);
  const thisData = useRef(new Map<string, Entity>());

  // Track remote player position and rotation
  const updateData = (conn: DataConnection, data: any): void => {
    if (thisData.current) {
      const obj = JSON.parse(data);
      if (thisData.current.has(conn.peer)) {
        ["x", "y", "z"].forEach((key, idx) => {
          thisData.current!.get(conn.peer)!.position[idx] = obj.position[idx];
          thisData.current!.get(conn.peer)!.rotation[idx] = obj.rotation[idx];
        });
      } else {
        thisData.current.set(conn.peer, {
          position: [obj.position[0], obj.position[1], obj.position[2]],
          rotation: [obj.rotation[0], obj.rotation[1], obj.rotation[2]],
        });
      }
    }
  };

  const registerConnection = (conn: DataConnection) => {
    conn.on("open", () => {
      console.log("connection opened with peer", conn.peer);
      connections.set(conn.peer, conn);
      conn.on("data", (data: any) => updateData(conn, data));
      conn.on("close", () => {
        console.log("connection closed!");
        connections.delete(conn.peer);
      });
    });
  };

  const [peerId, setPeerId] = useState<string>();
  const peer = useMemo(() => {
    const p = new Peer({ config: { iceServers: getIceServers() } });
    p.on("open", (id) => setPeerId(id));
    p.on("connection", registerConnection);
    p.on("close", () => {
      setConnected(false);
      p.disconnect();
      p.destroy();
    });
    p.on("error", (err) => console.error(err));
    return p;
  }, []);

  const connect = async () => {
    // fetch peer ids
    const url = `http://localhost:3009/join?hash=${hash}&id=${peer.id}`;
    const response = await nodeFetch(url);
    const json = await response.json();

    if (response.status !== 200) {
      console.error("error connecting to the server");
      console.error(response);
      setConnected(false);
      return;
    }

    setConnected(true);
    for (const id of json.ids) {
      if (id === peer.id) continue;
      const conn = peer.connect(id);
      registerConnection(conn);
    }
  };

  const sendEvent = useCallback(
    (type: string, data: any) => {
      switch (type) {
        case "player":
          if (peer && connections) {
            for (const pid of connections.keys()) {
              if (connections.get(pid)!.open) {
                connections.get(pid)!.send(data);
              }
            }
          }
          break;
        default:
          console.log("Invalid event type");
          break;
      }
    },
    [peer, connections]
  );

  useEffect(() => {
    if (!connected && peerId) connect();
  }, [connect, connected, peerId]);

  // Get player data
  const fetch = useCallback(
    (type: string) => {
      switch (type) {
        case "entities":
          if (peer && thisData.current) {
            return thisData.current;
          }
          break;
        default:
          console.log("Invalid data type");
          break;
      }

      return new Map<string, Entity>();
    },
    [peer, thisData]
  );

  return {
    peer,
    connected,
    connect,
    sendEvent,
    connections,
    data: thisData,
    fetch,
  };
};
