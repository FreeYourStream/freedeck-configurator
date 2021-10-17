import { useState } from "react";

export const useShowSettings = function () {
  return useState<boolean>(false);
};
export const useShowLogin = () => useState<boolean>(false);
