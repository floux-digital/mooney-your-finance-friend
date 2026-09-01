import { useCallback, useEffect, useState } from "react";
import {
  defaultMooneyData,
  loadMooneyData,
  MOONEY_STORAGE_KEY,
  MOONEY_UPDATED_EVENT,
  type MooneyData,
} from "@/lib/mooney-data";

export function useMooneyData(): MooneyData {
  const [data, setData] = useState<MooneyData>(defaultMooneyData);

  const sync = useCallback(() => setData(loadMooneyData()), []);

  useEffect(() => {
    sync();
    const onStorage = (e: StorageEvent) => {
      if (!e.key || e.key === MOONEY_STORAGE_KEY) sync();
    };
    window.addEventListener(MOONEY_UPDATED_EVENT, sync);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(MOONEY_UPDATED_EVENT, sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [sync]);

  return data;
}
