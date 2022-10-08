import { Site } from "../../../logic/basis/site";
import { VisualWorld } from "../VisualWorld";
import { Text } from "@react-three/drei";
import { LookAtPlayer } from "../../modifiers/LookAtPlayer";
import { GroupProps } from "@react-three/fiber";

type VisualSiteProps = { site: Site } & GroupProps;

export default function VisualSite(props: VisualSiteProps) {
  const { site, ...rest } = props;

  return (
    <group name="spacesvr-basis-site" {...rest}>
      <VisualWorld world={site.world} />
      <LookAtPlayer>
        <Text
          position-z={1}
          anchorX="left"
          fontSize={0.35}
          color="white"
          outlineWidth={0.025}
          rotation-y={-Math.PI / 2}
        >
          /{site.slug}
        </Text>
      </LookAtPlayer>
    </group>
  );
}
