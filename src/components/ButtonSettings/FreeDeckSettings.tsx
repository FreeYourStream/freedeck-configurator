import React from "react";

import { IButtonSettings } from "../../interfaces";
import {
  Row,
  SelectWrapper,
  StyledSelect,
  StyledSlider,
  Value,
} from "../../lib/components/Misc";

export const FreeDeckSettings: React.FC<{
  action: IButtonSettings;
  setSetting: (setting: number[]) => void;
}> = ({ action, setSetting }) => {
  return (
    <>
      <SelectWrapper>
        <StyledSelect
          value={action.values[0]}
          onChange={(e) => setSetting([parseInt(e.target.value)])}
        >
          <option value={-1}>Select Setting</option>
          <option value={1}>Decrease Brightness</option>
          <option value={2}>Increase Brightness</option>
          <option value={3}>Set Brightness</option>
        </StyledSelect>
        {action.values[0] === 3 && (
          <Row>
            <StyledSlider
              value={action.values[1] || 128}
              min={1}
              max={255}
              onChange={(e) =>
                setSetting([action.values[0], e.target.valueAsNumber])
              }
            />
            <Value>
              {(((action.values[1] || 128) / 255) * 100).toFixed(0)}%
            </Value>
          </Row>
        )}
      </SelectWrapper>
    </>
  );
};
