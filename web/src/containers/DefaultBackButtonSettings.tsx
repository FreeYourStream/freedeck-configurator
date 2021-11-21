import React from "react";
import { DisplaySettingsContainer } from "./DisplaySettings";

export const DefaultBackButtonSettings: React.FC<{}> = () => {
  return <DisplaySettingsContainer displayIndex={-1} pageIndex={-1} />;
};
