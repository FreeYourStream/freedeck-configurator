import { createContext } from "react";
import { FDSerialAPI } from "../lib/fdSerialApi";
import { Actions, FunctionForFirstParamType } from "./interfaces";

export interface AppState {
  ctrlDown: boolean;
  serialApi?: FDSerialAPI;
}
export const defaultAppState: () => Promise<AppState> = async () => ({
  ctrlDown: false,
  serialApi: (navigator as any).serial ? new FDSerialAPI() : undefined,
});

export interface IAppReducer extends Actions<AppState> {
  setCtrl(state: AppState, ctrlDown: boolean): Promise<AppState>;
}

export const appReducer: IAppReducer = {
  async setCtrl(state, ctrlDown) {
    return { ...state, ctrlDown };
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
