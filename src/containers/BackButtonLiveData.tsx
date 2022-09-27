import React from "react";

import { DisplaySettingsContainer } from "./DisplayButton/DisplaySettings";

export const BackButtonLiveData: React.FC<{}> = () => {
  return <DisplaySettingsContainer displayIndex={-1} pageId={"dbd"} />;
};
