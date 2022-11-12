export default function Lights() {
  return (
    <group name="lights">
      <ambientLight intensity={0.5} />
      <pointLight intensity={0.5} />
    </group>
  );
}
