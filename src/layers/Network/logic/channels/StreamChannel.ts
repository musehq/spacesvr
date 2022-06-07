import { Reducer, Channel, Message } from "./index";
import { DataConnection } from "peerjs";

/**
 * The most basic channel type just sends data to all the peers and receives
 * the same data.
 *
 * The state built locally, where the intention is that it can be recovered
 * on the fly.
 *
 * This is best used for data like streaming player position/rotation, where
 * old values don't matter.
 */
export class StreamChannel<Data = any, State = any> implements Channel {
  id: string;
  state: State;
  connections: Map<string, DataConnection>;
  reducer: Reducer;

  constructor(
    id: string,
    reducer: Reducer,
    connections: Map<string, DataConnection>
  ) {
    this.id = id;
    this.reducer = reducer;
    this.connections = connections;
    this.state = {} as State;
  }

  send(data: Data) {
    for (const [, conn] of this.connections.entries()) {
      if (conn.open) {
        conn.send({ id: this.id, data });
      }
    }
  }

  receive(message: Message<Data>) {
    this.reducer(message, this.state);
  }
}
