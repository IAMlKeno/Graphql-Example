import React, { createContext, useContext, useState } from "react";

export enum AppTypeEnum {
  QUOTE_APP,
  RICK_APP
}

interface SelectedAppContextType {
  selectedApp: AppTypeEnum;
  setSelectedApp: (selectedApp: AppTypeEnum) => void;
}

const AppSelectorContext = createContext<SelectedAppContextType | undefined>(undefined);

export const AppSelectorProvider = ({children}: {children: React.ReactNode}) => {
  const [selectedApp, setSelectedApp] = useState<AppTypeEnum>(AppTypeEnum.QUOTE_APP);

  return (
    <AppSelectorContext.Provider value={{ selectedApp, setSelectedApp }}>
      {children}
    </AppSelectorContext.Provider>
  );
}

export const useAppSelector = () => {
  const context = useContext(AppSelectorContext);
  return context;
}