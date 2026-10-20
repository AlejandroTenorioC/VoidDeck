import { useEffect, useState } from "react";
import { checkForUpdate, type UpdateCheck } from "./check";

/** Live update state for the Quick Access panel: one check on mount, reused until the panel remounts. */
export function useUpdateCheck(current: string): UpdateCheck | null {
  const [update, setUpdate] = useState<UpdateCheck | null>(null);

  useEffect(() => {
    let alive = true;
    void checkForUpdate(current).then((result) => {
      if (alive) setUpdate(result);
    });
    return () => {
      alive = false;
    };
  }, [current]);

  return update;
}
