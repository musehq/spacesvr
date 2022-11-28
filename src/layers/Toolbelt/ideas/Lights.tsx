export default function Lights() {
  return (
    <group name="lights">
      <ambientLight intensity={Math.PI * 0.5} />
      <pointLight intensity={Math.PI * 0.5} />
    </group>
  );
}
