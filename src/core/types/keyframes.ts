import { Vector3 } from "three";
import { EnvironmentState } from "./environment";

export type TrackKeyframe = {
  label: string;
  position: Vector3;
  scale?: number;
};

export type TrackKeyframes = {
  getCurrent: () => TrackKeyframe;
  setCurrent: (id: number) => void;
  frames: TrackKeyframe[];
  currentFrame: TrackKeyframe;
  currentIndex: number;
};

export interface TrackEnvironmentState extends EnvironmentState {
  keyframes: TrackKeyframes;
}
