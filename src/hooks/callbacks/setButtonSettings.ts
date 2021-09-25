import { useCallback } from "react";

import { IButtonSettings, IButtonSettingsPage } from "../../interfaces";

export const useSetButtonSettingsCallback = (
  buttonSettingsPages: IButtonSettingsPage[],
  setButtonSettingsPages: (
    value: React.SetStateAction<IButtonSettingsPage[]>
  ) => void
) =>
  useCallback(
    (pageIndex: number, displayIndex: number, newDisplay: IButtonSettings) => {
      const newPages = [...buttonSettingsPages];
      newPages[pageIndex][displayIndex] = newDisplay;
      setButtonSettingsPages([...newPages]);
    },
    [buttonSettingsPages, setButtonSettingsPages]
  );
