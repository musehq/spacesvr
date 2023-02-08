import { useRef, useState } from "react";
import { AmbientLight, Group, Light } from "three";
import { useLimitedFrame } from "../../../logic";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { useToolbelt } from "../logic/toolbelt";

type WorldLightsProps = {
  enabled?: boolean;
  directional?: boolean;
};

export default function WorldLights(props: WorldLightsProps) {
  const { enabled = true, directional } = props;

  const { scene } = useThree();
  const group = useRef<Group>(null);
  const toolbelt = useToolbelt();

  const registered = useRef<Light[]>([]);
  const [renderLights, setRenderLights] = useState<Light[]>([]);

  useLimitedFrame(1 / 2, () => {
    const newLights: Light[] = [];

    scene.traverse((obj) => {
      if (
        obj instanceof Light &&
        (!directional || obj! instanceof AmbientLight)
      ) {
        newLights.push(obj);
      }
    });

    if (
      newLights.length !== registered.current.length ||
      newLights.some((light, i) => light !== registered.current[i])
    ) {
      registered.current = newLights;
      setRenderLights(newLights.map((l) => l.clone()));
    }
  });

  useFrame(({ camera }) => {
    if (!enabled || !group.current) return;
    group.current.position.copy(camera.position);
    renderLights.forEach((light, i) => {
      light.position.copy(registered.current[i].position);
      light.quaternion.copy(registered.current[i].quaternion);
    });
  });

  return (
    <>
      {createPortal(
        <group name="world-lights" ref={group}>
          {renderLights.map((light) => (
            <primitive object={light} key={light.uuid} />
          ))}
        </group>,
        toolbelt.hudScene
      )}
    </>
  );
}
