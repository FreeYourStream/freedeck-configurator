import { useSimpleReducer } from "@bitovi/use-simple-reducer";
import React, { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { HashRouter } from "react-router-dom";

import { Body } from "./Body";
import { Config } from "./generated";
import { useOnce } from "./lib/hooks/once";
import { useBackgroundTasks } from "./lib/hooks/startup";
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
  ConfigStateContext,
  IConfigReducer,
  configReducer,
} from "./states/configState";

export type RefState = { deck: AppState["deck"]; system: AppState["system"] };
export type StateRef = React.MutableRefObject<RefState>;

const App: React.FC<{
  defaultConfigState: Config;
  defaultAppState: AppState;
}> = ({ defaultConfigState, defaultAppState }) => {
  const [configState, configDispatch] = useSimpleReducer<
    Config,
    IConfigReducer
  >(defaultConfigState, configReducer);

  const [appState, appDispatch] = useSimpleReducer<AppState, IAppReducer>(
    defaultAppState,
    appReducer
  );

  const refState = useRef<RefState>({
    deck: appState.deck,
    system: appState.system,
  });
  useOnce(appState, appDispatch, refState);
  useBackgroundTasks(
    configState,
    configDispatch,
    appState,
    appDispatch,
    refState
  );
  AddEventListeners({ appDispatchContext: appDispatch });

  return (
    <HashRouter>
      <DndProvider backend={HTML5Backend}>
        <ConfigStateContext.Provider value={configState}>
          <ConfigDispatchContext.Provider value={configDispatch}>
            <AppStateContext.Provider value={appState}>
              <AppDispatchContext.Provider value={appDispatch}>
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
