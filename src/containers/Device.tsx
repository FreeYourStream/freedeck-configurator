import { XIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useState } from "react";

import { Divider } from "../lib/components/Divider";
import { Label, Value } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { FDSelect } from "../lib/components/SelectInput";
import { TitleBox } from "../lib/components/Title";
import { AppStateContext } from "../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";

const FW_UNKNOWN = "please connect serial";

const DisplayCountDropDown: React.FC<{
  value: number;
  options: number[];
  onChange: (newValue: number) => void;
}> = ({ onChange, options, value }) => (
  <FDSelect
    className="w-16"
    value={value}
    onChange={(value) => onChange(parseInt(value, 10))}
    options={options.map((option) => ({
      text: option.toString(),
      value: option,
    }))}
  />
);

export const Device: React.FC<{}> = () => {
  const { serialApi } = useContext(AppStateContext);
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);

  const [widthOptions, setWOptions] = useState<Array<number>>([]);
  const [heightOptions, setHOptions] = useState<Array<number>>([]);
  const [fwVersion, setFwVersion] = useState<string>(FW_UNKNOWN);

  useEffect(() => {
    if (!serialApi) return;
    const id = serialApi.registerOnPortsChanged(async (ports) => {
      if (ports.length) {
        const fw = await serialApi.getFirmwareVersion();
        setFwVersion(fw);
      } else {
        setFwVersion(FW_UNKNOWN);
      }
    });
    return () => serialApi.clearOnPortsChanged(id);
  }, [serialApi]);

  useEffect(() => {
    const wArray = [];
    let possibleWidth = 1;
    while (configState.height * possibleWidth <= 16) {
      wArray.push(possibleWidth++);
    }

    const hArray = [];
    let possibleHeight = 1;
    while (configState.width * possibleHeight <= 16) {
      hArray.push(possibleHeight++);
    }
    setWOptions(wArray);
    setHOptions(hArray);
  }, [configState.width, configState.height]);

  return (
    <div className="w-full">
      <TitleBox title="Device Settings">
        <Row>
          <Label>FreeDeck Layout:</Label>
          <div className="flex items-center">
            <DisplayCountDropDown
              onChange={(width) => {
                if (width < configState.width)
                  window.advancedConfirm(
                    "Warning",
                    "If you accept, we will delete all displays that won't fit into the lesser amount of screens",
                    () => configDispatch.setDimensions({ width })
                  );
                else configDispatch.setDimensions({ width });
              }}
              value={configState.width}
              options={widthOptions}
            />
            <XIcon className="w-5 h-5 mx-2" />
            <DisplayCountDropDown
              onChange={(height) => configDispatch.setDimensions({ height })}
              value={configState.height}
              options={heightOptions}
            />
          </div>
        </Row>
      </TitleBox>

      <Divider />
      <TitleBox title="Device Info">
        <Row>
          <Label>Firmware version:</Label>
          <Value>{fwVersion}</Value>
        </Row>
        <Row>
          <Label>Config version:</Label>
          <Value>{configState.configVersion || "1.0.0"}</Value>
        </Row>
      </TitleBox>
    </div>
  );
};
