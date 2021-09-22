import { useCallback } from "react";

import { IOriginalImagePage } from "../../interfaces";

export const useHasOriginalImageCallback = (
  originalImagePages: IOriginalImagePage[]
) =>
  useCallback(
    (pageIndex: number, displayIndex: number) =>
      !!originalImagePages?.[pageIndex]?.[displayIndex],
    [originalImagePages]
  );
