import { useEnvironment } from "../utils/hooks";
import { useRef, useState } from "react";
import { Group, MeshNormalMaterial } from "three";
import { useFrame } from "react-three-fiber";

const ENTITY_DATA: Entities[] = [
  { uuid: "1", position: [0, 6, 2], rotation: [Math.PI / 2, 0, -Math.PI / 4] },
  { uuid: "2", position: [-2, 11, 4], rotation: [0, -Math.PI / 4, 0] },
  {
    uuid: "3",
    position: [11, 3, -2],
    rotation: [-Math.PI, Math.PI / 2, 0],
  },
];

type Entities = {
  uuid: string;
  position: [number, number, number];
  rotation: [number, number, number];
};

type AvatarProps = {
  uuid: string;
};

const EntityAvatar = (props: AvatarProps) => {
  const { uuid } = props;
  const entityData = ENTITY_DATA; // simulation.getData("players")
  const entity = entityData.find((ent) => ent.uuid == uuid);

  if (!entity) {
    return null;
  }

  const { position, rotation } = entity;

  return (
    <group name={`entity-${uuid}`}>
      <mesh position={position} rotation={rotation}>
        <cylinderBufferGeometry args={[0.3, 0.3, 1, 30]} />
        <meshNormalMaterial />
      </mesh>
    </group>
  );
};

const Entity = () => {
  const { simulation } = useEnvironment();

  const [entityIds, setEntityIds] = useState<Array<string>>([]);

  // every frame, check for a change in player list, re-render if there is a change
  useFrame(() => {
    if (simulation.connected) {
      const entityData = ENTITY_DATA; // simulation.getData("players")
      const ids = entityData.map((ent) => ent.uuid);
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

export default Entity;
