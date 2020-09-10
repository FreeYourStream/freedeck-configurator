import React, { useEffect } from "react";
import { HiDocumentAdd } from "react-icons/hi";
import styled from "styled-components";

import { GlobalSettings } from "./components/GlobalSettings";
import { Page } from "./components/Page";
import { colors } from "./definitions/colors";
import { useAddPageCallback } from "./hooks/callbacks/addPage";
import { useDeleteImageCallback } from "./hooks/callbacks/deleteImage";
import { useDeletePageCallback } from "./hooks/callbacks/deletePage";
import { useHasOriginalImageCallback } from "./hooks/callbacks/hasOriginalImage";
import { useMakeDefaultBackImageCallback } from "./hooks/callbacks/makeDefaultBackImage";
import { useSetButtonSettingsCallback } from "./hooks/callbacks/setButtonSettings";
import { useSetDisplaySettingsCallback } from "./hooks/callbacks/setDisplaySettings";
import { useSetOriginalImageCallback } from "./hooks/callbacks/setOriginalImage";
import { useSwitchDisplaysCallback } from "./hooks/callbacks/switchDisplay";
import { useUpdateAllDefaultBackImagesCallback } from "./hooks/callbacks/updateAllDefaultBackImages";
import {
  useButtonSettingsPages,
  useConvertedImagePages,
  useDefaultBackDisplay,
  useDisplaySettingsPages,
  useHeight,
  useOriginalImagePages,
  useShowSettings,
  useWidth,
} from "./hooks/states";
import { FDIconButton } from "./lib/components/Button";
import { EAction } from "./lib/configFile/parsePage";
import { loadDefaultBackDisplay } from "./lib/defaultBackImage";

const Main = styled.div`
  * {
    box-sizing: border-box;
  }
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const Header = styled.div`
  background-color: ${colors.gray};
  border-bottom: 1px solid ${colors.black};
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: center;
  padding: 18px;
`;

const HeadLine = styled.div`
  display: flex;
`;

const HeadLineThin = styled.div`
  color: white;
  font-family: "Barlow", sans-serif;
  font-size: 36px;
  font-weight: 100;
`;
const HeadLineThick = styled.div`
  color: white;
  font-family: "Barlow", sans-serif;
  font-size: 36px;
  font-weight: bold;
`;

const Buttons = styled.div`
  display: flex;
  height: 52px;
  justify-content: space-between;
`;

const Horiz = styled.div`
  display: flex;
  align-items: center;
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

const InvisibleFile = styled.input.attrs({ type: "file" })`
  display: none;
`;

export interface IButtonSettings {
  mode: EAction;
  values: number[];
  enabled: boolean;
}

export interface ITextWithIconSettings {
  enabled: boolean;
  iconWidthMultiplier: number;
}

export interface IImageSettings {
  dither: boolean;
  blackThreshold: number;
  contrast: number;
  brightness: number;
  whiteThreshold: number;
  invert: boolean;
}

export interface IButton {
  primary: IButtonSettings;
  secondary: IButtonSettings;
}
export interface ITextSettings {
  text: string;
  font: string;
}

