import { useEnhance } from "../../layers/Enhance";
import { ReactNode } from "react";

type EnhanceVisualsProps = {
  index: number;
  children: ReactNode | ReactNode[];
};

export default function EnhanceVisuals(props: EnhanceVisualsProps) {
  const { index, children } = props;

  const enhance = useEnhance();

  return enhance.createEnhancePortal(children, index);
}
