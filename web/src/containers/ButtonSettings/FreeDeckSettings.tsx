import React from "react";

import { FDSettings, IButtonSetting } from "../../interfaces";
import { Label, Value } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { FDSlider } from "../../lib/components/Slider";

export const FreeDeckSettings: React.FC<{
  action: IButtonSetting;
  setSetting: (setting: FDSettings, value?: number) => void;
}> = ({ action, setSetting }) => {
  return (
    <>
      <Row>
        <Label>Setting</Label>
        <StyledSelect
          className="w-40"
          value={action.values.settings.setting}
          onChange={(value) => setSetting(value)}
          options={[
            { text: "Select Setting", value: "" },
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
      {action.values.settings.setting === FDSettings.absolute_brightness && (
        <Row>
          <FDSlider
            value={action.values.settings.value || 128}
            min={1}
            max={255}
            onChange={(e) =>
              setSetting(FDSettings.absolute_brightness, e.target.valueAsNumber)
            }
          />
          <Value>
            {(((action.values.settings.value || 128) / 255) * 100).toFixed(0)}%
          </Value>
        </Row>
      )}
    </>
  );
};
