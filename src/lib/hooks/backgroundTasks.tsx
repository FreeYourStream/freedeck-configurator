import { useContext, useEffect, useRef } from "react";

import { AppDispatchContext, AppStateContext } from "../../states/appState";

export const useBackgroundTasks = () => {
  const appState = useContext(AppStateContext);
  const appDispatch = useRef(useContext(AppDispatchContext));
  const serialApi = appState.serialApi;
  useEffect(() => {
    if (!serialApi) return;
    const portsId = serialApi.registerOnPortsChanged(
      (ports, connectedPortIndex) => {
        appDispatch.current.setAvailablePorts(ports);
        appDispatch.current.setConnectedPortIndex(connectedPortIndex);
      }
    );
    return () => {
      serialApi.clearOnPortsChanged(portsId);
    };
  }, [serialApi]);
};
