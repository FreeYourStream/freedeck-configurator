import React from "react";
import { keys } from "../../definitions/keys";
import { IButtonSetting } from "../../interfaces";
import { StyledSelect } from "../../lib/components/SelectInput";
import { useTranslateKeyboardLayout } from "../../lib/localisation/keyboard";

export const Text: React.FC<{
  action: IButtonSetting;
  setKeys: (keys: number[]) => void;
  onKey: (e: React.KeyboardEvent<any>, lengthLimit?: any) => void;
}> = ({ action, setKeys, onKey }) => {
  const translatedKeys = useTranslateKeyboardLayout(action.values);
  return (
    <>
      <StyledSelect
        className="w-full my-2"
        value={0}
        onChange={(value) => {
          if (action.values.length < 15)
            setKeys([...action.values, parseInt(value)]);
        }}
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
          if (e.nativeEvent.code !== "Backspace") return onKey(e, 15);
          const newKeys = [...action.values];
          newKeys.splice(newKeys.length - 1, 1);
          setKeys(newKeys);
        }}
        value={translatedKeys.reduce((acc, value) => `${acc}[${value}]`, "")}
      />
    </>
  );
};
