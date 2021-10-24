import React from "react";
import { EMediaKeys, MediaKeys } from "../../definitions/keys";
import { IButtonSetting } from "../../interfaces";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";

export const SpecialKeys: React.FC<{
  action: IButtonSetting;
  setKeys: (keys: number[]) => void;
}> = ({ action, setKeys }) => {
  return (
    <Row>
      <Label>Key</Label>
      <StyledSelect
        className="w-40"
        value={action.values[0] ?? 0}
        onChange={(value) => setKeys([parseInt(value)])}
        options={[
          { text: "Choose key", value: 0 },
          // @ts-ignore
          ...MediaKeys.map((key) => ({ value: EMediaKeys[key], text: key })),
        ]}
      />
    </Row>
  );
};
