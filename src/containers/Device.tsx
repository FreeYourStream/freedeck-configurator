import { XIcon } from "@heroicons/react/outline";
import React, { useContext, useEffect, useState } from "react";
import { Label, Value } from "../lib/components/LabelValue";
import { SelectWrapper, StyledSelect } from "../lib/components/Misc";
import { Row } from "../lib/components/Row";
import { Title } from "../lib/components/Title";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { connectionStatus } from "../lib/serial";
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
  <SelectWrapper>
    <StyledSelect
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option.toString()}
        </option>
      ))}
    </StyledSelect>
  </SelectWrapper>
);

export const Device: React.FC<{}> = () => {
  const { serialApi } = useContext(AppStateContext);
  const configState = useContext(ConfigStateContext);
  const configDispatch = useContext(ConfigDispatchContext);

  const [widthOptions, setWOptions] = useState<Array<number>>([]);
  const [heightOptions, setHOptions] = useState<Array<number>>([]);
  const [fwVersion, setFwVersion] = useState<string>(FW_UNKNOWN);

  useEffect(() => {
    console.log(serialApi?.connected);
    if (!serialApi) return;
    serialApi.registerOnConStatusChange(async (type) => {
      if (type === connectionStatus.connect) {
        const fw = await serialApi.getFirmwareVersion();
        setFwVersion(fw);
      } else {
        setFwVersion(FW_UNKNOWN);
      }
    });
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
      <Title>Device Settings</Title>
      <Row>
        <Label>FreeDeck Layout:</Label>
        <div className="flex items-center">
          <DisplayCountDropDown
            onChange={(width) => configDispatch.setDimensions({ width })}
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
      <div className="h-8" />
      <Title>Device Info</Title>
      <Row>
        <Label>Firmware version:</Label>
        <Value>{fwVersion}</Value>
      </Row>
    </div>
  );
};
