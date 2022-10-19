import { FacePlayer, Image } from "spacesvr";
import { GroupProps } from "@react-three/fiber";
import { Text } from "@react-three/drei";

type LinkProps = {
  children: string;
  image?: string;
} & GroupProps;

const FONT = "https://d27rt3a60hh1lx.cloudfront.net/fonts/Quicksand_Bold.otf";

export default function Title(props: LinkProps) {
  const { children, image, ...rest } = props;

  return (
    <group name="title" {...rest}>
      <FacePlayer>
        {image && (
          <Image src={image} position-z={-0.01} scale={3} position-y={0.25} />
        )}
        <Text color="black" font={FONT} fontSize={0.2}>
          {children}
        </Text>
      </FacePlayer>
    </group>
  );
}
