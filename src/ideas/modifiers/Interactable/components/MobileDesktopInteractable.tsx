import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Group, Intersection, Mesh, Vector3 } from "three";
import { InteractableProps } from "../index";
import { usePlayer } from "../../../../layers/Player";
import { useLimitedFrame } from "../../../../logic/limiter";
import { useEnvironment } from "../../../../layers/Environment";
import { enableBVHRaycast } from "../../../../logic/bvh";

type Down = { start: Vector3; time: number };
const CLICK_TIMEOUT = 0.4; // seconds
const MAX_DRAG = 0.1; // meters

export default function MobileDesktopInteractable(props: InteractableProps) {
  const {
    onClick,
    onHover,
    onUnHover,
    raycaster: passedRaycaster,
    children,
  } = props;

  const gl = useThree((state) => state.gl);
  const clock = useThree((state) => state.clock);
  const { device } = useEnvironment();
  const player = usePlayer();

  const group = useRef<Group>(null);
  const down = useMemo<Down>(() => ({ start: new Vector3(), time: 0 }), []);
  const intersection = useRef<Intersection>();

  const RAYCASTER = passedRaycaster || player.raycaster;
  const DETECT_HOVER = !!onHover || !!onUnHover; // only detect hover if we have a hover handler

  const getIntersection = useCallback(() => {
    if (!group.current) return undefined;
    const intersects = RAYCASTER.intersectObject(group.current, true);
    return intersects.length > 0 ? intersects[0] : undefined;
  }, [RAYCASTER]);

  // continuously update the hover state if we have a hover handler
  useLimitedFrame(20, () => {
    if (!group.current || !DETECT_HOVER) return;

    const inter = getIntersection();
    if (inter) {
      if (!intersection.current) {
        if (onHover) onHover();
      }
      intersection.current = inter;
    } else {
      if (intersection.current) {
        intersection.current = undefined;
        if (onUnHover) onUnHover();
      }
    }
  });

  // enable bvh raycasting for children
  useEffect(() => {
    if (!group.current) return;

    group.current.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) enableBVHRaycast(mesh, 500);
    });
  }, []);

  useEffect(() => {
    const startPress = () => {
      RAYCASTER.ray.at(1, down.start);
      down.time = clock.getElapsedTime();
    };

    const endPress = () => {
      if (!onClick || !group.current) return;
      const newPos = RAYCASTER.ray.at(1, new Vector3());
      const dist = down.start.distanceTo(newPos);
      const timeDiff = clock.getElapsedTime() - down.time;
      if (dist > MAX_DRAG || timeDiff > CLICK_TIMEOUT) return;
      // either look for hover state or re-do raycast
      if (DETECT_HOVER) {
        if (intersection.current) onClick(intersection.current);
      } else {
        const inter = getIntersection();
        if (inter) onClick(inter);
      }
    };

    gl.domElement.addEventListener("mousedown", startPress);
    gl.domElement.addEventListener("mouseup", endPress);

    return () => {
      gl.domElement.removeEventListener("mousedown", startPress);
      gl.domElement.removeEventListener("mouseup", endPress);
    };
  }, [
    DETECT_HOVER,
    RAYCASTER,
    clock,
    device.mobile,
    down,
    getIntersection,
    gl.domElement,
    onClick,
  ]);

  return (
    <group name="spacesvr-interactable" ref={group}>
      {children}
    </group>
  );
}
