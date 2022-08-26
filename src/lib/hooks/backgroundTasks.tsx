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
        appDispatch.current.setDevLog({
          path: "connectedPortIndex",
          data: connectedPortIndex,
        });
        if (connectedPortIndex > -1) {
          serialApi
            .getHasJson()
            .then((hasJson) => appDispatch.current.setHasJson(hasJson));
        }
      }
    );
    return () => {
      serialApi.clearOnPortsChanged(portsId);
    };
  }, [serialApi]);
};
