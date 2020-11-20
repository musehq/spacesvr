import { EnvironmentState } from "./environment";

export type Portal = {
  instagram?: any;
  [x: string]: any;
};

export type Asset = {
  url: string;
  type: "video" | "image" | "3d" | "text";
  metadata?: any;
};

export interface PortalEnvironmentState extends EnvironmentState {
  portal: Portal;
}
