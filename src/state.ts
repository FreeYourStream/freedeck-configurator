import { createContext, Reducer } from "react";

export type Action =
  | { type: "setBrightness"; value: number }
  | { type: "setWidth"; value: number }
  | { type: "setHeight"; value: number };
export interface State {
  brightness: number;
  width: number;
  height: number;
}
export const reducer: Reducer<State, Action> = (state, action) => {
  let newState = { ...state };
  switch (action.type) {
    case "setBrightness":
      newState.brightness = action.value;
      break;
    case "setWidth":
      newState.width = action.value;
      break;
    case "setHeight":
      newState.height = action.value;
      break;
    default:
      break;
  }
  return newState;
};

export const defaultState: State = {
  brightness: 200,
  width: 3,
  height: 2,
};

export const StateContext = createContext<State>(defaultState);
export const DispatchContext = createContext<React.Dispatch<Action>>(() => {});
