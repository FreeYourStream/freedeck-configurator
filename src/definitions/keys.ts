export interface IKeys {
  [key: string]: { hid: number; js: string; uni?: number } | undefined;
}
export const keys: IKeys = {
  Ctrl: { hid: 0xe0, js: "ControlLeft" },
  Shift: { hid: 0xe1, js: "ShiftLeft" },
  Alt: { hid: 0xe2, js: "AltLeft" },
  Win: { hid: 0xe3, js: "MetaLeft" },
  CtrlRight: { hid: 0xe4, js: "ControlRight" },
  ShiftRight: { hid: 0xe5, js: "ShiftRight" },
  AltGr: { hid: 0xe6, js: "AltRight" },
  WinRight: { hid: 0xe7, js: "MetaRight" },
  "#1": { hid: 30, uni: 49, js: "Digit1" },
  "#2": { hid: 31, uni: 50, js: "Digit2" },
  "#3": { hid: 32, uni: 51, js: "Digit3" },
  "#4": { hid: 33, uni: 52, js: "Digit4" },
  "#5": { hid: 34, uni: 53, js: "Digit5" },
  "#6": { hid: 35, uni: 54, js: "Digit6" },
  "#7": { hid: 36, uni: 55, js: "Digit7" },
  "#8": { hid: 37, uni: 56, js: "Digit8" },
  "#9": { hid: 38, uni: 57, js: "Digit9" },
  "#0": { hid: 39, uni: 48, js: "Digit0" },
  F1: { hid: 0x3a, js: "F1" },
  F2: { hid: 0x3b, js: "F2" },
  F3: { hid: 0x3c, js: "F3" },
  F4: { hid: 0x3d, js: "F4" },
  F5: { hid: 0x3e, js: "F5" },
  F6: { hid: 0x3f, js: "F6" },
  F7: { hid: 0x40, js: "F7" },
  F8: { hid: 0x41, js: "F8" },
  F9: { hid: 0x42, js: "F9" },
  F10: { hid: 0x43, js: "F10" },
  F11: { hid: 0x44, js: "F11" },
  F12: { hid: 0x45, js: "F12" },
  F13: { hid: 0x68, js: "F13" }, // Tools (hid:Ubunutu, )
  F14: { hid: 0x69, js: "F14" }, // Launch5 (hid:Ubuntu, )
  F15: { hid: 0x6a, js: "F15" }, // Launch6 (hid:Ubuntu, )
  F16: { hid: 0x6b, js: "F16" }, // Launch7 (hid:Ubuntu, )
  F17: { hid: 0x6c, js: "F17" }, // Launch8 (hid:Ubuntu, )
  F18: { hid: 0x6d, js: "F18" }, // Launch9 (hid:Ubuntu, )
  F19: { hid: 0x6e, js: "F19" }, // Disabled (hid:Ubuntu, )
  F20: { hid: 0x6f, js: "F20" }, // AudioMicMute (hid:Ubuntu, )
  F21: { hid: 0x70, js: "F21" }, // Touchpad toggle (hid:Ubuntu, )
  F22: { hid: 0x71, js: "F22" }, // TouchpadOn (hid:Ubuntu, )
  F23: { hid: 0x72, js: "F23" }, // TouchpadOff hid:Ubuntu, )
  F24: { hid: 0x73, js: "F24" }, // Disabled (hid:Ubuntu, )
  A: { hid: 4, uni: 97, js: "KeyA" },
  B: { hid: 5, uni: 98, js: "KeyB" },
  C: { hid: 6, uni: 99, js: "KeyC" },
  D: { hid: 7, uni: 100, js: "KeyD" },
  E: { hid: 8, uni: 101, js: "KeyE" },
  F: { hid: 9, uni: 102, js: "KeyF" },
  G: { hid: 10, uni: 103, js: "KeyG" },
  H: { hid: 11, uni: 104, js: "KeyH" },
  I: { hid: 12, uni: 105, js: "KeyI" },
  J: { hid: 13, uni: 106, js: "KeyJ" },
  K: { hid: 14, uni: 107, js: "KeyK" },
  L: { hid: 15, uni: 108, js: "KeyL" },
  M: { hid: 16, uni: 109, js: "KeyM" },
  N: { hid: 17, uni: 110, js: "KeyN" },
  O: { hid: 18, uni: 111, js: "KeyO" },
  P: { hid: 19, uni: 112, js: "KeyP" },
  Q: { hid: 20, uni: 113, js: "KeyQ" },
  R: { hid: 21, uni: 114, js: "KeyR" },
  S: { hid: 22, uni: 115, js: "KeyS" },
  T: { hid: 23, uni: 116, js: "KeyT" },
  U: { hid: 24, uni: 117, js: "KeyU" },
  V: { hid: 25, uni: 118, js: "KeyV" },
  W: { hid: 26, uni: 119, js: "KeyW" },
  X: { hid: 27, uni: 120, js: "KeyX" },
  Y: { hid: 28, uni: 121, js: "KeyY" },
  Z: { hid: 29, uni: 122, js: "KeyZ" },
  Enter: { hid: 40, js: "Enter" },
  Esc: { hid: 41, js: "Escape" },
  BackSpace: { hid: 42, js: "Backspace" },
  Tab: { hid: 43, js: "Tab" },
  Space: { hid: 44, uni: 32, js: "Space" },
  Minus: { hid: 45, uni: 45, js: "Minus" },
  Equal: { hid: 46, uni: 61, js: "Equal" },
  "Left Brace": { hid: 47, uni: 40, js: "BracketLeft" },
  "Right Brace": { hid: 48, uni: 41, js: "BracketRight" },
  Backslash: { hid: 49, js: "Backslash" },
  NonUSBackslash: { hid: 50, js: "IntlBackslash" },
  Semicolon: { hid: 51, js: "Semicolon" },
  Quote: { hid: 52, uni: 34, js: "Quote" },
  Tilde: { hid: 53, uni: 126, js: "Backquote" },
  Comma: { hid: 54, uni: 44, js: "Comma" },
  Period: { hid: 55, uni: 46, js: "Period" },
  Slash: { hid: 56, uni: 47, js: "Slash" },
  "Caps Lock": { hid: 0x39, js: "CapsLock" },
  Print: { hid: 0x46, js: "Print" },
  "Scroll Lock": { hid: 0x47, js: "ScrollLock" },
  Pause: { hid: 0x48, js: "Pause" },
  Insert: { hid: 0x49, js: "Insert" },
  Home: { hid: 0x4a, js: "Home" },
  "Page Up": { hid: 0x4b, js: "PageUp" },
  Delete: { hid: 0x4c, js: "Delete" },
  End: { hid: 0x4d, js: "End" },
  "Page Down": { hid: 0x4e, js: "PageDown" },
  "Right Arrow": { hid: 0x4f, js: "ArrowRight" },
  "Left Arrow": { hid: 0x50, js: "ArrowLeft" },
  "Down Arrow": { hid: 0x51, js: "ArrowDown" },
  "Up Arrow": { hid: 0x52, js: "ArrowUp" },
  "Num Lock": { hid: 0x53, js: "NumLock" },
  "Num Divide": { hid: 0x54, uni: 47, js: "NumpadDivide" },
  "Num Multiply": { hid: 0x55, uni: 42, js: "NumpadMultiply" },
  "Num Subtract": { hid: 0x56, uni: 45, js: "NumpadSubtract" },
  "Num Add": { hid: 0x57, uni: 43, js: "NumpadAdd" },
  "Num Enter": { hid: 0x58, js: "NumpadEnter" },
  "Num 1": { hid: 0x59, js: "Numpad1" },
  "Num 2": { hid: 0x5a, js: "Numpad2" },
  "Num 3": { hid: 0x5b, js: "Numpad3" },
  "Num 4": { hid: 0x5c, js: "Numpad4" },
  "Num 5": { hid: 0x5d, js: "Numpad5" },
  "Num 6": { hid: 0x5e, js: "Numpad6" },
  "Num 7": { hid: 0x5f, js: "Numpad7" },
  "Num 8": { hid: 0x60, js: "Numpad8" },
  "Num 9": { hid: 0x61, js: "Numpad9" },
  "Num 0": { hid: 0x62, js: "Numpad0" },
  "Num Dot": { hid: 0x63, js: "NumpadDecimal" },
};

export enum EMediaKeys {
  "Power" = 0x30,
  "Sleep" = 0x32,
  "Record" = 178,
  "Fast Forward" = 0xb3,
  "Rewind" = 0xb4,
  "Next" = 0xb5,
  "Previous" = 0xb6,
  "Stop" = 0xb7,
  "Play/Pause" = 0xcd,
  "Pause" = 0xb0,
  "Vol. Mute" = 0xe2,
  "Vol. Up" = 0xe9,
  "Vol. Down" = 0xea,
}

export const MediaKeys = Object.keys(EMediaKeys).filter(
  //@ts-ignore
  (k) => !parseInt(k)
) as string[];