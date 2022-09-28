import { invoke } from "@tauri-apps/api";
import { createContext } from "react";

import { FDSerialAPI } from "../lib/serial/fdSerialApi";
import { Actions, FunctionForFirstParamType } from "./interfaces";

export interface AppState {
  autoPageSwitcherEnabled: boolean;
  ctrlDown: boolean;
  serialApi?: FDSerialAPI;
  availablePorts: string[];
  connectedPortIndex: number;
  devLog: any;
  hasJson: boolean;
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
  deck: {
    currentPage: number | null;
    dontSwitchPage: boolean;
  };
  system: {
    cpuTemp: number[];
    gpuTemp: number[];
  };
}
export const defaultAppState: () => Promise<AppState> = async () => ({
  autoPageSwitcherEnabled: true,
  ctrlDown: false,
  serialApi:
    navigator.serial || (window as any).__TAURI_IPC__
      ? new FDSerialAPI()
      : undefined,
  devLog: {},
  availablePorts: [],
  connectedPortIndex: -1,
  hasJson: true,
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
  deck: { currentPage: null, dontSwitchPage: false },
  system: {
    cpuTemp: [0],
    gpuTemp: [0],
  },
});

export interface IAppReducer extends Actions<AppState> {
  setCtrl(state: AppState, ctrlDown: boolean): Promise<AppState>;
  setDeck(
    state: AppState,
    data: { currentPage: number | null; dontSwitchPage: boolean }
  ): Promise<AppState>;
  toggleAutoPageSwitcher(state: AppState, enabled?: boolean): Promise<AppState>;
  closeAlert(state: AppState): Promise<AppState>;
  setHasJson(state: AppState, hasJson: boolean): Promise<AppState>;
  openAlert(
    state: AppState,
    data: { text: string; title: string }
  ): Promise<AppState>;
  setDevLog(
    state: AppState,
    data: { path: string; data: any }
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
  setAvailablePorts(
    state: AppState,
    availablePorts: string[]
  ): Promise<AppState>;
  setConnectedPortIndex(
    state: AppState,
    connectedPortIndex: number
  ): Promise<AppState>;
  setTemps(
    state: AppState,
    data: { cpuTemp: number; gpuTemp: number }
  ): Promise<AppState>;
}

export interface PartialState {
  system: {
    cpuTemp: number[];
    gpuTemp: number[];
  };
  [x: string]: any;
}

export const modifyTemps = <State extends PartialState>(
  state: State,
  data: {
    gpuTemp: number;
    cpuTemp: number;
  }
): State => {
  const { gpuTemp, cpuTemp } = data;
  if (state.system.cpuTemp.length >= 64) {
    state.system.cpuTemp.shift();
  }
  state.system.cpuTemp.push(cpuTemp);

  if (state.system.gpuTemp.length >= 64) {
    state.system.gpuTemp.shift();
  }
  state.system.gpuTemp.push(gpuTemp);

  return { ...state };
};

export const appReducer: IAppReducer = {
  async setCtrl(state, ctrlDown) {
    return { ...state, ctrlDown };
  },
  async setDeck(state, { currentPage, dontSwitchPage }) {
    return { ...state, deck: { currentPage, dontSwitchPage } };
  },
  async setTemps(state, data) {
    return modifyTemps<AppState>(state, data);
  },
  async toggleAutoPageSwitcher(state, maybeEnabled) {
    const enabled =
      maybeEnabled === undefined
        ? !state.autoPageSwitcherEnabled
        : maybeEnabled;
    setTimeout(() =>
      localStorage.setItem("autoPageSwitcherEnabled", enabled.toString())
    );
    invoke("set_aps_state", {
      apsState: enabled,
    });
    return { ...state, autoPageSwitcherEnabled: enabled };
  },
  async setDevLog(state: AppState, { path, data }) {
    const devLog = { ...state.devLog };
    devLog[path] = data;
    return { ...state, devLog };
  },
  async setHasJson(state: AppState, hasJson: boolean) {
    return { ...state, hasJson };
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
  async setAvailablePorts(state, availablePorts) {
    return { ...state, availablePorts };
  },
  async setConnectedPortIndex(state, connectedPortIndex) {
    return { ...state, connectedPortIndex };
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
