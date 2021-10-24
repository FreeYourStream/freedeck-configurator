import React from "react";
import { IButtonSetting } from "../../interfaces";
import { Label, Value } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { FDSlider } from "../../lib/components/Slider";

export const FreeDeckSettings: React.FC<{
  action: IButtonSetting;
  setSetting: (setting: number[]) => void;
}> = ({ action, setSetting }) => {
  return (
    <>
      <Row>
        <Label>Setting</Label>
        <StyledSelect
          className="w-40"
          value={action.values[0] ?? -1}
          onChange={(value) => setSetting([parseInt(value)])}
          options={[
            { text: "Select Setting", value: -1 },
            { text: "Decrease Brightness", value: 1 },
            { text: "Increase Brightness", value: 2 },
            { text: "Set Brightness", value: 3 },
          ]}
        />
      </Row>
      {action.values[0] === 3 && (
        <Row>
          <FDSlider
            value={action.values[1] || 128}
            min={1}
            max={255}
            onChange={(e) =>
              setSetting([action.values[0], e.target.valueAsNumber])
            }
          />
          <Value>{(((action.values[1] || 128) / 255) * 100).toFixed(0)}%</Value>
        </Row>
      )}
    </>
  );
};
