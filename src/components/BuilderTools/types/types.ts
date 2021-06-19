export type ControlType = null | "position" | "rotation" | "scale" | "color";
export type Action = {
  objectName: string;
  attribute: string;
  value: any;
};
