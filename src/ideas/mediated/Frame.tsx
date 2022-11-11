import { useMemo } from "react";
import {
  BoxBufferGeometry,
  BufferGeometry,
  Material,
  MeshStandardMaterial,
} from "three";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

type FrameProps = {
  width: number;
  height: number;
  thickness?: number;
  material?: Material;
  innerFrameMaterial?: Material;
};

/**
 *
 * Builds a frame for a mesh with a texture (image, video, etc.)
 *
 * In the code, the frame is the back panel and the border is the
 * four meshes that make up the top, left, right, and bottom sides
 * of the border.
 *
 * @param props
 * @constructor
 */
export function Frame(props: FrameProps) {
  const {
    width,
    height,
    thickness = 1,
    material: passedMaterial,
    innerFrameMaterial,
  } = props;

  const material = useMemo(
    () =>
      passedMaterial ||
      new MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.8,
        metalness: 0.05,
      }),
    [passedMaterial]
  );

  const frameDepth = 0.075;
  const frameWidth = 0.06;
  const borderDepth = 0.08;
  const borderThickness = 0.05 * thickness;
  const meshOffset = 0.0005;

  const geometry = useMemo<BufferGeometry>(() => {
    const backPanel = new BoxBufferGeometry(
      width + frameWidth,
      height + frameWidth,
      frameDepth
    );
    backPanel.translate(0, 0, -frameDepth - meshOffset);

    const topFrame = new BoxBufferGeometry(
      width + frameWidth,
      borderThickness,
      borderDepth
    );
    topFrame.translate(0, height / 2 + frameWidth / 2 - borderThickness / 2, 0);

    const bottomFrame = new BoxBufferGeometry(
      width + frameWidth,
      borderThickness,
      borderDepth
    );
    bottomFrame.translate(
      0,
      -height / 2 - frameWidth / 2 + borderThickness / 2,
      0
    );

    const leftFrame = new BoxBufferGeometry(
      borderThickness,
      height + frameWidth,
      borderDepth
    );
    leftFrame.translate(
      -width / 2 - frameWidth / 2 + borderThickness / 2,
      0,
      0
    );

    const rightFrame = new BoxBufferGeometry(
      borderThickness,
      height + frameWidth,
      borderDepth
    );
    rightFrame.translate(
      width / 2 + frameWidth / 2 - borderThickness / 2,
      0,
      0
    );

    const geos = [backPanel, topFrame, bottomFrame, leftFrame, rightFrame];

    const geo = mergeBufferGeometries(geos);

    backPanel.dispose();
    topFrame.dispose();
    bottomFrame.dispose();
    leftFrame.dispose();
    rightFrame.dispose();

    return geo;
  }, [innerFrameMaterial, borderThickness, width, height]);

  const backFrameGeometry = useMemo<BufferGeometry | undefined>(() => {
    if (!innerFrameMaterial) return undefined;

    const backPanel = new BoxBufferGeometry(
      width + frameWidth,
      height + frameWidth,
      frameDepth
    );
    backPanel.translate(0, 0, -frameDepth - meshOffset);

    return backPanel;
  }, [innerFrameMaterial, width, height]);

  return (
    <group name="spacesvr-frame">
      <mesh geometry={geometry} material={material} />
      {backFrameGeometry && innerFrameMaterial && (
        <mesh geometry={backFrameGeometry} material={innerFrameMaterial} />
      )}
    </group>
  );
}
