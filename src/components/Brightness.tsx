import React, { useContext } from "react";
import { DispatchContext, StateContext } from "../App";

import { Label, Row, StyledSlider, Title, Value } from "../lib/components/Misc";

export const Brightness: React.FC<{
  // setBrightness: (brightness: number) => void;
  // brightness: number;
}> = (/*{ setBrightness, brightness }*/) => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  return (
    <>
      <Title>Brightness</Title>
      <Row>
        <Label>Brightness:</Label>
        <StyledSlider
          min={0}
          max={255}
          value={state.brightness}
          onChange={(e) =>
            dispatch({
              type: "setBrightness",
              value: e.currentTarget.valueAsNumber,
            })
          }
        />
        <Value>{state.brightness}</Value>
      </Row>
    </>
  );
};
