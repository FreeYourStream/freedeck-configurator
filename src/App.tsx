import React, { useEffect, useReducer, useState } from "react";
import { HiDocumentAdd } from "react-icons/hi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { GlobalSettings } from "./components/GeneralSettings";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Page } from "./components/Page";
import { colors } from "./definitions/colors";
import { loadDefaultBackDisplay } from "./definitions/defaultBackImage";
import { useAddPageCallback } from "./hooks/callbacks/addPage";
import { useDeleteImageCallback } from "./hooks/callbacks/deleteImage";
import { useDeletePageCallback } from "./hooks/callbacks/deletePage";
import { useMakeDefaultBackImageCallback } from "./hooks/callbacks/makeDefaultBackImage";
import { useSetButtonSettingsCallback } from "./hooks/callbacks/setButtonSettings";
import { useSetDisplaySettingsCallback } from "./hooks/callbacks/setDisplaySettings";
import { useSetOriginalImageCallback } from "./hooks/callbacks/setOriginalImage";
import { useSwitchDisplaysCallback } from "./hooks/callbacks/switchDisplay";
import { useUpdateAllDefaultBackImagesCallback } from "./hooks/callbacks/updateAllDefaultBackImages";
import {
  useConvertedImagePages,
  useDefaultBackDisplay,
  useDisplaySettingsPages,
  useOriginalImagePages,
  useShowLogin,
  useShowSettings,
} from "./hooks/states";
import { IButtonSettings, IDisplay, IOriginalImage } from "./interfaces";
import { FDIconButtonFixed } from "./lib/components/Button";
import { createButtonBody, createImageBody } from "./lib/configFile/createBody";
import { createFooter } from "./lib/configFile/createFooter";
import { createHeader } from "./lib/configFile/createHeader";
import { loadConfigFile } from "./lib/configFile/loadConfigFile";
import { download } from "./lib/download";
import { FDSerialAPI } from "./lib/fdSerialApi";
import { defaultState, DispatchContext, reducer, StateContext } from "./state";

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

