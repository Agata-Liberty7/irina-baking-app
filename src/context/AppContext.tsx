import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"; 

export type Region = "spain" | "russia" | "italy" | "france" | "germany" | "usa";
export type Climate = "dry" | "moderate" | "humid";
export type MixingMethod = "manual" | "planetary" | "spiral";
export type ProductionMode = "home" | "pro";

type AppContextType = {
  region: Region;
  setRegion: (value: Region) => void;
  climate: Climate;
  setClimate: (value: Climate) => void;
  mixing: MixingMethod;
  setMixing: (value: MixingMethod) => void;
  productionMode: ProductionMode;
  setProductionMode: (value: ProductionMode) => void;
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
  const [region, setRegion] = useState<Region>("spain");
  const [climate, setClimate] = useState<Climate>("moderate");
  const [mixing, setMixing] = useState<MixingMethod>("planetary");
  const [productionMode, setProductionMode] = useState<ProductionMode>("home");

  return (
    <AppContext.Provider
      value={{
        region,
        setRegion,
        climate,
        setClimate,
        mixing,
        setMixing,
        productionMode,
        setProductionMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
