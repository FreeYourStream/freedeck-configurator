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
}
export const defaultAppState: () => Promise<AppState> = async () => ({
  ctrlDown: false,
  serialApi: (navigator as any).serial ? new FDSerialAPI() : undefined,
  alert: {
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
