export type SimulationState = {
  signalHost: string;
  signalPort: number;
  signalPath: string;
  connected: boolean;
  sendEvent: (type: string, data: any) => void;
};
