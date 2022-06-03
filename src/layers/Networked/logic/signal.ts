import nodeFetch from "node-fetch";
import { Peer } from "peerjs";
import { isLocalNetwork } from "./local";

const LOCAL_SIGNAL_ID = "spacesvr-signalling";

export const getSignalledPeers = async (
  peer: Peer
): Promise<string[] | undefined> => {
  if (!peer.id) {
    console.error("peer id not established, aborting signal");
    return;
  }

  if (isLocalNetwork()) {
    console.info("local network detected, signalling with localStorage");
    const idsString = localStorage.getItem(LOCAL_SIGNAL_ID);
    if (!idsString) {
      const ids = [peer.id];
      localStorage.setItem(LOCAL_SIGNAL_ID, JSON.stringify(ids));
      return ids;
    } else {
      try {
        const ids = JSON.parse(idsString);
        ids.push(peer.id);
        localStorage.setItem(LOCAL_SIGNAL_ID, JSON.stringify(ids));
        return ids;
      } catch (e) {
        console.error("error updating localStorage signalling, resetting...");
        const ids = [peer.id];
        localStorage.setItem(LOCAL_SIGNAL_ID, JSON.stringify(ids));
        return ids;
      }
    }
  }

  const hash = generateHash();
  const url = `http://localhost:3009/join?hash=${hash}&id=${peer.id}`;
  const response = await nodeFetch(url);
  const json = await response.json();

  if (response.status !== 200) {
    console.error("error connecting to the server", response);
    return undefined;
  }

  return json.ids as string[];
};

export const removeSignalledPeer = (id: string, peer?: Peer) => {
  if (isLocalNetwork()) {
    console.info(`updating local signal list to remove peer with id ${id}`);
    const idsString = localStorage.getItem(LOCAL_SIGNAL_ID) || "[]";
    try {
      const ids = JSON.parse(idsString);
      const index = ids.indexOf(id);
      if (index < 0) {
        console.error("peer not in local signal list, aborting ...");
      } else {
        ids.splice(index, 1);
        localStorage.setItem(LOCAL_SIGNAL_ID, JSON.stringify(ids));
      }
    } catch (e) {
      console.error("error updating localStorage signalling, resetting...");
      const ids = peer ? [peer.id] : [];
      localStorage.setItem(LOCAL_SIGNAL_ID, JSON.stringify(ids));
    }
  }
};

export const generateHash = () => {
  return window.location.host + window.location.pathname;
};
