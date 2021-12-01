import React from "react";

import { EMediaKeys, MediaKeys } from "../../../definitions/keys";
import { EAction } from "../../../definitions/modes";
import { IButtonSetting } from "../../../interfaces";
import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSelect } from "../../../lib/components/SelectInput";

export const SpecialKeys: React.FC<{
  values: IButtonSetting["values"];
  setValues: (values: IButtonSetting["values"]) => void;
}> = ({ values, setValues }) => {
  return (
    <Row>
      <Label>Key</Label>
      <FDSelect
        className="w-48"
        value={values[EAction.special_keys] ?? 0}
        onChange={(value) =>
          setValues({ ...values, [EAction.special_keys]: parseInt(value) })
        }
        options={[
          { text: "Choose key", value: 0 },
          // @ts-ignore
          ...MediaKeys.map((key) => ({ value: EMediaKeys[key], text: key })),
        ]}
      />
    </Row>
  );
};
