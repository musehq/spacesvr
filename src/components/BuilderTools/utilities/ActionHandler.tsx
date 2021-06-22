import { Action } from "../types/types";
import { createContext, ReactNode, useContext, useMemo } from "react";

class ActionTracker {
  past: Action[];
  future: Action[];

  constructor() {
    (this.past = []), (this.future = []);
  }

  add(action: Action): void {
    this.past.push(action);
    this.future = [];
  }

  undo(): Action | void {
    if (this.past.length === 0) {
      return;
    }
    console.log(this);
    const action = this.past.pop();
    console.log(this);
    console.log(action);
    // @ts-ignore
    this.future.push(action);
    // @ts-ignore
    return action;
  }

  redo(): Action | void {
    if (this.future.length === 0) {
      return;
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
  const actionHandler = useMemo(() => {
    return new ActionTracker();
  }, []);

  return (
    <ActionContext.Provider value={actionHandler}>
      {children}
    </ActionContext.Provider>
  );
}
