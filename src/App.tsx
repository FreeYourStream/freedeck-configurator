import { useSimpleReducer } from "@bitovi/use-simple-reducer";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HashRouter } from "react-router-dom";

import { Body } from "./Body";
import { StartUp } from "./lib/hooks/startup";
import { AddEventListeners } from "./lib/misc/eventListeners";
import { ModalBody } from "./ModalBody";
import {
  AppDispatchContext,
  AppState,
  AppStateContext,
  IAppReducer,
  appReducer,
} from "./states/appState";
import {
  ConfigDispatchContext,
  ConfigState,
  ConfigStateContext,
  IConfigReducer,
  configReducer,
} from "./states/configState";

const App: React.FC<{
  defaultConfigState: ConfigState;
  defaultAppState: AppState;
}> = ({ defaultConfigState, defaultAppState }) => {
  const [configState, configDispatch] = useSimpleReducer<
    ConfigState,
    IConfigReducer
  >(defaultConfigState, configReducer);

  const [appState, appDispatch] = useSimpleReducer<AppState, IAppReducer>(
    defaultAppState,
    appReducer
  );

  AddEventListeners({ appDispatchContext: appDispatch });

  return (
    <HashRouter>
      <DndProvider backend={HTML5Backend}>
        <ConfigStateContext.Provider value={configState}>
          <ConfigDispatchContext.Provider value={configDispatch}>
            <AppStateContext.Provider value={appState}>
              <AppDispatchContext.Provider value={appDispatch}>
                <StartUp />
                <Body />
                <ModalBody />
              </AppDispatchContext.Provider>
            </AppStateContext.Provider>
          </ConfigDispatchContext.Provider>
        </ConfigStateContext.Provider>
      </DndProvider>
    </HashRouter>
  );
};

export default App;
