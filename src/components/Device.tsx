import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  Label,
  Row,
  SelectWrapper,
  StyledSelect,
  Title,
} from "../lib/components/Misc";

const Wrapper = styled.div`
  min-width: 470px;
`;

export const Device: React.FC<{
  width: number;
  height: number;
  setDimensions: (width: number, height: number) => any;
}> = ({ width, height, setDimensions }) => {
  const [widthOptions, setWOptions] = useState<Array<number>>([]);
  const [heightOptions, setHOptions] = useState<Array<number>>([]);

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
        <SelectWrapper>
          <StyledSelect
            value={width}
            onChange={(e) =>
              setDimensions(parseInt(e.target.value, 10), height)
            }
          >
            {widthOptions.map((wOption) => (
              <option value={wOption}>{wOption.toString()}</option>
            ))}
          </StyledSelect>
        </SelectWrapper>
      </Row>
      <Row>
        <Label>FreeDeck height:</Label>
        <SelectWrapper>
          <StyledSelect
            value={height}
            onChange={(e) => setDimensions(width, parseInt(e.target.value, 10))}
          >
            {heightOptions.map((hOption) => (
              <option value={hOption}>{hOption.toString()}</option>
            ))}
          </StyledSelect>
        </SelectWrapper>
      </Row>
    </Wrapper>
  );
};
