import { GroupProps } from "@react-three/fiber";

export function ButtonHitbox(
  props: { visible?: boolean; wireframe?: boolean } & GroupProps
) {
  const { visible = false, wireframe = false } = props;
  return (
    <group {...props}>
      <mesh>
        <boxBufferGeometry args={[0.7, 0.65, 0.1]} />
        <meshBasicMaterial
          color="blue"
          visible={visible}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}
