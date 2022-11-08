import {
  BoxBufferGeometry,
  CanvasTexture,
  Group,
  Mesh,
  MeshStandardMaterial,
} from "three";
import { GLTF } from "three-stdlib";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

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

/**
 * Provides a default model
 */
export function getFallbackModel(): Promise<GLTF> {
  const group = new Group();
  const geo = new BoxBufferGeometry(1, 1, 1);
  const mat = new MeshStandardMaterial({ color: "black", wireframe: true });
  const mesh = new Mesh(geo, mat);
  group.add(mesh);

  const exporter = new GLTFExporter();
  const loader = new GLTFLoader();
  return new Promise((res) =>
    exporter.parse(
      group,
      (gltf) => {
        loader.parse(
          gltf as ArrayBuffer,
          "",
          // @ts-ignore
          (gltf) => res(gltf as GLTF),
          (err) => console.error(err)
        );
      },
      {
        binary: true,
        embedImages: true,
        onlyVisible: false,
      }
    )
  );
}
