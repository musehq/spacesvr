import { Site } from "../index";
import { VisualWorld } from "../../world/VisualWorld";
import { Text } from "@react-three/drei";
import LookAtPlayer from "../../../../ideas/modifiers/LookAtPlayer";

type VisualSiteProps = {
  site: Site;
};

export default function VisualSite(props: VisualSiteProps) {
  const { site } = props;

  return (
    <group name="visual-site">
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
