import { createContext, useContext } from "react";
import { PlayerState } from "../types";

export const PlayerContext = createContext<PlayerState>({} as PlayerState);

export function usePlayer() {
  return useContext(PlayerContext);
}
