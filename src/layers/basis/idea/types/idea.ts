export type Type = {
  name: string;
  type:
    | "string"
    | "image"
    | "color"
    | "position"
    | "rotation"
    | "scale"
    | "vector3"
    | "video"
    | "boolean"
    | "number"
    | "react";
  default?: any;
};

export type Schema = Type[];

export type NpmDependencies = {
  [key: string]: string;
};
