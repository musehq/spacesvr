import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Group, Intersection, Mesh, Vector2 } from "three";
import { InteractableProps } from "../index";
import { usePlayer } from "../../../../layers/Player";
import { useLimitedFrame } from "../../../../logic/limiter";
import { useEnvironment } from "../../../../layers/Environment";
import { enableBVHRaycast } from "../../../../logic/bvh";

export default function MobileDesktopInteractable(props: InteractableProps) {
  const {
    onClick,
    onHover,
    onUnHover,
    raycaster: passedRaycaster,
    children,
  } = props;

  const gl = useThree((state) => state.gl);
  const { device } = useEnvironment();
  const player = usePlayer();

  const group = useRef<Group>(null);
  const downPos = useMemo(() => new Vector2(), []);
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

  // handle mouse up or touch end
  const endPress = useCallback(
    (x: number, y: number) => {
      if (!onClick || !group.current) return;
      const dist = downPos.distanceTo(new Vector2(x, y));
      if (dist > 5) return;
      // either look for hover state or re-do raycast
      if (DETECT_HOVER) {
        if (intersection.current) onClick(intersection.current);
      } else {
        const inter = getIntersection();
        if (inter) onClick(inter);
      }
    },
    [DETECT_HOVER, downPos, getIntersection, onClick]
  );

  // enable bvh raycasting for children
  useEffect(() => {
    if (!group.current) return;

    group.current.traverse((obj) => {
      const mesh = obj as Mesh;
      if (mesh.isMesh) enableBVHRaycast(mesh, 500);
    });
  }, []);

  useEffect(() => {
    if (device.mobile) {
      const onTouchStart = (e: TouchEvent) =>
        downPos.set(e.touches[0].clientX, e.touches[0].clientY);

      const onTouchEnd = (e: TouchEvent) =>
        endPress(e.changedTouches[0].clientX, e.changedTouches[0].clientY);

      gl.domElement.addEventListener("touchstart", onTouchStart);
      gl.domElement.addEventListener("touchend", onTouchEnd);

      return () => {
        gl.domElement.removeEventListener("touchstart", onTouchStart);
        gl.domElement.removeEventListener("touchend", onTouchEnd);
      };
    }

    const onMouseDown = (e: MouseEvent) => downPos.set(e.clientX, e.clientY);
    const onMouseUp = (e: MouseEvent) => endPress(e.clientX, e.clientY);

    gl.domElement.addEventListener("mousedown", onMouseDown);
    gl.domElement.addEventListener("mouseup", onMouseUp);

    return () => {
      gl.domElement.removeEventListener("mousedown", onMouseDown);
      gl.domElement.removeEventListener("mouseup", onMouseUp);
    };
  }, [device.mobile, downPos, endPress, gl.domElement]);

  return (
    <group name="spacesvr-interactable" ref={group}>
      {children}
    </group>
  );
}
