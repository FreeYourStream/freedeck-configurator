import { useSimpleReducer } from "@bitovi/use-simple-reducer";
import { PlusCircleIcon } from "@heroicons/react/outline";
import React from "react";
import { Toaster } from "react-hot-toast";

import { ContentBody } from "./containers/ContentBody";
import { FirstPage } from "./containers/FirstTime";
import { GlobalSettings } from "./containers/GeneralSettings";
import { Header } from "./containers/Header";
import { Login } from "./containers/Login";
import { Pages } from "./containers/Pages";
import { FDButton } from "./lib/components/Button";
import { createButtonBody, createImageBody } from "./lib/configFile/createBody";
import { createFooter } from "./lib/configFile/createFooter";
import { createHeader } from "./lib/configFile/createHeader";
import { loadConfigFile } from "./lib/configFile/loadConfigFile";
import { download } from "./lib/download";
import { AddEventListeners } from "./lib/eventListeners";
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

  const createConfigBuffer = async (): Promise<Buffer> =>
    Buffer.concat([
      createHeader(
        configState.width,
        configState.height,
        configState.brightness,
        configState.screenSaverTimeout,
        configState.pages.length
      ),
      createButtonBody(configState.pages),
      createImageBody(configState.pages),
      createFooter(configState),
    ]);
  return (
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
                  if (configState.pages.length === 0) return;
                  const completeBuffer = await createConfigBuffer();

                  completeBuffer && download(completeBuffer);
                }}
                createConfigBuffer={createConfigBuffer}
              />
              <ContentBody>
                {!!configState.pages.length ? <Pages /> : <FirstPage />}
              </ContentBody>
              <GlobalSettings
                loadConfigFile={(buffer: Buffer) =>
                  loadConfigFile(buffer, configDispatch.setState)
                }
                getConfigBuffer={createConfigBuffer}
              />
              <Login />
              <Toaster />
              {!!configState.pages.length && (
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
  );
};

export default App;
