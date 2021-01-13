export type SimulationState = {
  signalHost: string;
  signalPort: number;
  signalPath: string;
  connected: boolean;
  sendEvent: (type: string, data: any) => void;
};

// export type SimulationData = {
//   id: {
//     position: {
//       x: number;
//       y: number;
//       z: number;
//     },
//     rotation: {
//       _x: number;
//       _y: number;
//       _z: number;
//       _order: number;
//     }
//   }
// };
