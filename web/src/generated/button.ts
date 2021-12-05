/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface Button {
  primary: ButtonSetting;
  secondary: ButtonSetting;
}

export interface ButtonSetting {
  mode?: 'changePage' | 'hotkeys' | 'noop' | 'settings' | 'special_keys' | 'text';
  values: ButtonValues;
}

export interface ButtonValues {
  changePage?: string;
  hotkeys?: number[];
  settings?: {
    setting?: 1 | 0;
    value?: number;
  };
  special_keys?: number;
  text?: number[];
}
