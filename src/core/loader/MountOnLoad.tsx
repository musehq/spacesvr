import { LoadingContext } from "../contexts/loading";
import { ReactNode, useContext } from "react";

/**
 * Mounts its children only once the environment's assets
 * have finished downloading.
 *
 * Or, if using the legacy loader, mounts immediately
 *
 * @param props
 * @constructor
 */
export const MountOnLoad = (props: { children: ReactNode }) => {
  const { children } = props;

  const { legacyLoader, percentage } = useContext(LoadingContext);

  if (!legacyLoader && percentage !== 1) {
    return null;
  }

  return <>{children}</>;
};