function App() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [defaultBackDisplay, setDefaultBackDisplay] = useDefaultBackDisplay();

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
    loadDefaultBackDisplay(setDefaultBackDisplay);
    // eslint-disable-next-line
  }, []); // only execute on page load

  const [serialApi, setSerialApi] = useState<FDSerialAPI>();
  useEffect(() => {
    if (!(navigator as any).serial) return;
    setSerialApi(new FDSerialAPI());
  }, []);
  const [displaySettingsPages, setDisplaySettingsPages] =
    useDisplaySettingsPages();

  const [originalImagePages, setOriginalImagePages] = useOriginalImagePages();

  const [convertedImagePages, setConvertedImagePages] =
    useConvertedImagePages();

  const [showSettings, setShowSettings] = useShowSettings();
  const [showLogin, setShowLogin] = useShowLogin();
  const setOriginalImage = useSetOriginalImageCallback(
    convertedImagePages,
    originalImagePages,
    displaySettingsPages,
    setOriginalImagePages,
    setConvertedImagePages
  );

  const setDisplaySettings = useSetDisplaySettingsCallback(
    displaySettingsPages,
    originalImagePages,
    convertedImagePages,
    setDisplaySettingsPages,
    setConvertedImagePages
  );

  const updateAllDefaultBackImages = useUpdateAllDefaultBackImagesCallback(
    displaySettingsPages,
    setDefaultBackDisplay,
    setDisplaySettings,
    setOriginalImage
  );

  const addPage = useAddPageCallback(
    state.width,
    state.height,
    setOriginalImagePages,
    originalImagePages,
    setConvertedImagePages,
    convertedImagePages,
    state.buttonSettingsPages,
    setButtonSettingsPages,
    setDisplaySettingsPages,
    displaySettingsPages,
    defaultBackDisplay
  );

  const deleteImage = useDeleteImageCallback(
    setDisplaySettings,
    setOriginalImage
  );
  const makeDefaultBackImage = useMakeDefaultBackImageCallback(
    defaultBackDisplay,
    setDisplaySettings,
    setOriginalImage
  );
  const deletePage = useDeletePageCallback(
    buttonSettingsPages,
    convertedImagePages,
    displaySettingsPages,
    originalImagePages,
    setButtonSettingsPages,
    setConvertedImagePages,
    setDisplaySettingsPages,
    setOriginalImagePages
  );

  const switchDisplays = useSwitchDisplaysCallback(
    buttonSettingsPages,
    convertedImagePages,
    displaySettingsPages,
    originalImagePages,
    setButtonSettingsPages,
    setConvertedImagePages,
    setDisplaySettingsPages,
    setOriginalImagePages
  );

  const createConfigBuffer = (): Buffer =>
    Buffer.concat([
      createHeader(
        state.width,
        state.height,
        state.brightness,
        displaySettingsPages.length
      ),
      createButtonBody(buttonSettingsPages),
      createImageBody(convertedImagePages),
      createFooter({
        buttonSettingsPages,
        defaultBackDisplay,
        displaySettingsPages,
        originalImagePages,
      }),
    ]);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Main>
          {
            <Header
              loadConfigFile={(filesOrBuffer) =>
                loadConfigFile(
                  filesOrBuffer,
                  (width) =>
                    dispatch({
                      type: "setWidth",
                      width: parseInt(width.toString() ?? "0"),
                    }),
                  (height) =>
                    dispatch({
                      type: "setHeight",
                      height: parseInt(height.toString() ?? "0"),
                    }),
                  (brightness) =>
                    dispatch({
                      type: "setBrightness",
                      brightness: parseInt(brightness.toString() ?? "0"),
                    }),
                  setButtonSettingsPages,
                  setDisplaySettingsPages,
                  setOriginalImagePages,
                  setConvertedImagePages,
                  setDefaultBackDisplay
                )
              }
              saveConfigFile={() => {
                if (displaySettingsPages.length === 0) return;
                const completeBuffer = createConfigBuffer();

                completeBuffer && download(completeBuffer);
              }}
              setShowSettings={setShowSettings}
              createConfigBuffer={createConfigBuffer}
              openLogin={() => setShowLogin(true)}
              serialApi={serialApi}
            />
          }
          <Content id="pages">
            {displaySettingsPages.map((imagePage, pageIndex) => (
              <Page
                deleteImage={(displayIndex: number) =>
                  deleteImage(pageIndex, displayIndex)
                }
                makeDefaultBackImage={(displayIndex: number) => {
                  makeDefaultBackImage(pageIndex, displayIndex);
                }}
                pageIndex={pageIndex}
                originalImages={originalImagePages[pageIndex]}
                convertedImages={convertedImagePages[pageIndex]}
                buttonSettingsPages={buttonSettingsPages[pageIndex]}
                displaySettingsPages={displaySettingsPages[pageIndex]}
                key={pageIndex}
                setOriginalImage={(
                  displayIndex: number,
                  image: IOriginalImage
                ) => setOriginalImage(pageIndex, displayIndex, image)}
                deletePage={deletePage}
                pageCount={buttonSettingsPages.length}
                addPage={(displayIndex, primary) =>
                  addPage(pageIndex, displayIndex, primary)
                }
                setButtonSettings={(
                  displayIndex: number,
                  newDisplay: IButtonSettings
                ) => setButtonSettings(pageIndex, displayIndex, newDisplay)}
                setDisplaySettings={(
                  displayIndex: number,
                  newDisplay: IDisplay
                ) => setDisplaySettings(pageIndex, displayIndex, newDisplay)}
                switchDisplays={switchDisplays}
              />
            ))}
          </Content>
          <GlobalSettings
            visible={showSettings}
            setClose={() => setShowSettings(false)}
            onClose={() => updateAllDefaultBackImages(defaultBackDisplay)}
            defaultBackDisplay={defaultBackDisplay}
            setDefaultBackDisplay={setDefaultBackDisplay}
            readyToSave={!!buttonSettingsPages.length}
            loadConfigFile={(buffer: Buffer) =>
              loadConfigFile(
                buffer,
                (width) =>
                  dispatch({
                    type: "setWidth",
                    width: parseInt(width.toString() ?? "0"),
                  }),
                (height) =>
                  dispatch({
                    type: "setHeight",
                    height: parseInt(height.toString() ?? "0"),
                  }),
                (brightness) =>
                  dispatch({
                    type: "setBrightness",
                    brightness: parseInt(brightness.toString() ?? "0"),
                  }),
                setButtonSettingsPages,
                setDisplaySettingsPages,
                setOriginalImagePages,
                setConvertedImagePages,
                setDefaultBackDisplay
              )
            }
            getConfigBuffer={() => createConfigBuffer()}
            serialApi={serialApi}
          />
          <Login visible={showLogin} setClose={() => setShowLogin(false)} />
          <StyledToastContainer />
          <FDIconButtonFixed ml={5} onClick={() => addPage()}>
            <HiDocumentAdd size={22} />
            Add Page
          </FDIconButtonFixed>
        </Main>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
