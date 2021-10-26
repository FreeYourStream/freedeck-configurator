import { createContext } from "react";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { Actions, FunctionForFirstParamType } from "./interfaces";

export interface AppState {
  ctrlDown: boolean;
  showSettings: boolean;
  showLogin: boolean;
  serialApi?: FDSerialAPI;
}
export const defaultAppState: () => Promise<AppState> = async () => ({
  ctrlDown: false,
  showSettings: false,
  showLogin: false,
  serialApi: (navigator as any).serial ? new FDSerialAPI() : undefined,
});

export interface IAppReducer extends Actions<AppState> {
  setCtrl(state: AppState, ctrlDown: boolean): Promise<AppState>;
  setShowSettings(state: AppState, show: boolean): Promise<AppState>;
  setShowLogin(state: AppState, show: boolean): Promise<AppState>;
}

export const appReducer: IAppReducer = {
  async setCtrl(state, ctrlDown) {
    return { ...state, ctrlDown };
  },
  async setShowSettings(state, show) {
    return { ...state, showSettings: show };
  },
  async setShowLogin(state, show) {
    return { ...state, showLogin: show };
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
