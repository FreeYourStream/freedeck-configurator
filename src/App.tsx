import React, { useCallback, useEffect, useState } from "react";
import { HiDocumentAdd } from "react-icons/hi";
import styled from "styled-components";

import { FDIconButton } from "./components/button";
import { Page } from "./containers/Page";
import { SettingsModal } from "./containers/SettingsModal";
import { colors } from "./definitions/colors";
import {
  getDefaultButtonPage,
  getDefaultDisplay,
  getDefaultDisplayPage,
} from "./definitions/defaultPage";
import {
  useButtonSettingsPages,
  useConvertedImagePages,
  useDisplaySettingsPages,
  useOriginalImagePages,
} from "./hooks.ts/states";
import { useDefaultBackImage } from "./hooks.ts/useDefaultBackImage";
import { useSetOriginalImageCallback } from "./hooks.ts/useSetOriginalImageCallback";
import { composeImage, composeText } from "./lib/convertFile";
import { loadDefaultBackImage } from "./lib/defaultBackImage";
import { EAction } from "./lib/parse/parsePage";

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
  brightness: number;
  contrast: number;
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
export interface IDefaultBackImage {
  image: Buffer;
  settings: IDisplay;
}
function App() {
  const [defaultBackImage, setDefaultBackImage] = useDefaultBackImage();
  const [height] = useState<number>(2);
  const [width] = useState<number>(3);

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

  const [showSettings, setShowSettings] = useState<boolean>(false);
  // only execute on page load
  useEffect(() => {
    loadDefaultBackImage(defaultBackImage, setDefaultBackImage);
  }, []);
  const setOriginalImage = useSetOriginalImageCallback(
    convertedImagePages,
    originalImagePages,
    displaySettingsPages,
    setOriginalImagePages,
    setConvertedImagePages
  );
  const setButtonSettings = useCallback(
    (pageIndex: number, displayIndex: number, newDisplay: IButton) => {
      const newPages = [...buttonSettingsPages];
      newPages[pageIndex][displayIndex] = newDisplay;
      setButtonSettingsPages([...newPages]);
    },
    [buttonSettingsPages, setButtonSettingsPages]
  );
  const setDisplaySettings = useCallback(
    async (pageIndex: number, displayIndex: number, newDisplay: IDisplay) => {
      const newPages = [...displaySettingsPages];
      const oldDisplay = displaySettingsPages[pageIndex][displayIndex];
      if (
        newDisplay.textWithIconSettings.enabled ===
          oldDisplay.textWithIconSettings.enabled &&
        newDisplay.textSettings.text !== "" &&
        originalImagePages[pageIndex][displayIndex] !== null
      ) {
        newDisplay.textWithIconSettings.enabled = true;
      }
      if (
        newDisplay.textSettings.text === "" &&
        oldDisplay.textSettings.text !== "" &&
        originalImagePages[pageIndex][displayIndex] !== null
      ) {
        newDisplay.textWithIconSettings.enabled = false;
      }
      newPages[pageIndex][displayIndex] = newDisplay;
      setDisplaySettingsPages([...newPages]);
      const originalImage = originalImagePages[pageIndex][displayIndex];
      let convertedImage;
      if (originalImage !== null) {
        convertedImage = await composeImage(originalImage, 128, 64, newDisplay);
      } else if (newDisplay.textSettings.text.length > 0) {
        convertedImage = await composeText(128, 64, newDisplay);
      } else {
        convertedImage = new Buffer(1024);
      }
      const newConvertedImages = [...convertedImagePages];
      newConvertedImages[pageIndex][displayIndex] = convertedImage;
      setConvertedImagePages(newConvertedImages);
    },
    [
      convertedImagePages,
      displaySettingsPages,
      originalImagePages,
      setConvertedImagePages,
      setDisplaySettingsPages,
    ]
  );
  const updateAllDefaultBackImages = useCallback(
    (newDefaultBackImage: IDefaultBackImage) => {
      setDefaultBackImage(newDefaultBackImage);
      [...displaySettingsPages].forEach((page, pageIndex) => {
        [...page].forEach((display, displayIndex) => {
          if (display.isGeneratedFromDefaultBackImage) {
            setDisplaySettings(
              pageIndex,
              displayIndex,
              newDefaultBackImage.settings
            );
            setOriginalImage(
              pageIndex,
              displayIndex,
              newDefaultBackImage.image
            );
          }
        });
      });
    },
    [
      displaySettingsPages,
      setDefaultBackImage,
      setDisplaySettings,
      setOriginalImage,
    ]
  );

  const addPage = useCallback(
    async (
      previousPageIndex?: number,
      previousDisplayIndex?: number,
      primary?: boolean
    ) => {
      const newOriginalImagePage = [];
      const newConvertedImagePage = [];
      let newDisplayPage = getDefaultDisplayPage(width, height);
      for (let i = 0; i < width * height; i++) {
        if (previousPageIndex !== undefined && i === 0) {
          newOriginalImagePage.push(Buffer.from(defaultBackImage.image));
          newDisplayPage[i] = {
            ...defaultBackImage.settings,
            isGeneratedFromDefaultBackImage: true,
          };
          newConvertedImagePage.push(
            await composeImage(
              defaultBackImage.image,
              128,
              64,
              defaultBackImage.settings
            )
          );
        } else {
          newOriginalImagePage.push(null);
          newConvertedImagePage.push(new Buffer(1024));
        }
      }

      setOriginalImagePages([...originalImagePages, newOriginalImagePage]);
      setConvertedImagePages([...convertedImagePages, newConvertedImagePage]);

      const newActionSettingPages = [
        ...buttonSettingsPages,
        getDefaultButtonPage(width, height, previousPageIndex),
      ];
      if (
        previousDisplayIndex !== undefined &&
        previousPageIndex !== undefined &&
        primary !== undefined
      ) {
        newActionSettingPages[previousPageIndex][previousDisplayIndex][
          primary ? "primary" : "secondary"
        ].values = [buttonSettingsPages.length];
      }
      setButtonSettingsPages(newActionSettingPages);
      setDisplaySettingsPages([...displaySettingsPages, newDisplayPage]);
      return buttonSettingsPages.length;
    },
    [
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
      defaultBackImage.image,
      defaultBackImage.settings,
    ]
  );
  const deleteImage = useCallback(
    async (pageIndex: number, displayIndex: number) => {
      await setOriginalImage(pageIndex, displayIndex, null);
      await setDisplaySettings(pageIndex, displayIndex, getDefaultDisplay());
    },
    [setDisplaySettings, setOriginalImage]
  );
  const deletePage = useCallback(
    (pageIndex: number) => {
      const newOriginalImages = [...originalImagePages];
      const newConvertedImages = [...convertedImagePages];
      newOriginalImages.splice(pageIndex, 1);
      newConvertedImages.splice(pageIndex, 1);
      setOriginalImagePages(newOriginalImages);
      setConvertedImagePages(newConvertedImages);

      let newActionPages = [...buttonSettingsPages];
      let newImagePages = [...displaySettingsPages];
      newActionPages.splice(pageIndex, 1);
      newImagePages.splice(pageIndex, 1);
      newActionPages = newActionPages.map<IButtonPage>((newPage) => {
        const displays = newPage.map<IButton>((display) => {
          if (display.primary.mode === EAction.changeLayout) {
            if (display.primary.values[0] >= pageIndex) {
              display.primary.values[0] -= 1;
            }
          }
          if (
            display.secondary.enabled &&
            display.secondary.mode === EAction.changeLayout
          ) {
            if (display.secondary.values[0] >= pageIndex) {
              display.secondary.values[0] -= 1;
            }
          }
          return { ...display };
        });
        return displays;
      });
      setButtonSettingsPages(newActionPages);
      setDisplaySettingsPages(newImagePages);
    },
    [
      buttonSettingsPages,
      convertedImagePages,
      displaySettingsPages,
      originalImagePages,
      setButtonSettingsPages,
      setConvertedImagePages,
      setDisplaySettingsPages,
      setOriginalImagePages,
    ]
  );

  const switchDisplays = useCallback(
    (
      aPageIndex: number,
      bPageIndex: number,
      aDisplayIndex: number,
      bDisplayIndex: number
    ) => {
      const aDisplayAction = {
        ...buttonSettingsPages[aPageIndex][aDisplayIndex],
      };
      const bDisplayAction = {
        ...buttonSettingsPages[bPageIndex][bDisplayIndex],
      };
      const newActionPages = [...buttonSettingsPages];
      newActionPages[aPageIndex][aDisplayIndex] = bDisplayAction;
      newActionPages[bPageIndex][bDisplayIndex] = aDisplayAction;
      setButtonSettingsPages(newActionPages);

      const aDisplayImage = {
        ...displaySettingsPages[aPageIndex][aDisplayIndex],
      };
      const bDisplayImage = {
        ...displaySettingsPages[bPageIndex][bDisplayIndex],
      };
      const newImagePages = [...displaySettingsPages];
      newImagePages[aPageIndex][aDisplayIndex] = bDisplayImage;
      newImagePages[bPageIndex][bDisplayIndex] = aDisplayImage;
      setDisplaySettingsPages(newImagePages);

      const aOriginalImage = originalImagePages[aPageIndex][aDisplayIndex];
      const bOriginalImage = originalImagePages[bPageIndex][bDisplayIndex];
      const newOriginalImages = [...originalImagePages];
      newOriginalImages[aPageIndex][aDisplayIndex] = bOriginalImage;
      newOriginalImages[bPageIndex][bDisplayIndex] = aOriginalImage;
      setOriginalImagePages(newOriginalImages);

      const aConvertedImage = convertedImagePages[aPageIndex][aDisplayIndex];
      const bConvertedImage = convertedImagePages[bPageIndex][bDisplayIndex];
      const newConvertedImages = [...convertedImagePages];
      newConvertedImages[aPageIndex][aDisplayIndex] = bConvertedImage;
      newConvertedImages[bPageIndex][bDisplayIndex] = aConvertedImage;
      setConvertedImagePages(newConvertedImages);
    },
    [
      buttonSettingsPages,
      convertedImagePages,
      displaySettingsPages,
      originalImagePages,
      setButtonSettingsPages,
      setConvertedImagePages,
      setDisplaySettingsPages,
      setOriginalImagePages,
    ]
  );

  const hasOriginalImage = useCallback(
    (pageIndex: number, displayIndex: number) =>
      !!originalImagePages[pageIndex][displayIndex],
    [originalImagePages]
  );

  // const loadConfigFile = (configFile: File) =>
  //   handleFileSelect(configFile).then((arrayBuffer) => {
  //     const config = parseConfig(Buffer.from(arrayBuffer));
  //     const affectedPages = [...new Array(config.pageCount).keys()];
  //     setAffectedPages(affectedPages);
  //     setHeight(config.height);
  //     setWidth(config.width);
  //     setPageBuffers(config.pages);
  //     setImageBuffers(config.images);
  //   });
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
        <SettingsModal
          setClose={() => setShowSettings(false)}
          onClose={() => updateAllDefaultBackImages(defaultBackImage)}
          defaultBackImage={defaultBackImage}
          setDefaultBackImage={setDefaultBackImage}
        />
      )}
    </Main>
  );
}

export default App;
