import React from "react";
import { EMediaKeys, MediaKeys } from "../../definitions/keys";
import { IButtonSetting } from "../../interfaces";
import { StyledSelect } from "../../lib/components/SelectInput";

export const SpecialKeys: React.FC<{
  action: IButtonSetting;
  setKeys: (keys: number[]) => void;
}> = ({ action, setKeys }) => {
  return (
    <>
      <StyledSelect
        className="mt-2"
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
    </>
  );
};
