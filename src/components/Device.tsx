import React, { useContext, useEffect, useState } from "react";
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
import { DispatchContext, StateContext } from "../state";

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
  serialApi?: FDSerialAPI;
}> = ({ serialApi }) => {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

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
    while (state.height * possibleWidth <= 16) {
      wArray.push(possibleWidth++);
    }

    const hArray = [];
    let possibleHeight = 1;
    while (state.width * possibleHeight <= 16) {
      hArray.push(possibleHeight++);
    }
    setWOptions(wArray);
    setHOptions(hArray);
  }, [state.width, state.height]);

  return (
    <Wrapper>
      <Title>Device Settings</Title>
      <Row>
        <Label>FreeDeck width:</Label>
        <DisplayCountDropDown
          onChange={(width) => dispatch.setDimensions({ width })}
          value={state.width}
          options={widthOptions}
        />
      </Row>
      <Row>
        <Label>FreeDeck height:</Label>
        <DisplayCountDropDown
          onChange={(height) => dispatch.setDimensions({ height })}
          value={state.height}
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
