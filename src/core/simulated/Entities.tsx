import { useEnvironment } from "../utils/hooks";
import { useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import { Mesh } from "three";

type EntityAvatarProps = {
  uuid: string;
};

// avatar retrieves entity information itself to not re-mount mesh every frame
const EntityAvatar = (props: EntityAvatarProps) => {
  const { uuid } = props;
  const { simulation } = useEnvironment();

  const mesh = useRef<Mesh>();

  // retrieve player information every frame and update pos/rot
  useFrame(() => {
    const entityData = simulation.fetch("entities");
    const entity = entityData.get(uuid);

    if (mesh.current && entity) {
      // TODO: REMOVE MESHES ON DC
      // TODO: SNAPSHOT INTERPOLATION
      // TODO: ONLY UPDATE ON CHANGE

      mesh.current.position.fromArray(entity.position);
      mesh.current.rotation.fromArray(entity.rotation);
    }
  });

  return (
    <mesh name={`entity-${uuid}`} ref={mesh}>
      <cylinderBufferGeometry args={[0.3, 0.3, 1, 30]} />
      <meshNormalMaterial />
    </mesh>
  );
};

const Entities = () => {
  const { simulation } = useEnvironment();

  const [entityIds, setEntityIds] = useState<Array<string>>([]);

  // every frame, check for a change in player list, re-render if there is a change
  useFrame(() => {
    if (simulation.connected) {
      const entities = simulation.fetch("entities");
      const ids = Array.from(entities.keys());
      const sameIds = ids.sort().join(",") === entityIds.sort().join(",");
      if (!sameIds) {
        setEntityIds(ids);
      }
    }
  });

  if (!simulation.connected) {
    return null;
  }

  return (
    <group>
      {entityIds.map((uuid) => (
        <EntityAvatar key={uuid} uuid={uuid} />
      ))}
    </group>
  );
};

export default Entities;
