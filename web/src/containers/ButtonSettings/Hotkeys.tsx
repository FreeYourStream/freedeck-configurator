import React from "react";

import { keys } from "../../definitions/keys";
import { IButtonSetting } from "../../interfaces";
import { FDButton } from "../../lib/components/Button";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { useTranslateKeyboardLayout } from "../../lib/localisation/keyboard";

const HotkeyKeys: React.FC<{
  values: number[];
  setKeys: (keys: number[]) => void;
}> = ({ values, setKeys }) => {
  const translatedKeys = useTranslateKeyboardLayout(values);
  return (
    <div className="flex flex-wrap gap-1">
      {translatedKeys.map((key, index) => (
        <FDButton
          size={1}
          key={`${key}-${index}`}
          onClick={() => {
            const newKeys = [...values];
            newKeys.splice(index, 1);
            setKeys(newKeys.slice(0, 7));
          }}
        >
          {key}
        </FDButton>
      ))}
    </div>
  );
};

export const Hotkeys: React.FC<{
  action: IButtonSetting;
  setKeys: (keys: number[]) => void;
  onKey: (e: React.KeyboardEvent<any>, lengthLimit?: any) => void;
}> = ({ action, setKeys, onKey }) => {
  return (
    <>
      <Row>
        <Label>Key</Label>
        <StyledSelect
          className="w-40"
          value={0}
          onChange={(value) => {
            if (action.values.hotkeys.length < 7)
              setKeys([...action.values.hotkeys, parseInt(value)]);
          }}
          options={[
            { text: "Choose key", value: 0 },
            ...Object.keys(keys).map((keyName) => ({
              text: keyName,
              value: keys[keyName]?.hid,
            })),
          ]}
        />
      </Row>
      <Row>
        <div
          className="bg-gray-400 px-2 py-1 w-full rounded text-center"
          tabIndex={0}
          onKeyDown={(e) => onKey(e)}
        >
          Click/Focus to scan
        </div>
      </Row>
      <Row>
        <div>
          <HotkeyKeys setKeys={setKeys} values={action.values.hotkeys} />
        </div>
      </Row>
    </>
  );
};
