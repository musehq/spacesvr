import { ConnectionState } from "./connection";
import { createContext, useContext } from "react";

export type NetworkState = ConnectionState;
export const NetworkContext = createContext({} as NetworkState);
export const useNetwork = (): NetworkState => useContext(NetworkContext);
