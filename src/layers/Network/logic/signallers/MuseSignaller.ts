import { Peer } from "peerjs";
import { Signaller, SignallerConfig } from "./";

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
  sessionPassword?: string;
  worldName?: string;
  host: string;
  peerId: string;

  constructor(peer: Peer, config: Partial<SignallerConfig> = {}) {
    console.info("using muse signaller");

    // set up signalling identification
    if (config.sessionId) this.sessionId = config.sessionId;
    else if (config.worldName) this.worldName = config.worldName;
    else this.worldName = window.location.pathname;

    // where to point requests to
    this.host = config.host || "https://muse-web.onrender.com";

    if (config.sessionPassword) this.sessionPassword = config.sessionPassword;

    if (peer.id) this.peerId = peer.id;
  }

  async callBackend<T = any>(path: string, body: any): Promise<Response> {
    return await fetch(`${this.host}/sessions/${path}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
  }

  async join(): Promise<string[] | undefined> {
    if (!this.peerId) {
      console.error("peer id not established, aborting signal");
      return;
    }

    const body: any = { peer_id: this.peerId };
    if (this.sessionId) body.session_id = this.sessionId;
    else body.world = this.worldName;
    if (this.sessionPassword) body.password = this.sessionPassword;
    const response = await this.callBackend("join", body);
    let json = await response.json();

    if (response.status !== 200) {
      json = json as BackendError;
      console.error("failed to signal: ", json.message);
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

    const body = { peer_id: this.peerId, session_id: this.sessionId };
    const response = await this.callBackend("leave", body);

    if (response.status !== 200) {
      const json = (await response.json()) as BackendError;
      console.error("leave failed ... ", json.message);
    }
  }

  async wave(): Promise<boolean> {
    if (!this.sessionId || !this.peerId) {
      console.error("no session id / peer id, can't wave");
      return false;
    }

    const body = { peer_id: this.peerId, session_id: this.sessionId };
    const response = await this.callBackend("wave", body);

    if (response.status !== 200) {
      const json = (await response.json()) as BackendError;
      console.error("wave check failed ... ", json.message);
      return false;
    }

    return true;
  }
}
