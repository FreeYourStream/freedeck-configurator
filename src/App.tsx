import "react-toastify/dist/ReactToastify.css";

import c from "clsx";
import React from "react";
import { HiDocumentAdd } from "react-icons/hi";
import { ToastContainer } from "react-toastify";
import styled from "styled-components";

import { useSimpleReducer } from "@bitovi/use-simple-reducer";

import { GlobalSettings } from "./components/GeneralSettings";
import { Login } from "./components/Login";
import { ContentBody } from "./containers/ContentBody";
import { Header } from "./containers/Header";
import { Main } from "./containers/Main";
import { Page } from "./containers/Page";
import { colors } from "./definitions/colors";
import { useShowLogin, useShowSettings } from "./hooks/states";
import { FDButton, Icon } from "./lib/components/Button";
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
import { PlusCircleIcon } from "@heroicons/react/outline";

const StyledToastContainer = styled(ToastContainer).attrs({
  // custom props
})`
  .Toastify__toast-container {
  }
  .Toastify__toast {
    background-color: ${colors.accentDark};
    border: 1px solid ${colors.accent};
  }
  .Toastify__toast--error {
  }
  .Toastify__toast--warning {
  }
  .Toastify__toast--success {
  }
  .Toastify__toast-body {
    color: ${colors.brightWhite};
  }
  .Toastify__progress-bar {
    background-color: ${colors.gray};
  }
`;

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

  const [showSettings, setShowSettings] = useShowSettings();
  const [showLogin, setShowLogin] = useShowLogin();

  const createConfigBuffer = async (): Promise<Buffer> =>
    Buffer.concat([
      createHeader(
        configState.width,
        configState.height,
        configState.brightness,
        configState.buttonSettingsPages.length
      ),
      createButtonBody(configState.buttonSettingsPages),
      createImageBody(
        configState.displaySettingsPages.map((page) =>
          page.map((display) => display.convertedImage)
        )
      ),
      createFooter(configState),
    ]);
  return (
    <ConfigStateContext.Provider value={configState}>
      <ConfigDispatchContext.Provider value={configDispatch}>
        <AppStateContext.Provider value={appState}>
          <AppDispatchContext.Provider value={appDispatch}>
            <div className={c("flex flex-col h-full w-full")}>
              <Header
                loadConfigFile={(filesOrBuffer) =>
                  loadConfigFile(filesOrBuffer, configDispatch.setState)
                }
                saveConfigFile={async () => {
                  if (configState.displaySettingsPages.length === 0) return;
                  const completeBuffer = await createConfigBuffer();

                  completeBuffer && download(completeBuffer);
                }}
                setShowSettings={setShowSettings}
                createConfigBuffer={createConfigBuffer}
                openLogin={() => setShowLogin(true)}
              />
              <ContentBody>
                {configState.displaySettingsPages.map(
                  (imagePage, pageIndex) => (
                    <Page pageIndex={pageIndex} key={pageIndex} />
                  )
                )}
              </ContentBody>
              <GlobalSettings
                visible={showSettings}
                setClose={() => setShowSettings(false)}
                onClose={async () =>
                  configDispatch.updateAllDefaultBackImages(
                    await configState.defaultBackDisplay
                  )
                }
                readyToSave={!!configState.buttonSettingsPages.length}
                loadConfigFile={(buffer: Buffer) =>
                  loadConfigFile(buffer, configDispatch.setState)
                }
                getConfigBuffer={createConfigBuffer}
              />
              <Login visible={showLogin} setClose={() => setShowLogin(false)} />
              <StyledToastContainer />
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
            </div>
          </AppDispatchContext.Provider>
        </AppStateContext.Provider>
      </ConfigDispatchContext.Provider>
    </ConfigStateContext.Provider>
  );
};

export default App;
