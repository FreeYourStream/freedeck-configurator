import React from "react";

import { DisplaySettingsContainer } from "./DisplayButton/DisplaySettings";

export const DefaultBackButtonSettings: React.FC<{}> = () => {
  return <DisplaySettingsContainer displayIndex={-1} pageId={"dbd"} />;
};
