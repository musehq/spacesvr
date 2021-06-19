import { Action } from "../types/types";
import { createContext, ReactNode, useContext } from "react";

class ActionTracker {
  past: Action[];
  future: Action[];

  constructor() {
    (this.past = []), (this.future = []);
  }

  add(action: Action): boolean {
    this.past.push(action);
    this.future = [];
    return true;
  }

  undo(): Action | false {
    if (this.past.length === 0) {
      return false;
    }
    const action = this.past.pop();
    // @ts-ignore
    this.future.push(action);
    // @ts-ignore
    return action;
  }

  redo(): Action | false {
    if (this.future.length === 0) {
      return false;
    }
    const action = this.future.pop();
    // @ts-ignore
    this.past.push(action);
    // @ts-ignore
    return action;
  }
}

const ActionContext = createContext<ActionTracker>({} as ActionTracker);
export function useActions() {
  return useContext(ActionContext);
}

export function ActionHandler(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <ActionContext.Provider value={new ActionTracker()}>
      {children}
    </ActionContext.Provider>
  );
}
