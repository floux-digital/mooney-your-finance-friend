import { useEffect, useState } from "react";
import { defaultMooneyData, loadMooneyData, type MooneyData } from "@/lib/mooney-data";

export function useMooneyData(): MooneyData {
  const [data, setData] = useState<MooneyData>(defaultMooneyData);

  useEffect(() => {
    setData(loadMooneyData());
  }, []);

  return data;
}
