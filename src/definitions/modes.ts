export enum EAction {
  "hotkeys" = "hotkeys",
  "changePage" = "changePage",
  "noop" = "noop",
  "special_keys" = "special_keys",
  "text" = "text",
  "settings" = "settings",
}

export const ActionValue = {
  [EAction.hotkeys]: 0,
  [EAction.changePage]: 1,
  [EAction.noop]: 2,
  [EAction.special_keys]: 3,
  [EAction.settings]: 5,
  [EAction.text]: 6,
};

export enum FDSettings {
  absolute_brightness,
  change_brightness,
}

export enum ETextPosition {
  right = "right",
  bottom = "bottom",
}
export enum EImageMode {
  normal = "normal",
  dither = "dither",
  hybrid = "hybrid", // a mix of edge detect and dither
}
