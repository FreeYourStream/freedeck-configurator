import React, { useContext } from "react";

import { FDButton } from "../lib/components/Button";
import { Label } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { ScrollListContainer } from "../lib/components/ScrollListContainer";
import { FDSelect } from "../lib/components/SelectInput";
import { FDSlider } from "../lib/components/Slider";
import { TitleBox } from "../lib/components/Title";
import { AppStateContext } from "../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

export const Displays: React.FC<{}> = () => {
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  const appState = useContext(AppStateContext);
  return (
    <ScrollListContainer>
      <TitleBox title="Displays">
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
        </Row>
      </TitleBox>
      <TitleBox title="Advanced">
        <Row>
          <Label hint="only for freedeck-pico, if too high the freedeck crashes. try lower values after restarting the freedeck, default 50">
            OLED speed:
          </Label>
          <FDSlider
            min={1}
            max={255}
            value={configState.oledSpeed}
            onChange={(e) =>
              configDispatch.setOledSpeed(e.currentTarget.valueAsNumber)
            }
          />
        </Row>
        <Row>
          <Label hint="only for freedeck-micro, if too low the freedeck crashes. try higher values after restarting the freedeck, default 2">
            OLED delay:
          </Label>
          <FDSlider
            min={1}
            max={10}
            value={configState.oledDelay}
            onChange={(e) =>
              configDispatch.setOledDelay(e.currentTarget.valueAsNumber)
            }
          />
        </Row>
        <Row>
          <Label hint="just play with this value to reduce noise, default 17">
            Pre charge period:
          </Label>
          <FDSlider
            min={0}
            max={255}
            value={configState.preChargePeriod}
            onChange={(e) =>
              configDispatch.setPreChargePeriod(e.currentTarget.valueAsNumber)
            }
          />
        </Row>
        <Row>
          <Label hint="just play with this value to reduce flickering, higher is better, default 15">
            Clock frequency:
          </Label>
          <FDSlider
            min={0}
            max={15}
            value={configState.clockFreq}
            onChange={(e) =>
              configDispatch.setClockFreq(e.currentTarget.valueAsNumber)
            }
          />
        </Row>
        <Row>
          <Label hint="just play with this value to reduce flickering, lower is better, default 2">
            Clock divider:
          </Label>
          <FDSlider
            min={0}
            max={15}
            value={configState.clockDiv}
            onChange={(e) =>
              configDispatch.setClockDiv(e.currentTarget.valueAsNumber)
            }
          />
        </Row>
        <Row>
          <Label hint="this is only temporary, you still need to save">
            Try it out:
          </Label>
          <FDButton
            onClick={() =>
              appState.serialApi?.testOledParameters(
                configState.oledSpeed,
                configState.oledDelay,
                configState.preChargePeriod,
                configState.clockFreq,
                configState.clockDiv
              )
            }
          >
            Try
          </FDButton>
        </Row>
      </TitleBox>
    </ScrollListContainer>
  );
};
