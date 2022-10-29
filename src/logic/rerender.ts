import { useCallback, useState } from "react";

/**
 * A hook that provides a function to re-render the component.
 *
 * You can use the function itself as a dependency.
 */
export function useRerender(): () => void {
  const [ct, setCt] = useState(0);
  return useCallback(() => setCt(Math.random()), [ct]);
}
