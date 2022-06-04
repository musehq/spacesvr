import nodeFetch from "node-fetch";
import { Peer } from "peerjs";
import { Signaller, SignallerConfig } from "../types";

type BackendSessionData = {
  session_id: string;
  peer_ids: string[];
  message?: string;
};

type BackendError = {
  message: string;
};

export class MuseSignaller implements Signaller {
  sessionId: string;
  world?: string;
  host: string;
  peerId: string;

  constructor(peer: Peer, config: Partial<SignallerConfig> = {}) {
    // set up signalling identification
    if (config.sessionId) this.sessionId = config.sessionId;
    else if (config.world) this.world = config.world;
    else this.world = window.location.pathname;

    // where to point requests to
    this.host = config.host || "https://muse-web.onrender.com";

    if (peer.id) this.peerId = peer.id;
  }

  async join(): Promise<string[] | undefined> {
    if (!this.peerId) {
      console.error("peer id not established, aborting signal");
      return;
    }

    let url = `${this.host}/join?peer_id=${this.peerId}`;
    if (this.sessionId) url += `&session_id=${this.sessionId}`;
    else url += `&world=${this.world}`;

    const response = await nodeFetch(url);
    let json = await response.json();

    if (response.status !== 200) {
      json = json as BackendError;
      console.error("couldn't find signal: ", json.message);
      return undefined;
    }

    json = json as BackendSessionData;
    this.sessionId = json.session_id;
    return json.peer_ids;
  }

  async leave(): Promise<void> {
    if (!this.sessionId || !this.peerId) {
      console.error("no session id / peer id, can't leave");
      return;
    }

    const url = `${this.host}/leave`;
    const body = { peer_id: this.peerId, session_id: this.sessionId };
    const response = await nodeFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      const json = (await response.json()) as BackendError;
      console.error("leave failed ... ", json.message);
    }
  }

  async health(): Promise<boolean> {
    if (!this.sessionId || !this.peerId) {
      console.error("no session id / peer id, can't perform health check");
      return false;
    }

    const url = `${this.host}/health`;
    const body = { peer_id: this.peerId, session_id: this.sessionId };
    const response = await nodeFetch(url, {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (response.status !== 200) {
      const json = (await response.json()) as BackendError;
      console.error("health check failed ... ", json.message);
      return false;
    }

    return true;
  }
}
