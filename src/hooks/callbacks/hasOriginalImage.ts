import { useCallback } from "react";

import { IOriginalImagePage } from "../../App";

export const useHasOriginalImageCallback = (
  originalImagePages: IOriginalImagePage[]
) =>
  useCallback(
    (pageIndex: number, displayIndex: number) =>
      !!originalImagePages?.[pageIndex]?.[displayIndex],
    [originalImagePages]
  );
