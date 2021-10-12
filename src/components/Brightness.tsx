import React, { useContext } from "react";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

import { Label, Row, StyledSlider, Title, Value } from "../lib/components/Misc";

export const Brightness: React.FC<{
  // setBrightness: (brightness: number) => void;
  // brightness: number;
}> = (/*{ setBrightness, brightness }*/) => {
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <>
      <Title>Brightness</Title>
      <Row>
        <Label>Brightness:</Label>
        <StyledSlider
          min={0}
          max={255}
          value={configState.brightness}
          onChange={(e) =>
            configDispatch.setBrightness(e.currentTarget.valueAsNumber)
          }
        />
        <Value>{configState.brightness}</Value>
      </Row>
    </>
  );
};
