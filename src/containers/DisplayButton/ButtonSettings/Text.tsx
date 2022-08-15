import React from "react";

import { EAction } from "../../../definitions/modes";
import { ButtonSetting } from "../../../generated/button";

export const Text: React.FC<{
  values: ButtonSetting["values"];
  setValues: (values: ButtonSetting["values"]) => void;
}> = ({ values, setValues }) => {
  const setKeys = (newValues: string) =>
    setValues({
      ...values,
      [EAction.text]: newValues,
    });
  const onKey = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    lengthLimit = 7
  ) => {
    setKeys(e.target.value);
  };
  return (
    <>
      <textarea
        placeholder="Enter your text here"
        className="bg-gray-400 my-2 rounded-lg resize-none p-2 w-full h-60"
        rows={12}
        onChange={(e) => {
          onKey(e, 15);
        }}
        value={values[EAction.text]}
      />
      <span>This only works with the configurator app installed and running. Check the help to find the download</span>
    </>
  );
};
