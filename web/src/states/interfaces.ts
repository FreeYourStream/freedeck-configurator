export interface BaseActions<RetType> {
  [key: string]: (...args: any[]) => RetType;
}
export type Actions<T> = BaseActions<Promise<T>>;
export type FunctionForFirstParamType<ParamType> = (arg0: ParamType) => void;

declare global {
  interface Window {
    advancedAlert: (title: string, text: string) => void;
    advancedConfirm: (title: string, text: string, onAccept: () => any) => any;
  }
}
