import React from "react";

import { DisplaySettingsContainer } from "./DisplayButton/DisplaySettings";
import { LiveDataSettingsContainer } from "./DisplayButton/LiveDataSettings";

export const BackButtonLiveData: React.FC<{}> = () => {
  return <LiveDataSettingsContainer displayIndex={-1} pageId={"dbd"} />;
};
