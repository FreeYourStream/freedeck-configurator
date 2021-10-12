export interface BaseActions<RetType> {
  [key: string]: (...args: any[]) => RetType;
}
export type Actions<T> = BaseActions<Promise<T>>;
export type FunctionForFirstParamType<ParamType> = (arg0: ParamType) => void;
