import { type } from "os";

import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { FDButton } from "./components/lib/button";
import { Page } from "./components/Page";
import { colors } from "./definitions/colors";
import {
  defaultImageDisplay,
  getDefaultActionPage,
  getDefaultImagePage,
} from "./definitions/defaultPage";
import { composeImage, composeText } from "./lib/convertFile";
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

const LoadConfigFileInner = styled.label`
  user-select: none;
  font-size: 24px;
  padding: 8px;
  font-family: sans-serif;
  font-weight: bold;
  position: relative;
  width: auto;
  color: #ecf0f1;
  text-decoration: none;
  border-radius: 5px;
  border: solid 1px ${colors.accent};
  background: ${colors.accentDark};
  text-align: center;
  /* padding: 16px 18px 14px; */
  transition: all 0.1s;
  box-shadow: 0px 0px 0px, 0px 0px 0px, 0px 6px 0px ${colors.accentDark},
    0px 0px 0px;
  cursor: pointer;
`;

const LoadConfigFile = styled.div`
  transition: all 0.05s;
  padding-bottom: 6px;
  :hover {
    padding-top: 4px;
    padding-bottom: 2px;
  }
  &:hover ${LoadConfigFileInner} {
    box-shadow: 0px 0px 0px, 0px 0px 0px, 0px 2px 0px ${colors.accentDark},
      0px 0px 0px;
  }

  :active {
    padding-top: 6px;
    padding-bottom: 0px;
  }
  &:active ${LoadConfigFileInner} {
    box-shadow: none;
  }
`;

const InvisibleFile = styled.input.attrs({ type: "file" })`
  display: none;
`;

const SaveConfigFile = styled(FDButton)``;

const AddPage = styled(FDButton)``;

export interface IActionSetting {
  mode: EAction;
  values: number[];
  enabled: boolean;
}

export interface ITextWithIconSettings {
  font: string;
  enabled: boolean;
}

export interface IImageSettings {
  dither: boolean;
  contrast: number;
  invert: boolean;
}

export interface IActionDisplay {
  primary: IActionSetting;
  secondary: IActionSetting;
}
export interface IImageDisplay {
  imageSettings: IImageSettings;
  imageIsConverted: boolean;
  text: string;
  textWithIconSettings: ITextWithIconSettings;
}
export type IOriginalImage = Buffer | null;
export type IConvertedImage = Buffer;
export type IOriginalImagePage = Array<IOriginalImage>;
export type IConvertedImagePage = Array<IConvertedImage>;
export type IActionSettingPage = IActionDisplay[];
export type IImageSettingPage = IImageDisplay[];

