import { useSimpleReducer } from "@bitovi/use-simple-reducer";
import { PlusCircleIcon } from "@heroicons/react/outline";
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { Toaster } from "react-hot-toast";

import { Collections } from "./containers/Collection/Collections";
import { ContentBody } from "./containers/ContentBody";
import { FirstPage } from "./containers/FirstTime";
import { GlobalSettings } from "./containers/GeneralSettings";
import { Header } from "./containers/Header";
import { Login } from "./containers/Login";
import { Pages } from "./containers/Page/Pages";
import { FDButton } from "./lib/components/Button";
import { createButtonBody, createImageBody } from "./lib/configFile/createBody";
import { createFooter } from "./lib/configFile/createFooter";
import { createHeader } from "./lib/configFile/createHeader";
import { loadConfigFile } from "./lib/configFile/loadConfigFile";
import { download } from "./lib/download";
import { isElectron } from "./lib/electron";
import { AddEventListeners } from "./lib/eventListeners";
import { usePageSwitcher } from "./lib/hooks/pageSwitcherHook";
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
  usePageSwitcher({ appState, configState });
  AddEventListeners({ appDispatchContext: appDispatch });

  const createConfigBuffer = async (): Promise<Buffer> =>
    Buffer.concat([
      createHeader(
        configState.width,
        configState.height,
        configState.brightness,
        configState.screenSaverTimeout,
        Object.keys(configState.pages).length
      ),
      createButtonBody(configState.pages),
      createImageBody(configState.pages),
      createFooter(configState),
    ]);
  return (
    <DndProvider backend={Backend}>
      <ConfigStateContext.Provider value={configState}>
        <ConfigDispatchContext.Provider value={configDispatch}>
          <AppStateContext.Provider value={appState}>
            <AppDispatchContext.Provider value={appDispatch}>
              <div className="flex flex-col h-full w-full">
                <Header
                  loadConfigFile={(filesOrBuffer) =>
                    loadConfigFile(filesOrBuffer, configDispatch.setState)
                  }
                  saveConfigFile={async () => {
                    if (Object.keys(configState.pages.byId).length === 0)
                      return;
                    const completeBuffer = await createConfigBuffer();

                    completeBuffer && download(completeBuffer);
                  }}
                  createConfigBuffer={createConfigBuffer}
                />
                <ContentBody>
                  {!!Object.values(configState.pages.byId).filter(
                    (p) => !p.isInCollection
                  ).length && <Pages />}
                  {!Object.values(configState.pages).length && <FirstPage />}
                  {!!Object.keys(configState.collections).length && (
                    <Collections />
                  )}
                </ContentBody>
                <GlobalSettings
                  loadConfigFile={(buffer: Buffer) =>
                    loadConfigFile(buffer, configDispatch.setState)
                  }
                  getConfigBuffer={createConfigBuffer}
                />
                <Login />
                <Toaster />
                {!!Object.keys(configState.pages).length && (
                  <div className="fixed bottom-5 right-6">
                    <FDButton
                      prefix={<PlusCircleIcon className="w-6 h-6" />}
                      size={3}
                      type="primary"
                      onClick={() => configDispatch.addPage(undefined)}
                    >
                      Add Page
                    </FDButton>
                  </div>
                )}
              </div>
            </AppDispatchContext.Provider>
          </AppStateContext.Provider>
        </ConfigDispatchContext.Provider>
      </ConfigStateContext.Provider>
    </DndProvider>
  );
};

export default App;
