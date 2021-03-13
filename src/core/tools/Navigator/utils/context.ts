import { createContext, useContext } from "react";

export type MenuStage = "welcome" | "menu" | "tutorial";

export type NavigatorState = {
  stage: MenuStage;
  setStage: (m: MenuStage) => void;
  open: boolean;
};
export const NavigatorContext = createContext<NavigatorState>(
  {} as NavigatorState
);

export function useNavigator(): NavigatorState {
  return useContext(NavigatorContext);
}
