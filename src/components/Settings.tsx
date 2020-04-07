import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { colors } from "../definitions/colors";
import { FDButton } from "./lib/button";

function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}
const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px;
`;
const SettingsButtons = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const ContrastValue = styled.p`
  line-height: 21px;
  margin: 0;
  color: ${colors.white};
  font-family: sans-serif;
  font-size: 16px;
  font-weight:bold;
`;
const MicroButton = styled(FDButton).attrs({size:1})`
  min-width: 36px;
`
const MicroToggle = styled(FDButton).attrs({size:1})`
  padding: 0px 4px;
`
export const Settings: React.FC<{
  setSettings: (settings: {
    contrast: number;
    dither: boolean;
    invert: boolean;
  }) => void;
}> = ({ setSettings }) => {
  const [contrast, setContrast] = useState<number>(0);
  const [dither, setDither] = useState<boolean>(true);
  const [invert, setInvert] = useState<boolean>(false);
  useEffect(() => {
    setSettings({ contrast, dither, invert });
  }, [contrast, dither, invert]);
  return (
    <SettingsButtons>
      <ButtonRow>
        <MicroButton onClick={() => setContrast(clamp(contrast + 0.1, -1, 1))}>
          ++
        </MicroButton>
        <MicroButton onClick={() => setContrast(clamp(contrast + 0.02, -1, 1))}>
          +
        </MicroButton>
        <MicroButton onClick={() => setContrast(clamp(contrast - 0.02, -1, 1))}>
          -
        </MicroButton>
        <MicroButton onClick={() => setContrast(clamp(contrast - 0.1, -1, 1))}>
          --
        </MicroButton>
      </ButtonRow>
      <ButtonRow>
        <MicroToggle onClick={() => setInvert(!invert)}>invert</MicroToggle>
        <ContrastValue>{contrast.toFixed(2)}</ContrastValue>
        <MicroToggle onClick={() => setDither(!dither)}>dither</MicroToggle>
      </ButtonRow>
    </SettingsButtons>
  );
};
