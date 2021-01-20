export type SimulationState = {
  signalHost: string;
  signalPort: number;
  signalPath: string;
  connected: boolean;
  frequency: number;
  sendEvent: (type: string, data: any) => void;
  fetch: (type: string) => Map<string, Entity>;
};

export type Entity = {
  position: [number, number, number];
  rotation: [number, number, number];
};
