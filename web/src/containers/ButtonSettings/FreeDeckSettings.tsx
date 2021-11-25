import React from "react";

import { FDSettings, IButtonSetting } from "../../interfaces";
import { Label, Value } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { FDSlider } from "../../lib/components/Slider";

export const FreeDeckSettings: React.FC<{
  values: IButtonSetting["values"];
  setValues: (values: IButtonSetting["values"]) => void;
}> = ({ values, setValues }) => {
  return (
    <>
      <Row>
        <Label>Setting</Label>
        <StyledSelect
          className="w-40"
          value={values.settings.setting}
          onChange={(value) =>
            setValues({
              ...values,
              settings: { ...values.settings, setting: value },
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
      {values.settings.setting === FDSettings.absolute_brightness && (
        <Row>
          <FDSlider
            value={values.settings.value || 128}
            min={1}
            max={255}
            onChange={(e) =>
              setValues({
                ...values,
                settings: { ...values.settings, value: e.target.valueAsNumber },
              })
            }
          />
          <Value>
            {(((values.settings.value || 128) / 255) * 100).toFixed(0)}%
          </Value>
        </Row>
      )}
    </>
  );
};
