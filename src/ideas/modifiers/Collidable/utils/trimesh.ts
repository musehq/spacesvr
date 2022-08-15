import { useTrimesh } from "@react-three/cannon";
import {
  BufferAttribute,
  BufferGeometry,
  InterleavedBufferAttribute,
} from "three";

export const useTrimeshCollision = (geometry: BufferGeometry) => {
  const indices = (geometry.index as BufferAttribute).array as number[];

  const isInterleaved =
    // @ts-ignore
    geometry.attributes.position.isInterleavedBufferAttribute;

  let vertices: number[] = [];
  if (isInterleaved) {
    const attr = geometry.attributes.position as InterleavedBufferAttribute;
    const data = attr.data;
    for (let i = attr.offset; i < data.array.length; i += data.stride) {
      for (let x = 0; x < attr.itemSize; x++) {
        vertices.push(data.array[i + x]);
      }
    }
  } else {
    vertices = (geometry.attributes.position as BufferAttribute)
      .array as number[];
  }

  return useTrimesh(
    () => ({
      type: "Static",
      args: [vertices, indices],
    }),
    undefined,
    [geometry.uuid]
  );
};
