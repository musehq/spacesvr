import { PhysicsProps as ProviderProps } from "@react-three/cannon";
import { ReactNode, Suspense } from "react";
import { Physics as PhysicsProvider } from "@react-three/cannon";

const defaultPhysicsProps: Partial<ProviderProps> = {
  size: 50,
  allowSleep: false,
  gravity: [0, -9.8, 0],
  defaultContactMaterial: {
    friction: 0,
  },
};

export type PhysicsProps = Partial<ProviderProps>;
type PhysicsLayerProps = { children: ReactNode | ReactNode[] } & PhysicsProps;

export function Physics(props: PhysicsLayerProps) {
  const { children, ...physicsProps } = props;

  return (
    <PhysicsProvider {...defaultPhysicsProps} {...physicsProps}>
      {/* physics is wrapped in a suspense so if a suspense bubbles all the way up here */}
      {/* the physics will remount, lose its state, and cause serious problems. */}
      {/*  */}
      {/* solution: wrap the children in a suspense. */}
      <Suspense fallback={null}>{children}</Suspense>
    </PhysicsProvider>
  );
}
