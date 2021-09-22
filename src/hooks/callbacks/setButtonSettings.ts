import { useCallback } from "react";

import { IButton, IButtonPage } from "../../interfaces";

export const useSetButtonSettingsCallback = (
  buttonSettingsPages: IButtonPage[],
  setButtonSettingsPages: (value: React.SetStateAction<IButtonPage[]>) => void
) =>
  useCallback(
    (pageIndex: number, displayIndex: number, newDisplay: IButton) => {
      const newPages = [...buttonSettingsPages];
      newPages[pageIndex][displayIndex] = newDisplay;
      setButtonSettingsPages([...newPages]);
    },
    [buttonSettingsPages, setButtonSettingsPages]
  );
