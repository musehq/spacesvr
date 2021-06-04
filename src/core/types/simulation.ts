export type SimulationState = {
  connected: boolean;
  frequency: number;
  sendEvent: (type: string, data: any) => void;
  fetch: (type: string) => Map<string, Entity>;
};

export type SimulationProps = {
  signalHost?: string;
  signalPort?: number;
  signalPath?: string;
  socketServer?: string;
  frequency?: number;
  audio?: boolean;
};

export type Entity = {
  position: [number, number, number];
  rotation: [number, number, number];
};
