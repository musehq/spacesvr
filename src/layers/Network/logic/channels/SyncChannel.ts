import { Channel, Message, Reducer } from "./index";
import { DataConnection } from "peerjs";

type GreetAddition<State = any> = {
  greet?: boolean;
  time?: number;
  state?: State;
};

/**
 * This Channel is responsible for keeping one state synchronized across
 * all peers. It does this by keeping one local state.
 *
 * Every time a new connection appears, you "greet" them with a new state and a time
 * to represent when the peer was instantiated, letting older peers take precedence.
 *
 */
export class SyncChannel<Data = any, State = Data> implements Channel {
  id: string;
  state: State;
  connections: Map<string, DataConnection>;
  initTime: number;
  reducer: Reducer;

  constructor(
    id: string,
    reducer: Reducer,
    connections: Map<string, DataConnection>
  ) {
    this.id = id;
    this.reducer = reducer;
    this.initTime = new Date().getTime();
    this.connections = connections;
  }

  send(data: Data) {
    console.log("sending data...");
    for (const [, conn] of this.connections.entries()) {
      if (conn.open) {
        conn.send({ id: this.id, data });
      }
    }
  }

  listen(message: Message<Data> & GreetAddition<State>) {
    console.log("receiving data...");
    if (message.greet) {
      if (message.time && message.state) {
        if (message.time < this.initTime) {
          this.state = message.state;
          this.initTime = message.time - 50; // add a buffer in case same peer sends it twice
        }
      }
    } else {
      this.reducer(message, this.state);
    }
  }

  greet(conn: DataConnection) {
    conn.send({
      id: this.id,
      time: this.initTime,
      state: this.state,
      greet: true,
    });
  }
}
