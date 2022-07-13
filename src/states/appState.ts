import { createContext } from "react";

import { FDSerialAPI } from "../lib/fdSerialApi";
import { Actions, FunctionForFirstParamType } from "./interfaces";

export interface AppState {
  ctrlDown: boolean;
  serialApi?: FDSerialAPI;
  alert: {
    isOpen: boolean;
    text: string;
    title: string;
  };
  confirm: {
    isOpen: boolean;
    text: string;
    title: string;
    onAccept?: () => any;
    onAbort?: () => any;
  };
}
export const defaultAppState: () => Promise<AppState> = async () => ({
  ctrlDown: false,
  serialApi:
    (navigator as any).serial || (window as any).__TAURI_IPC__
      ? new FDSerialAPI()
      : undefined,
  alert: {
    isOpen: false,
    text: "",
    title: "",
  },
  confirm: {
    isOpen: false,
    text: "",
    title: "",
  },
});

export interface IAppReducer extends Actions<AppState> {
  setCtrl(state: AppState, ctrlDown: boolean): Promise<AppState>;
  closeAlert(state: AppState): Promise<AppState>;
  openAlert(
    state: AppState,
    data: { text: string; title: string }
  ): Promise<AppState>;
  closeConfirm(state: AppState, data: { value: boolean }): Promise<AppState>;
  openConfirm(
    state: AppState,
    data: {
      text: string;
      title: string;
      onAccept?: () => any;
      onAbort?: () => any;
    }
  ): Promise<AppState>;
}

export const appReducer: IAppReducer = {
  async setCtrl(state, ctrlDown) {
    return { ...state, ctrlDown };
  },
  async closeAlert(state) {
    return { ...state, alert: { ...state.alert, isOpen: false } };
  },
  async openAlert(state, data) {
    return { ...state, alert: { ...data, isOpen: true } };
  },
  async closeConfirm(state, data) {
    if (data.value && state.confirm.onAccept) {
      await state.confirm.onAccept();
    } else if (!data.value && state.confirm.onAbort) {
      await state.confirm.onAbort();
    }
    state.confirm.onAccept = undefined;
    state.confirm.onAbort = undefined;
    return { ...state, confirm: { ...state.confirm, isOpen: false } };
  },
  async openConfirm(state, data) {
    return { ...state, confirm: { ...data, isOpen: true } };
  },
};

export type IAppDispatch = {
  [PropertyType in keyof IAppReducer]: FunctionForFirstParamType<
    Parameters<IAppReducer[PropertyType]>[1]
  >;
};

export const AppStateContext = createContext<AppState>({} as unknown as any);
export const AppDispatchContext = createContext<IAppDispatch>(
  appReducer as unknown as IAppDispatch
);
