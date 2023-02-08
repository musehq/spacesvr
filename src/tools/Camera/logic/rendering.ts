import { MutableRefObject, RefObject, useEffect, useMemo, useRef } from "react";
import { useLimitedFrame } from "../../../logic";
import { Group, Mesh, PerspectiveCamera, Quaternion, Vector3 } from "three";
import { useEnvironment } from "../../../layers/Environment";
import { useThree } from "@react-three/fiber";
import { Photography } from "./photo";

export const useRendering = (
  enabled: boolean,
  cam: MutableRefObject<PerspectiveCamera | undefined>,
  group: RefObject<Group>,
  mesh: RefObject<Mesh>,
  photo: Photography
) => {
  const { paused } = useEnvironment();
  const { scene } = useThree();

  const dummy = useMemo(() => new Vector3(), []);
  const qummy = useMemo(() => new Quaternion(), []);

  // prep render the camera until first pause to compile materials in advance rather than first time tool is enabled
  const prepRendering = useRef(true);
  useEffect(() => {
    if (!paused) prepRendering.current = false;
  }, [paused]);
  useLimitedFrame(1 / 4, (state) => {
    if (enabled || !prepRendering.current || !cam.current) return; // don't double render
    state.gl.autoClear = true;
    state.gl.setRenderTarget(photo.target);
    state.gl.render(scene, cam.current);
    state.gl.setRenderTarget(null);
    state.gl.autoClear = false;
  });

  useLimitedFrame(24, (state) => {
    if (!cam.current || !mesh.current || !group.current || !enabled) return;

    // move mesh to camera's position
    mesh.current.getWorldPosition(dummy);
    mesh.current.getWorldQuaternion(qummy);
    cam.current.position.set(0, 0, 0.3).applyQuaternion(qummy); // move back 0.3m
    cam.current.position.add(dummy);
    cam.current.rotation.setFromQuaternion(qummy);

    cam.current.aspect = photo.aspect.x / photo.aspect.y;
    cam.current.updateProjectionMatrix();

    // render to camera viewfinder
    state.gl.autoClear = true;
    state.gl.setRenderTarget(photo.target);
    state.gl.render(scene, cam.current);
    state.gl.setRenderTarget(null);
    state.gl.autoClear = false;
  });
};
