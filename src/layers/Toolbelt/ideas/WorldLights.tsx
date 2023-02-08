import { useRef } from "react";
import { AmbientLight, Group, Light } from "three";
import { useLimitedFrame, useRerender } from "../../../logic";
import { createPortal, useThree } from "@react-three/fiber";
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
  const rerender = useRerender();

  const trackedLights = useRef<Light[]>([]);
  const renderedLights = useRef<Light[]>([]);

  useLimitedFrame(1 / 2, () => {
    const sceneLights: Light[] = [];

    scene.traverse((obj) => {
      if (
        obj instanceof Light &&
        (!directional || obj! instanceof AmbientLight)
      ) {
        sceneLights.push(obj);
      }
    });

    let changed = false;

    for (const light of sceneLights) {
      // if light is not rendered, register it
      if (
        !renderedLights.current.find((obj) => obj.userData.uuid === light.uuid)
      ) {
        const newLight = light.clone();
        newLight.userData.uuid = light.uuid;
        renderedLights.current.push(newLight);
        changed = true;
      }
    }

    // if light is rendered but not in scene, unregister it
    for (const light of renderedLights.current) {
      if (!sceneLights.find((obj) => obj.uuid === light.userData.uuid)) {
        renderedLights.current.splice(renderedLights.current.indexOf(light), 1);
        light.dispose();
        changed = true;
      }
    }

    if (changed) {
      rerender();
      trackedLights.current = sceneLights;
    }
  });

  useLimitedFrame(30, ({ camera }) => {
    if (!enabled || !group.current) return;
    group.current.position.copy(camera.position);
    renderedLights.current.forEach((light) => {
      const trackedLight = trackedLights.current.find(
        (li) => li.uuid === light.userData.uuid
      );
      if (!trackedLight) return;

      light.matrixWorld.copy(trackedLight.matrixWorld);
    });
  });

  return (
    <>
      {createPortal(
        <group name="world-lights" ref={group}>
          {renderedLights.current.map((light) => (
            <primitive object={light} key={light.uuid} />
          ))}
        </group>,
        toolbelt.hudScene
      )}
    </>
  );
}
