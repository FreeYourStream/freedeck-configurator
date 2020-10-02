import React from "react";

import { IButtonSettings } from "../../App";
import { EMediaKeys, MediaKeys } from "../../definitions/keys";
import { SelectWrapper, StyledSelect } from "../../lib/components/Misc";

export const SpecialKeys: React.FC<{
  action: IButtonSettings;
  setKeys: (keys: number[]) => void;
}> = ({ action, setKeys }) => {
  return (
    <>
      <SelectWrapper>
        <StyledSelect
          value={action.values[0]}
          onChange={(e) => setKeys([parseInt(e.target.value)])}
        >
          <option key={0} value={0}>
            Choose Key
          </option>
          {MediaKeys.map((enumKey) => (
            //@ts-ignore
            <option key={enumKey} value={EMediaKeys[enumKey]}>
              {enumKey}
            </option>
          ))}
        </StyledSelect>
      </SelectWrapper>
    </>
  );
};
