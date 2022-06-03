import { useEffect, useMemo } from "react";
import { DataConnection } from "peerjs";

export type Message<T = any> = { conn: DataConnection; type: string; data: T };
type StorePlan = "stream" | "store";
type Callback<D = any, S = any> = (message: Message<D>) => S;
type Listener<D = any, S = any> = {
  type: string;
  plan: StorePlan;
  callback: Callback<D, S>;
};

export type DataManager = {
  useStream: <D = any, S = any>(type: string, callback: Callback<D, S>) => void;
  process: (message: Message) => void;
};

export const useDataManager = (): DataManager => {
  const listeners = useMemo<Listener[]>(() => [], []);
  const stores = useMemo(() => new Map<Listener, any>(), []);

  const useStream = <D = any, S = any>(
    type: string,
    callback: Callback<D, S>
  ) => {
    useEffect(() => {
      const listener: Listener = { type, plan: "stream", callback };
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    }, [type, callback]);
  };

  const process = (message: Message) => {
    for (const reducer of listeners) {
      if (reducer.type !== message.type) continue;
      reducer.callback(message);
    }
  };

  return {
    useStream,
    process,
  };
};
