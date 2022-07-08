import React from "react";

import { EAction, FDSettings } from "../../../definitions/modes";
import { ButtonSetting } from "../../../generated";
import { Label, Value } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSelect } from "../../../lib/components/SelectInput";
import { FDSlider } from "../../../lib/components/Slider";

export const FreeDeckSettings: React.FC<{
  values: ButtonSetting["values"];
  setValues: (values: ButtonSetting["values"]) => void;
}> = ({ values, setValues }) => {
  return (
    <>
      <Row>
        <Label>Setting</Label>
        <FDSelect
          className="w-48"
          value={values[EAction.settings].setting}
          onChange={(value) =>
            setValues({
              ...values,
              [EAction.settings]: {
                ...values[EAction.settings],
                setting: value,
              },
            })
          }
          options={[
            { text: "Select Setting", value: -1 },
            {
              text: "Decrease Brightness",
              value: FDSettings.change_brightness,
            },
            {
              text: "Increase Brightness",
              value: FDSettings.change_brightness,
            },
            { text: "Set Brightness", value: FDSettings.absolute_brightness },
          ]}
        />
      </Row>
      {values[EAction.settings].setting === FDSettings.absolute_brightness && (
        <Row>
          <FDSlider
            value={values[EAction.settings].value || 128}
            min={1}
            max={255}
            onChange={(e) =>
              setValues({
                ...values,
                [EAction.settings]: {
                  ...values[EAction.settings],
                  value: e.target.valueAsNumber,
                },
              })
            }
          />
          <Value>
            {(((values[EAction.settings].value || 128) / 255) * 100).toFixed(0)}
            %
          </Value>
        </Row>
      )}
    </>
  );
};