function App() {
  const [height] = useState<number>(2);
  const [width] = useState<number>(3);
  const [actionSettingPages, setActionSettingPages] = useState<
    IActionSettingPage[]
  >([]);
  const [imageSettingPages, setImageSettingPages] = useState<
    IImageSettingPage[]
  >([]);

  const [originalImagePages, setOriginalImagePages] = useState<
    IOriginalImagePage[]
  >([]);

  const [convertedImagePages, setConvertedImagePages] = useState<
    IConvertedImagePage[]
  >([]);

  const setOriginalImage = useCallback(
    async (pageIndex: number, displayIndex: number, image: Buffer | null) => {
      const offset = width * height * pageIndex + displayIndex;

      const display = imageSettingPages[pageIndex][displayIndex];
      let convertedImage: IConvertedImage;
      if (image !== null) {
        convertedImage = await composeImage(
          image,
          128,
          64,
          display.imageSettings,
          display.textWithIconSettings,
          display.text
        );
      } else {
        convertedImage = new Buffer(1024);
      }
      const newOriginalImages = [...originalImagePages];
      newOriginalImages[offset][displayIndex] = image;
      setOriginalImagePages(newOriginalImages);

      const newConvertedImages = [...convertedImagePages];
      newConvertedImages[offset][displayIndex] = convertedImage;
      setConvertedImagePages(newConvertedImages);
    },
    [height, width, convertedImagePages, originalImagePages, imageSettingPages]
  );
  const setActionDisplay = useCallback(
    (pageIndex: number, displayIndex: number, newDisplay: IActionDisplay) => {
      const newPages = [...actionSettingPages];
      newPages[pageIndex][displayIndex] = newDisplay;
      setActionSettingPages([...newPages]);
    },
    [actionSettingPages]
  );
  const setImageSettingsDisplay = useCallback(
    async (
      pageIndex: number,
      displayIndex: number,
      newDisplay: IImageDisplay
    ) => {
      const newPages = [...imageSettingPages];
      newPages[pageIndex][displayIndex] = newDisplay;
      setImageSettingPages([...newPages]);
      const originalImage = originalImagePages[pageIndex][displayIndex];
      let convertedImage;
      if (originalImage !== null) {
        convertedImage = await composeImage(
          originalImage,
          128,
          64,
          newDisplay.imageSettings,
          newDisplay.textWithIconSettings,
          newDisplay.text
        );
      } else if (newDisplay.text.length > 0) {
        convertedImage = await composeText(
          128,
          64,
          newDisplay.imageSettings.dither,
          newDisplay.text,
          newDisplay.textWithIconSettings.font,
          newDisplay.imageSettings.contrast
        );
      } else {
        convertedImage = new Buffer(1024);
      }
      const newConvertedImages = [...convertedImagePages];
      newConvertedImages[pageIndex][displayIndex] = convertedImage;
      setConvertedImagePages(newConvertedImages);
    },
    [convertedImagePages, imageSettingPages, originalImagePages]
  );
  const addPage = useCallback(
    (previousPageIndex?: number) => {
      const newOriginalImagePage = [];
      const newConvertedImagePage = [];
      for (let i = 0; i < width * height; i++) {
        newOriginalImagePage.push(null);
        newConvertedImagePage.push(new Buffer(1024));
      }
      const newOriginalImagePages = [
        ...originalImagePages,
        newOriginalImagePage,
      ];
      const newConvertedImagePages = [
        ...convertedImagePages,
        newConvertedImagePage,
      ];
      setOriginalImagePages([...newOriginalImagePages]);
      setConvertedImagePages([...newConvertedImagePages]);

      setImageSettingPages([
        ...imageSettingPages,
        getDefaultImagePage(width, height),
      ]);
      setActionSettingPages([
        ...actionSettingPages,
        getDefaultActionPage(height, width, previousPageIndex),
      ]);

      return actionSettingPages.length;
    },
    [
      actionSettingPages,
      height,
      width,
      imageSettingPages,
      originalImagePages,
      convertedImagePages,
    ]
  );
  const deleteImage = useCallback(
    (pageIndex: number, displayIndex: number) => {
      setImageSettingsDisplay(pageIndex, displayIndex, defaultImageDisplay);
      setOriginalImage(pageIndex, displayIndex, null);
    },
    [setImageSettingsDisplay, setOriginalImage]
  );
  const deletePage = useCallback(
    (pageIndex: number) => {
      const newOriginalImages = [...originalImagePages];
      const newConvertedImages = [...convertedImagePages];
      newOriginalImages.splice(pageIndex, 1);
      newConvertedImages.splice(pageIndex, 1);
      setOriginalImagePages(newOriginalImages);
      setConvertedImagePages(newConvertedImages);

      let newActionPages = [...actionSettingPages];
      let newImagePages = [...imageSettingPages];
      newActionPages.splice(pageIndex, 1);
      newImagePages.splice(pageIndex, 1);
      newActionPages = newActionPages.map<IActionSettingPage>((newPage) => {
        const displays = newPage.map<IActionDisplay>((display) => {
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
      setActionSettingPages(newActionPages);
      setImageSettingPages(newImagePages);
    },
    [
      actionSettingPages,
      convertedImagePages,
      imageSettingPages,
      originalImagePages,
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
        ...actionSettingPages[aPageIndex][aDisplayIndex],
      };
      const bDisplayAction = {
        ...actionSettingPages[bPageIndex][bDisplayIndex],
      };
      const newActionPages = [...actionSettingPages];
      newActionPages[aPageIndex][aDisplayIndex] = bDisplayAction;
      newActionPages[bPageIndex][bDisplayIndex] = aDisplayAction;
      setActionSettingPages(newActionPages);

      const aDisplayImage = {
        ...imageSettingPages[aPageIndex][aDisplayIndex],
      };
      const bDisplayImage = {
        ...imageSettingPages[bPageIndex][bDisplayIndex],
      };
      const newImagePages = [...imageSettingPages];
      newImagePages[aPageIndex][aDisplayIndex] = bDisplayImage;
      newImagePages[bPageIndex][bDisplayIndex] = aDisplayImage;
      setImageSettingPages(newImagePages);

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
      actionSettingPages,
      convertedImagePages,
      imageSettingPages,
      originalImagePages,
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
              <LoadConfigFile>
                <LoadConfigFileInner htmlFor="loadConfig">
                  Load Config
                </LoadConfigFileInner>
              </LoadConfigFile>
              <InvisibleFile
                id="loadConfig"
                onChange={async (event) => {
                  // if (event.target.files?.length) {
                  //   loadConfigFile(event.target.files[0]);
                  // }
                }}
              ></InvisibleFile>
              <SaveConfigFile
                ml={16}
                size={3}
                onClick={() => {
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
              </SaveConfigFile>
            </Horiz>
          </form>
          <Horiz>
            <AddPage
              onClick={() => {
                addPage();
              }}
            >
              Add Page +
            </AddPage>
          </Horiz>
        </Buttons>
      </Header>
      <Content id="pages">
        {actionSettingPages.map((actionPage, pageIndex) => (
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
            actionPage={actionPage}
            imagePage={imageSettingPages[pageIndex]}
            key={pageIndex}
            setOriginalImage={(displayIndex: number, image: IOriginalImage) =>
              setOriginalImage(pageIndex, displayIndex, image)
            }
            deletePage={deletePage}
            pageCount={actionSettingPages.length}
            addPage={() => addPage(pageIndex)}
            setDisplayActionSettings={(
              displayIndex: number,
              newDisplay: IActionDisplay
            ) => setActionDisplay(pageIndex, displayIndex, newDisplay)}
            setDisplayImageSettings={(
              displayIndex: number,
              newDisplay: IImageDisplay
            ) => setImageSettingsDisplay(pageIndex, displayIndex, newDisplay)}
            switchDisplays={switchDisplays}
          />
        ))}
      </Content>
    </Main>
  );
}

export default App;
