import { useSimpleReducer } from "@bitovi/use-simple-reducer";
import React, { useEffect, useState } from "react";
import { HiDocumentAdd } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { GlobalSettings } from "./components/GeneralSettings";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Page } from "./components/Page";
import { colors } from "./definitions/colors";
import { createDefaultBackDisplay } from "./definitions/defaultBackImage";
import { useShowLogin, useShowSettings } from "./hooks/states";
import { FDIconButtonFixed } from "./lib/components/Button";
import { createButtonBody, createImageBody } from "./lib/configFile/createBody";
import { createFooter } from "./lib/configFile/createFooter";
import { createHeader } from "./lib/configFile/createHeader";
import { loadConfigFile } from "./lib/configFile/loadConfigFile";
import { download } from "./lib/download";
import { AddEventListeners } from "./lib/eventListeners";
import { FDSerialAPI } from "./lib/fdSerialApi";
import {
  AppDispatchContext,
  appReducer,
  AppState,
  AppStateContext,
  IAppReducer,
} from "./states/appState";
import {
  ConfigDispatchContext,
  IConfigReducer,
  configReducer,
  ConfigState,
  ConfigStateContext,
} from "./states/configState";

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
const Main = styled.div`
  * {
    box-sizing: border-box;
  }
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Content = styled.div`
  background-color: ${colors.gray};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  overflow: auto;
  width: 100%;
  height: 100%;
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
            <Main>
              {
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
              }
              <Content id="pages">
                {configState.displaySettingsPages.map(
                  (imagePage, pageIndex) => (
                    <Page pageIndex={pageIndex} key={pageIndex} />
                  )
                )}
              </Content>
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
              <FDIconButtonFixed
                ml={5}
                onClick={() => configDispatch.addPage(undefined)}
              >
                <HiDocumentAdd size={22} />
                Add Page
              </FDIconButtonFixed>
            </Main>
          </AppDispatchContext.Provider>
        </AppStateContext.Provider>
      </ConfigDispatchContext.Provider>
    </ConfigStateContext.Provider>
  );
};

export default App;
