import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; 

export type Climate = "dry" | "moderate" | "humid";
export type MixingMethod = "manual" | "planetary" | "spiral";
export type ProductionMode = "home" | "pro";

type AppContextType = {
  climate: Climate;
  setClimate: (value: Climate) => void;

  mixing: MixingMethod;
  setMixing: (value: MixingMethod) => void;

  productionMode: ProductionMode;
  setProductionMode: (value: ProductionMode) => void;

  roomTemp: number;
  setRoomTemp: (value: number) => void;

  warmFermentationHours: number;
  setWarmFermentationHours: (value: number) => void;

  coldFermentationHours: number;
  setColdFermentationHours: (value: number) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [climate, setClimate] = useState<Climate>("moderate");
  const [mixing, setMixing] = useState<MixingMethod>("planetary");
  const [productionMode, setProductionMode] = useState<ProductionMode>("home");

  const [roomTemp, setRoomTemp] = useState<number>(24);

  // Новые параметры
  const [warmFermentationHours, setWarmFermentationHours] = useState<number>(1);
  const [coldFermentationHours, setColdFermentationHours] = useState<number>(0);

  return (
    <AppContext.Provider
      value={{
        climate,
        setClimate,
        mixing,
        setMixing,
        productionMode,
        setProductionMode,
        roomTemp,
        setRoomTemp,
        warmFermentationHours,
        setWarmFermentationHours,
        coldFermentationHours,
        setColdFermentationHours,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
