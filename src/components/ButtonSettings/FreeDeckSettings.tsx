import React from "react";

import { IButtonSettings } from "../../App";
import { SelectWrapper, StyledSelect } from "../../lib/components/Misc";

export const FreeDeckSettings: React.FC<{
  action: IButtonSettings;
  setSetting: (setting: number) => void;
}> = ({ action, setSetting }) => {
  return (
    <>
      <SelectWrapper>
        <StyledSelect
          value={action.values[0]}
          onChange={(e) => setSetting(parseInt(e.target.value))}
        >
          <option value={-1}>Select Setting</option>
          <option value={1}>Decrease Brightness</option>
          <option value={2}>Increase Brightness</option>
        </StyledSelect>
      </SelectWrapper>
    </>
  );
};
