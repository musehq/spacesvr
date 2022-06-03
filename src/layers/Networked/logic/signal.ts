import nodeFetch from "node-fetch";
import { Peer } from "peerjs";

export const getSignalledPeers = async (
  peer: Peer
): Promise<string[] | undefined> => {
  if (!peer.id) {
    console.error("peer id not established, aborting signal");
    return;
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

export const generateHash = () => {
  return window.location.host + window.location.pathname;
};
