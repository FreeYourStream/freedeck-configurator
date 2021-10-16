import React, { useContext } from "react";
import { Label } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { FDSlider } from "../lib/components/Slider";
import { Title } from "../lib/components/Title";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

export const Brightness: React.FC<{}> = () => {
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <div className="w-full">
      <Title>Brightness</Title>
      <Row>
        <Label>Brightness:</Label>
        <FDSlider
          min={0}
          max={255}
          value={configState.brightness}
          onChange={(e) =>
            configDispatch.setBrightness(e.currentTarget.valueAsNumber)
          }
        />
      </Row>
    </div>
  );
};
