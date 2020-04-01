import React, { useState, useEffect } from "react";
import styled from "styled-components";
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
  font-family: sans-serif;
  font-size: 12px;
`;
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
        <button onClick={() => setContrast(clamp(contrast + 0.1, -1, 1))}>
          ++
        </button>
        <button onClick={() => setContrast(clamp(contrast + 0.02, -1, 1))}>
          +
        </button>
        <button onClick={() => setContrast(clamp(contrast - 0.02, -1, 1))}>
          -
        </button>
        <button onClick={() => setContrast(clamp(contrast - 0.1, -1, 1))}>
          --
        </button>
      </ButtonRow>
      <ButtonRow>
        <button onClick={() => setInvert(!invert)}>invert</button>
        <ContrastValue>{contrast.toFixed(2)}</ContrastValue>
        <button onClick={() => setDither(!dither)}>dither</button>
      </ButtonRow>
    </SettingsButtons>
  );
};