export interface IDisplay {
  imageSettings: IImageSettings;
  imageIsConverted: boolean;
  textSettings: ITextSettings;
  textWithIconSettings: ITextWithIconSettings;
  isGeneratedFromDefaultBackImage: boolean;
  previousPage?: number;
  previousDisplay?: number;
}
export type IOriginalImage = Buffer | null;
export type IConvertedImage = Buffer;
export type IOriginalImagePage = Array<IOriginalImage>;
export type IConvertedImagePage = Array<IConvertedImage>;
export type IButtonPage = IButton[];
export type IDisplayPage = IDisplay[];
export interface IDefaultBackDisplay {
  image: Buffer;
  settings: IDisplay;
}
function App() {
  const [defaultBackDisplay, setDefaultBackDisplay] = useDefaultBackDisplay();

  useEffect(() => {
    loadDefaultBackDisplay(setDefaultBackDisplay);
  }, []); // only execute on page load

  const [height] = useHeight();
  const [width] = useWidth();

  const [
    buttonSettingsPages,
    setButtonSettingsPages,
  ] = useButtonSettingsPages();

  const [
    displaySettingsPages,
    setDisplaySettingsPages,
  ] = useDisplaySettingsPages();

  const [originalImagePages, setOriginalImagePages] = useOriginalImagePages();

  const [
    convertedImagePages,
    setConvertedImagePages,
  ] = useConvertedImagePages();

  const [showSettings, setShowSettings] = useShowSettings();

  const setOriginalImage = useSetOriginalImageCallback(
    convertedImagePages,
    originalImagePages,
    displaySettingsPages,
    setOriginalImagePages,
    setConvertedImagePages
  );
  const setButtonSettings = useSetButtonSettingsCallback(
    buttonSettingsPages,
    setButtonSettingsPages
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
    width,
    height,
    setOriginalImagePages,
    originalImagePages,
    setConvertedImagePages,
    convertedImagePages,
    buttonSettingsPages,
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

  const hasOriginalImage = useHasOriginalImageCallback(originalImagePages);

  // const loadConfigFile = (configFile: File) =>
  //   handleFileSelect(configFile).then((arrayBuffer) => {
  //     const config = parseConfig(Buffer.from(arrayBuffer));
  //     const affectedPages = [...new Array(config.pageCount).keys()];
  //     setAffectedPages(affectedPages);
  //     setHeight(config.height);
  //     setWidth(config.width);
  //     setPageBuffInvisibleFile
  return (
    <Main>
      <Header id="header">
        <HeadLine>
          <HeadLineThin>Free</HeadLineThin>
          <HeadLineThick>Deck</HeadLineThick>
        </HeadLine>
        <Buttons>
          <form
            onSubmit={(event) => {
              event.preventDefault();
            }}
          >
            <Horiz>
              <FDIconButton
                size={3}
                icon={"fa/FaFileUpload"}
                htmlFor="loadConfig"
              >
                Load Config
              </FDIconButton>
              <InvisibleFile
                id="loadConfig"
                onChange={async (event) => {
                  // if (event.target.files?.length) {
                  //   loadConfigFile(event.target.files[0]);
                  // }
                }}
              ></InvisibleFile>
              <FDIconButton
                icon="fa/FaSave"
                ml={4}
                size={3}
                onClick={() => {
                  const config = {
                    imageSettingPages: displaySettingsPages,
                    actionSettingPages: buttonSettingsPages,
                  };
                  //save this at the end of the config
                  const buffer = Buffer.from(JSON.stringify(config), "binary");
                  // const header = new Buffer(HEADER_SIZE);
                  // header.writeUInt8(3, 0);
                  // header.writeUInt8(2, 1);
                  // const offset = pageBuffers.length * width * height + 1;
                  // header.writeUInt16LE(offset, 2);
                  // const newConfig = Buffer.concat([
                  //   header,
                  //   ...pageBuffers,
                  //   ...imageBuffers.map((imageBuffer) =>
                  //     optimizeForSSD1306(imageBuffer)
                  //   ),
                  // ]);
                  // download(newConfig);
                }}
              >
                Save Config
              </FDIconButton>
            </Horiz>
          </form>
          <Horiz>
            <FDIconButton
              ml={5}
              icon="ai/AiFillSetting"
              onClick={() => setShowSettings(true)}
            >
              Settings
            </FDIconButton>
            <FDIconButton ml={5} onClick={() => addPage()}>
              <HiDocumentAdd size={22} />
              Add Page
            </FDIconButton>
          </Horiz>
        </Buttons>
      </Header>
      <Content id="pages">
        {displaySettingsPages.map((imagePage, pageIndex) => (
          <Page
            height={height}
            width={width}
            deleteImage={(displayIndex: number) =>
              deleteImage(pageIndex, displayIndex)
            }
            makeDefaultBackImage={(displayIndex: number) => {
              makeDefaultBackImage(pageIndex, displayIndex);
            }}
            pageIndex={pageIndex}
            hasOriginalImage={(displayIndex: number) =>
              hasOriginalImage(pageIndex, displayIndex)
            }
            convertedImages={convertedImagePages[pageIndex]}
            buttonSettingsPages={buttonSettingsPages[pageIndex]}
            displaySettingsPages={displaySettingsPages[pageIndex]}
            key={pageIndex}
            setOriginalImage={(displayIndex: number, image: IOriginalImage) =>
              setOriginalImage(pageIndex, displayIndex, image)
            }
            deletePage={deletePage}
            pageCount={buttonSettingsPages.length}
            addPage={(displayIndex, primary) =>
              addPage(pageIndex, displayIndex, primary)
            }
            setButtonSettings={(displayIndex: number, newDisplay: IButton) =>
              setButtonSettings(pageIndex, displayIndex, newDisplay)
            }
            setDisplaySettings={(displayIndex: number, newDisplay: IDisplay) =>
              setDisplaySettings(pageIndex, displayIndex, newDisplay)
            }
            switchDisplays={switchDisplays}
          />
        ))}
      </Content>
      {showSettings && (
        <GlobalSettings
          setClose={() => setShowSettings(false)}
          onClose={() => updateAllDefaultBackImages(defaultBackDisplay)}
          defaultBackDisplay={defaultBackDisplay}
          setDefaultBackDisplay={setDefaultBackDisplay}
        />
      )}
    </Main>
  );
}

export default App;
