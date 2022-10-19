import { FacePlayer, Anchor, Button } from "spacesvr";
import { GroupProps } from "@react-three/fiber";

type LinkProps = {
  href: string;
  children: string;
} & GroupProps;

export default function Link(props: LinkProps) {
  const { href, children, ...rest } = props;

  return (
    <group name={`link-${href}`} {...rest}>
      <FacePlayer>
        <Anchor href={href}>
          <Button maxWidth={0.4}>{children}</Button>
        </Anchor>
      </FacePlayer>
    </group>
  );
}
