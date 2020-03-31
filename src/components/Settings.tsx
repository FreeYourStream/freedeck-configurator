import React, { useState, useEffect } from "react";
import styled from "styled-components";
function clamp(num: number, min: number, max: number) {
  return num <= min ? min : num >= max ? max : num;
}

const SettingsButtons = styled.div`
  display: flex;
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
      <button onClick={() => setInvert(!invert)}>invert</button>
      <button onClick={() => setDither(!dither)}>dither</button>
    </SettingsButtons>
  );
};
