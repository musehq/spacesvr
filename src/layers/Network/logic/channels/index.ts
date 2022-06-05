import { DataConnection } from "peerjs";
import { useEffect, useMemo } from "react";
import { StreamChannel } from "./StreamChannel";
import { SyncChannel } from "./SyncChannel";

export type Message<T = any> = { conn: DataConnection; id: string; data: T };

export type Reducer<Data = any, State = Data> = (
  message: Message<Data>,
  state: State
) => void;

export interface Channel<Data = any, State = Data> {
  id: string;
  state: State;
  send: (data: Data) => void;
  listen: (message: Message<Data>) => void;
}

type ChannelType = "stream" | "sync";
export type Channels = {
  listen: (message: Message) => void;
  greet: (conn: DataConnection) => void;
  useChannel: <Data = any, State = Data>(
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

  const listen = (message: Message) => {
    for (const [id, channel] of channels.entries()) {
      if (id == message.id) {
        channel.listen(message);
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

  const useChannel = <Data = any, State = Data>(
    id: string,
    type: ChannelType,
    reducer: Reducer<Data, State>
  ): Channel<Data, State> => {
    const channel = useMemo(() => {
      if (type === "stream") return new StreamChannel(id, reducer, connections);
      if (type === "sync") return new SyncChannel(id, reducer, connections);
      return new StreamChannel(id, reducer, connections);
    }, [id, type, reducer]);

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
    listen,
    greet,
    useChannel,
  };
};
