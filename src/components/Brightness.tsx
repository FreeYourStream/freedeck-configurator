import React from "react";

import { Label, Row, StyledSlider, Title } from "../lib/components/Misc";

export const Brightness: React.FC<{
  setBrightness: (brightness: number) => void;
  brightness: number;
}> = ({ setBrightness, brightness }) => {
  return (
    <>
      <Title>Brightness</Title>
      <Row>
        <Label>Brightness:</Label>
        <StyledSlider
          min={0}
          max={255}
          value={brightness}
          onChange={(e) => setBrightness(e.currentTarget.valueAsNumber)}
        />
      </Row>
    </>
  );
};
