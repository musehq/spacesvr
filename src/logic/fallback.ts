import { CanvasTexture } from "three";

let fallbackTexture: CanvasTexture | undefined;

const SIZE = 128;
const SIZE_2 = SIZE / 2;
const RAD = 12;
const LINE_W = 1;

/**
 * Provides a default texture that is created locally
 */
export function getFallbackTexture(): CanvasTexture {
  if (fallbackTexture) return fallbackTexture;

  const canvas = document.createElement("canvas");
  canvas.height = SIZE;
  canvas.width = SIZE;

  const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, SIZE, SIZE);

  // main circle
  context.fillStyle = "#000000";
  context.beginPath();
  context.arc(SIZE_2, SIZE_2, RAD, 0, 2 * Math.PI);
  context.fill();

  // draw a white line down the middle of the circle
  context.strokeStyle = "#FFFFFF";
  context.lineWidth = Math.ceil(LINE_W);
  context.beginPath();
  context.moveTo(SIZE_2, SIZE_2 - RAD);
  context.lineTo(SIZE_2, SIZE_2 + RAD);
  context.stroke();

  // draw a horizontal line across the middle of the circle
  context.beginPath();
  context.moveTo(SIZE_2 - RAD, SIZE_2);
  context.lineTo(SIZE_2 + RAD, SIZE_2);
  context.stroke();

  fallbackTexture = new CanvasTexture(canvas);

  return fallbackTexture;
}
