import React, { useContext } from "react";

import { Label } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { FDSelect } from "../lib/components/SelectInput";
import { FDSlider } from "../lib/components/Slider";
import { Title } from "../lib/components/Title";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

export const Displays: React.FC<{}> = () => {
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <div className="w-full">
      <Title>Displays</Title>
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
      <Row>
        <Label>Screen saver timeout:</Label>
        <FDSelect
          className="w-44"
          onChange={(value) => configDispatch.setScreenSaver(value)}
          value={configState.screenSaverTimeout}
          defaultValue={0}
          options={[
            { text: "never", value: 0 },
            { text: "5s", value: 5 },
            { text: "10s", value: 10 },
            { text: "30s", value: 30 },
            { text: "1min", value: 60 },
            { text: "2min", value: 60 * 2 },
            { text: "5min", value: 60 * 5 },
            { text: "15min", value: 60 * 15 },
          ]}
        />
        {/* <FDSlider
          min={0}
          max={15 * 60 * 1000}
          value={configState.screenSaverTimeout}
          onChange={(e) =>
            configDispatch.setScreenSaver(e.currentTarget.valueAsNumber)
          }
        /> */}
      </Row>
    </div>
  );
};
