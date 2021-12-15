import { useEffect, useState } from "react";

import { keys } from "../../definitions/keys";

export const useTranslateKeyboardLayout = (values: number[]) => {
  const translatable = !(navigator as any).keyboard;
  const [translatedKeys, setTranslatedKeys] = useState<string[]>([]);
  useEffect(() => {
    if (!values || !values.length) {
      setTranslatedKeys([]);
      return;
    }
    if (translatable) {
      setTranslatedKeys(
        values.map(
          (key) =>
            Object.keys(keys).find(
              (displayName) => keys[displayName]?.hid === key
            ) || ""
        )
      );
    } else {
      (navigator as any).keyboard.getLayoutMap().then((layout: any) => {
        const translatedKeys = values.map((value) => {
          const key =
            Object.keys(keys).find(
              (displayName) => keys[displayName]?.hid === value
            ) || "";
          const jsKey = keys[key]?.js;
          const localKey = layout.get(jsKey);
          return localKey ?? key;
        });
        setTranslatedKeys(translatedKeys);
      });
    } // eslint-disable-next-line
  }, [values]);
  return translatedKeys;
};
