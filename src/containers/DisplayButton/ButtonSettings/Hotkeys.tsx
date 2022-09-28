import React from "react";

import { keys } from "../../../definitions/keys";
import { EAction } from "../../../definitions/modes";
import { ButtonSetting } from "../../../generated/button";
import { FDButton } from "../../../lib/components/Button";
import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSelect } from "../../../lib/components/SelectInput";
import { ROW_SIZE } from "../../../lib/configFile/consts";
import { useTranslateKeyboardLayout } from "../../../lib/localisation/keyboard";

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
          {!!(
            translatedKeys.slice(0, index + 1).filter((k) => k === key).length %
            2
          )
            ? key
            : `^${key}`}
        </FDButton>
      ))}
    </div>
  );
};

export const Hotkeys: React.FC<{
  values: ButtonSetting["values"];
  setValues: (values: ButtonSetting["values"]) => void;
}> = ({ setValues, values }) => {
  const setKeys = (newValues: number[]) =>
    newValues.length <= ROW_SIZE / 2 - 4 &&
    setValues({
      ...values,
      [EAction.hotkeys]: newValues,
    });
  const onHotKey = (e: React.KeyboardEvent<any>, lengthLimit = 7) => {
    if (e.repeat) return;
    const key = Object.keys(keys).find(
      (key) => keys[key]?.js === e.nativeEvent.code
    );
    if (!key) return;
    //ignore backspace
    if (keys[key]!.hid === 42 && values[EAction.hotkeys].length > 0) {
      setKeys([
        ...values[EAction.hotkeys].slice(0, values[EAction.hotkeys].length - 1),
      ]);
    } else setKeys([...values[EAction.hotkeys], keys[key]!.hid]);
  };

  return (
    <>
      <Row>
        <Label>Key</Label>
        <FDSelect
          className="w-48"
          value={0}
          onChange={(value) => {
            if (
              !!values[EAction.hotkeys].find((k) => k === value) &&
              value >= 0xe0
            )
              return;
            setKeys([...values[EAction.hotkeys], parseInt(value)]);
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
          onKeyDown={(e) => onHotKey(e)}
        >
          Click/Focus to scan
        </div>
      </Row>
      <Row>
        <div>
          <HotkeyKeys setKeys={setKeys} values={values[EAction.hotkeys]} />
        </div>
      </Row>
    </>
  );
};
