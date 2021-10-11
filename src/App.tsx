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
import { FDSerialAPI } from "./lib/fdSerialApi";
import {
  DispatchContext,
  IReducer,
  reducer,
  State,
  StateContext,
} from "./state";

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

const App: React.FC<{ defaultState: State }> = ({ defaultState }) => {
  const [state, dispatch] = useSimpleReducer<State, IReducer>(
    defaultState,
    reducer
  );

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      if (!localStorage.getItem("closedPWACTA"))
        toast(
          "You can install the configurator to have it offline! Click here to install",
          {
            autoClose: false,
            position: "bottom-right",
            onClose: () => localStorage.setItem("closedPWACTA", "true"),
            onClick: () => (e as any).prompt(),
          }
        );
    });
    // eslint-disable-next-line
  }, []); // only execute on page load

  const [serialApi, setSerialApi] = useState<FDSerialAPI>();
  useEffect(() => {
    if (!(navigator as any).serial) return;
    setSerialApi(new FDSerialAPI());
  }, []);

  const [showSettings, setShowSettings] = useShowSettings();
  const [showLogin, setShowLogin] = useShowLogin();

  const createConfigBuffer = async (): Promise<Buffer> =>
    Buffer.concat([
      createHeader(
        state.width,
        state.height,
        state.brightness,
        state.buttonSettingsPages.length
      ),
      createButtonBody(state.buttonSettingsPages),
      createImageBody(
        state.displaySettingsPages.map((page) =>
          page.map((display) => display.convertedImage)
        )
      ),
      createFooter({
        buttonSettingsPages: state.buttonSettingsPages,
        defaultBackDisplay: await state.defaultBackDisplay,
        displaySettingsPages: state.displaySettingsPages,
        originalImagePages: state.displaySettingsPages.map((page) =>
          page.map((display) => display.originalImage)
        ),
      }),
    ]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Main>
          {
            <Header
              loadConfigFile={(filesOrBuffer) =>
                loadConfigFile(filesOrBuffer, dispatch.setState)
              }
              saveConfigFile={async () => {
                if (state.displaySettingsPages.length === 0) return;
                const completeBuffer = await createConfigBuffer();

                completeBuffer && download(completeBuffer);
              }}
              setShowSettings={setShowSettings}
              createConfigBuffer={createConfigBuffer}
              openLogin={() => setShowLogin(true)}
              serialApi={serialApi}
            />
          }
          <Content id="pages">
            {state.displaySettingsPages.map((imagePage, pageIndex) => (
              <Page pageIndex={pageIndex} key={pageIndex} />
            ))}
          </Content>
          <GlobalSettings
            visible={showSettings}
            setClose={() => setShowSettings(false)}
            onClose={async () =>
              dispatch.updateAllDefaultBackImages(
                await state.defaultBackDisplay
              )
            }
            readyToSave={!!state.buttonSettingsPages.length}
            loadConfigFile={(buffer: Buffer) =>
              loadConfigFile(buffer, dispatch.setState)
            }
            getConfigBuffer={createConfigBuffer}
            serialApi={serialApi}
          />
          <Login visible={showLogin} setClose={() => setShowLogin(false)} />
          <StyledToastContainer />
          <FDIconButtonFixed ml={5} onClick={() => dispatch.addPage(undefined)}>
            <HiDocumentAdd size={22} />
            Add Page
          </FDIconButtonFixed>
        </Main>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export default App;
