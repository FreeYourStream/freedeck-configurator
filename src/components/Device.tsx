import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  Divider,
  Label,
  Row,
  SelectWrapper,
  StyledSelect,
  Title,
  Value,
} from "../lib/components/Misc";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { connectionStatus } from "../lib/serial";

const FW_UNKNOWN = "unknown, please connect serial";

const Wrapper = styled.div`
  min-width: 470px;
`;

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

export const Device: React.FC<{
  width: number;
  height: number;
  setDimensions: (width: number, height: number) => any;
  serialApi: FDSerialAPI;
}> = ({ width, height, setDimensions, serialApi }) => {
  const [widthOptions, setWOptions] = useState<Array<number>>([]);
  const [heightOptions, setHOptions] = useState<Array<number>>([]);
  const [fwVersion, setFwVersion] = useState<string>(FW_UNKNOWN);

  useEffect(() => {
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
    while (height * possibleWidth <= 16) {
      wArray.push(possibleWidth++);
    }

    const hArray = [];
    let possibleHeight = 1;
    while (width * possibleHeight <= 16) {
      hArray.push(possibleHeight++);
    }
    setWOptions(wArray);
    setHOptions(hArray);
  }, [width, height]);

  return (
    <Wrapper>
      <Title>Device Settings</Title>
      <Row>
        <Label>FreeDeck width:</Label>
        <DisplayCountDropDown
          onChange={(newValue) => setDimensions(newValue, height)}
          value={width}
          options={widthOptions}
        />
      </Row>
      <Row>
        <Label>FreeDeck height:</Label>
        <DisplayCountDropDown
          onChange={(newValue) => setDimensions(width, newValue)}
          value={height}
          options={heightOptions}
        />
      </Row>
      <Divider mb={16} />
      <Title>Device Info</Title>
      <Row>
        <Label>Firmware version:</Label>
        <Value>{fwVersion}</Value>
      </Row>
    </Wrapper>
  );
};
