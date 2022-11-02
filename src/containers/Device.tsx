import { XMarkIcon } from "@heroicons/react/24/outline";
import React, { useContext, useEffect, useState } from "react";

import { Label, Value } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { ScrollListContainer } from "../lib/components/ScrollListContainer";
import { FDSelect } from "../lib/components/SelectInput";
import { FDSwitch } from "../lib/components/Switch";
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
      if (serialApi.connected) {
        const fw = await serialApi.getFirmwareVersion();
        setFwVersion(fw);
      } else {
        setFwVersion(FW_UNKNOWN);
      }
    });
    return () => serialApi.clearOnPortsChanged(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialApi?.connected]);

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
    <ScrollListContainer>
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
            <XMarkIcon className="w-5 h-5 mx-2" />
            <DisplayCountDropDown
              onChange={(height) => configDispatch.setDimensions({ height })}
              value={configState.height}
              options={heightOptions}
            />
          </div>
        </Row>
        <Row>
          <Label hint="Disable this to massively reduce save times but you will not be able to 'load from freedeck'">
            Save JSON:
          </Label>
          <FDSwitch
            onChange={(val) => configDispatch.setSaveJson(val)}
            value={configState.saveJson}
          />
        </Row>
      </TitleBox>

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
    </ScrollListContainer>
  );
};
