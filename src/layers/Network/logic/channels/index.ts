import { DataConnection } from "peerjs";
import { useEffect, useMemo } from "react";
import { StreamChannel } from "./StreamChannel";
import { SyncChannel } from "./SyncChannel";

export type Message<Data = any> = {
  conn?: DataConnection;
  id: string;
  data: Data;
};

export type Reducer<Data = any, State = any> = (
  message: Message<Data>,
  state: State
) => void;

export interface Channel<Data = any, State = any> {
  id: string;
  state: State;
  send: (data: Data) => void;
  receive: (message: Message<Data>) => void;
}

type ChannelType = "stream" | "sync";

export type Channels = {
  receive: (message: Message) => void;
  greet: (conn: DataConnection) => void;
  useChannel: <Data = any, State = any>(
    id: string,
    type: ChannelType,
    reducer: Reducer<Data, State>
  ) => Channel<Data, State>;
};

export const useChannels = (
  connections: Map<string, DataConnection>
): Channels => {
  const channels = useMemo<Map<string, Channel>>(
    () => new Map<string, Channel>(),
    []
  );

  const receive = (message: Message) => {
    for (const [id, channel] of channels.entries()) {
      if (id == message.id) {
        channel.receive(message);
      }
    }
  };

  const greet = (conn: DataConnection) => {
    for (const [, channel] of channels.entries()) {
      if (channel instanceof SyncChannel) {
        channel.greet(conn);
      }
    }
  };

  const useChannel = <Data = any, State = any>(
    id: string,
    type: ChannelType,
    reducer: Reducer<Data, State>
  ): Channel<Data, State> => {
    const channel = useMemo(() => {
      if (type === "stream") return new StreamChannel(id, reducer, connections);
      if (type === "sync") return new SyncChannel(id, reducer, connections);
      return new StreamChannel(id, reducer, connections);
    }, [id, type]);

    // keep reducer up to date
    useEffect(() => {
      channel.reducer = reducer;
    }, [channel, reducer]);

    // keep channel registered
    useEffect(() => {
      if (channels.has(channel.id)) {
        throw new Error(
          `id '${channel.id}' has been taken, can't register channel ...`
        );
      } else {
        channels.set(channel.id, channel);
      }
      return () => {
        if (!channels.has(channel.id)) return;
        channels.delete(channel.id);
      };
    }, [channel]);

    return channel;
  };

  return {
    receive,
    greet,
    useChannel,
  };
};
