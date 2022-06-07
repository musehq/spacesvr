import { Peer } from "peerjs";
import { Signaller } from "./";

const SESSION_ID = "spacesvr-local-signalling";
const TIMEOUT_MIN = 1.25;

type StoredPeer = { id: string; last_seen: number };

export class LocalSignaller implements Signaller {
  peerId: string;

  constructor(peer: Peer) {
    console.info("using local signaller");
    if (peer.id) this.peerId = peer.id;
  }

  readStore(): StoredPeer[] {
    const str = localStorage.getItem(SESSION_ID);
    if (!str) return [];
    try {
      return JSON.parse(str) as StoredPeer[];
    } catch (err) {
      return [];
    }
  }

  writeStore(peers: StoredPeer[]) {
    localStorage.setItem(SESSION_ID, JSON.stringify(peers));
  }

  cleanStore() {
    const peers = this.readStore();
    const time = new Date().getTime();
    const newPeers = peers.filter((peer) => {
      const keep = time - peer.last_seen <= TIMEOUT_MIN * 60 * 1000;
      if (!keep) console.info("removing local peer with id ", peer.id);
      return keep;
    });
    this.writeStore(newPeers);
  }

  async join(): Promise<string[] | undefined> {
    if (!this.peerId) {
      console.error("peer id not established, aborting signal");
      return;
    }

    this.cleanStore();

    console.info("local network detected, signalling with localStorage");

    const peer: StoredPeer = {
      id: this.peerId,
      last_seen: new Date().getTime(),
    };
    const peers = this.readStore();
    peers.push(peer);
    this.writeStore(peers);
    return peers.map((peer) => peer.id);
  }

  async leave(): Promise<void> {
    if (!this.peerId) {
      console.error("peer id not established, aborting signal");
      return;
    }

    console.info(`updating local signal list to remove self`);

    const peers = this.readStore();
    const index = peers.findIndex((peer) => peer.id === this.peerId);
    if (index < 0) {
      console.error("peer not in local signal list, aborting ...");
    } else {
      peers.splice(index, 1);
      this.writeStore(peers);
    }
  }

  async wave(): Promise<boolean> {
    if (!this.peerId) {
      console.error("peer id not established, wave failed");
      return false;
    }

    const peers = this.readStore();
    let foundAndUpdated = false;
    peers.map((peer) => {
      if (peer.id === this.peerId) {
        peer.last_seen = new Date().getTime();
        foundAndUpdated = true;
      }
    });
    this.writeStore(peers);

    return foundAndUpdated;
  }
}
