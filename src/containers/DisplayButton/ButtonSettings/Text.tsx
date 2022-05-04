import React from "react";

import { keys } from "../../../definitions/keys";
import { EAction } from "../../../definitions/modes";
import { ButtonSetting } from "../../../generated/button";
import { FDSelect } from "../../../lib/components/SelectInput";
import { useTranslateKeyboardLayout } from "../../../lib/localisation/keyboard";

export const Text: React.FC<{
  values: ButtonSetting["values"];
  setValues: (values: ButtonSetting["values"]) => void;
}> = ({ values, setValues }) => {
  const translatedKeys = useTranslateKeyboardLayout(values[EAction.text]);
  const setKeys = (newValues: number[]) =>
    newValues.length < 15 &&
    setValues({
      ...values,
      [EAction.text]: newValues,
    });
  const onKey = (e: React.KeyboardEvent<any>, lengthLimit = 7) => {
    if (e.repeat) return;
    const key = Object.keys(keys).find(
      (key) => keys[key]?.js === e.nativeEvent.code
    );
    if (!key) return;
    //ignore backspace
    if (keys[key]!.hid === 42 && values[EAction.text].length > 0) {
      setKeys([
        ...values[EAction.text].slice(0, values[EAction.text].length - 1),
      ]);
    } else setKeys([...values[EAction.text], keys[key]!.hid]);
  };
  return (
    <>
      <FDSelect
        className="w-full my-2"
        value={0}
        onChange={(value) =>
          setKeys([...values[EAction.hotkeys], parseInt(value)])
        }
        options={[
          { value: 0, text: "Choose key" },
          ...Object.keys(keys).map((keyName) => ({
            text: keyName,
            value: keys[keyName]?.hid,
          })),
        ]}
      />
      <textarea
        className="bg-gray-400 my-2 rounded-lg resize-none p-2 w-full h-60"
        rows={12}
        onKeyDown={(e) => {
          onKey(e, 15);
        }}
        value={translatedKeys.reduce((acc, value) => `${acc}[${value}]`, "")}
      />
    </>
  );
};
