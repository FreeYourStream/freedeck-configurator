import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { FDButton } from "./components/lib/button";
import { Page } from "./components/Page";
import { colors } from "./definitions/colors";
import {
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

interface IOriginalImage {
  _revision: number;
  image: Buffer | null;
}

interface IConvertedImage {
  _revision: number;
  image: Buffer;
}

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
  _revision: number;
}
export interface IImageDisplay {
  imageSettings: IImageSettings;
  imageIsConverted: boolean;
  text: string;
  textWithIconSettings: ITextWithIconSettings;
  _revision: number;
}
export interface IActionPage {
  displays: IActionDisplay[];
}
export interface IImagePage {
  displays: IImageDisplay[];
}

function App() {
  const [height] = useState<number>(2);
  const [width] = useState<number>(3);
  const [actionPages, setActionPages] = useState<IActionPage[]>([]);
  const [imagePages, setImagePages] = useState<IImagePage[]>([]);

  const [originalImages, setOriginalImages] = useState<IOriginalImage[]>([]);

  const [convertedImages, setConvertedImages] = useState<IConvertedImage[]>([]);

  const setOriginalImage = useCallback(
    async (pageIndex: number, displayIndex: number, image: Buffer) => {
      console.log(originalImages.length);
      const offset = width * height * pageIndex + displayIndex;

      const display = imagePages[pageIndex].displays[displayIndex];
      const convertedImage = await composeImage(
        image,
        128,
        64,
        display.imageSettings,
        display.textWithIconSettings,
        display.text
      );
      const newOriginalImages = [...originalImages];
      newOriginalImages[offset] = {
        image,
        _revision: newOriginalImages[offset]._revision + 1,
      };
      setOriginalImages(newOriginalImages);

      const newConvertedImages = [...convertedImages];
      newConvertedImages[offset] = {
        image: convertedImage,
        _revision: newConvertedImages[offset]._revision + 1,
      };
      setConvertedImages(newConvertedImages);
    },
    [height, width, convertedImages, originalImages, imagePages]
  );

  const addPage = useCallback(
    (previousPageIndex?: number) => {
      const newOriginalImages = [...originalImages];
      const newConvertedImages = [...convertedImages];
      for (let i = 0; i < width * height; i++) {
        newOriginalImages.push({ _revision: 0, image: null });
        newConvertedImages.push({ _revision: 0, image: new Buffer(1024) });
      }
      setOriginalImages([...newOriginalImages]);
      setConvertedImages([...newConvertedImages]);

      setImagePages([...imagePages, getDefaultImagePage(width, height)]);
      setActionPages([
        ...actionPages,
        getDefaultActionPage(height, width, previousPageIndex),
      ]);

      return actionPages.length;
    },
    [actionPages, height, width, imagePages, originalImages, convertedImages]
  );

  const deletePage = useCallback(
    (pageIndex: number) => {
      const pageSize = width * height;

      const newOriginalImages = [...originalImages];
      const newConvertedImages = [...convertedImages];
      newOriginalImages.splice(pageSize * pageIndex, pageSize);
      newConvertedImages.splice(pageSize * pageIndex, pageSize);
      setOriginalImages(newOriginalImages);
      setConvertedImages(newConvertedImages);

      let newActionPages = [...actionPages];
      let newImagePages = [...imagePages];
      newActionPages.splice(pageIndex, 1);
      newImagePages.splice(pageIndex, 1);
      newActionPages = newActionPages.map<IActionPage>((newPage) => {
        const displays = newPage.displays.map<IActionDisplay>((display) => {
          let _revision = display._revision;
          if (display.primary.mode === EAction.changeLayout) {
            if (display.primary.values[0] >= pageIndex) {
              display.primary.values[0] -= 1;
              _revision = 0;
            }
          }
          if (
            display.secondary.enabled &&
            display.secondary.mode === EAction.changeLayout
          ) {
            if (display.secondary.values[0] >= pageIndex) {
              display.secondary.values[0] -= 1;
              _revision = 0;
            }
          }
          return { ...display, _revision };
        });
        return { ...newPage, displays };
      });
      setActionPages(newActionPages);
      setImagePages(newImagePages);
    },
    [actionPages, convertedImages, height, imagePages, originalImages, width]
  );

  const setActionPage = useCallback(
    (pageIndex: number, newPage: IActionPage) => {
      const newPages = [...actionPages];
      newPages[pageIndex] = newPage;
      setActionPages([...newPages]);
    },
    [actionPages]
  );
  const setImagePage = useCallback(
    async (pageIndex: number, displayIndex: number, newPage: IImagePage) => {
      const newPages = [...imagePages];
      newPages[pageIndex] = newPage;
      setImagePages([...newPages]);
      const offset = pageIndex * width * height + displayIndex;
      const originalImage = originalImages[offset];
      const display = newPage.displays[displayIndex];
      let convertedImage;
      if (originalImage.image !== null) {
        convertedImage = await composeImage(
          originalImage.image,
          128,
          64,
          display.imageSettings,
          display.textWithIconSettings,
          display.text
        );
      } else if (display.text.length > 0) {
        convertedImage = await composeText(
          128,
          64,
          display.imageSettings.dither,
          display.text,
          display.textWithIconSettings.font,
          display.imageSettings.contrast
        );
      } else {
        convertedImage = new Buffer(1024);
      }
      const newConvertedImages = [...convertedImages];
      newConvertedImages[offset] = {
        image: convertedImage,
        _revision: newConvertedImages[offset]._revision + 1,
      };
      setConvertedImages(newConvertedImages);
    },
    [convertedImages, height, imagePages, originalImages, width]
  );

  const convertedImagesForPage = useCallback(
    (pageIndex: number) => {
      const images = convertedImages.slice(
        width * height * pageIndex,
        width * height * (pageIndex + 1)
      );
      return images;
    },
    [convertedImages, height, width]
  );
  // const previousImagePages = usePrevious(imagePages)

  // useEffect(() => {

  // }, [imagePages])

  // const switchDisplays = (aIndex: number, bIndex: number) => {
  //   const aPage = Math.floor(aIndex / (width * height));
  //   const aPageIndex = aIndex % (width * height);

  //   const bPage = Math.floor(bIndex / (width * height));
  //   const bPageIndex = bIndex % (width * height);

  //   let newImages: Buffer[] = [...imageBuffers];
  //   [newImages[aIndex], newImages[bIndex]] = [
  //     newImages[bIndex],
  //     newImages[aIndex],
  //   ];

  //   let newPages = [...pageBuffers];
  //   const aContent = Buffer.from(
  //     newPages[aPage].slice(aPageIndex * ROW_SIZE, (aPageIndex + 1) * ROW_SIZE)
  //   );
  //   newPages[aPage].set(
  //     Buffer.from(
  //       newPages[aPage].slice(
  //         bPageIndex * ROW_SIZE,
  //         (bPageIndex + 1) * ROW_SIZE
  //       )
  //     ),
  //     aPageIndex * ROW_SIZE
  //   );
  //   newPages[aPage].set(aContent, bPageIndex * ROW_SIZE);
  //   setAffectedPages([aPage, bPage]);
  //   setImageBuffers(newImages);
  //   setPageBuffers(newPages);
  //   return undefined
  // };

  // const setRow = (
  //   newRow: Buffer,
  //   pageIndex: number,
  //   displayIndex: number,
  //   offset: number
  // ) => {
  //   const newPageBuffers = [...pageBuffers];
  //   const newPage = newPageBuffers[pageIndex];
  //   const newRowSlice = newPage.slice(
  //     displayIndex * ROW_SIZE,
  //     (displayIndex + 1) * ROW_SIZE
  //   );
  //   newRowSlice.set(newRow, offset);
  //   setAffectedPages([pageIndex]);
  //   setPageBuffers(newPageBuffers);
  // };

  // const deletePage = (pageIndex: number) => {
  //   const pageSize = width * height;

  //   const newImages = [...imageBuffers];
  //   newImages.splice(pageSize * pageIndex, pageSize);
  //   setImageBuffers(newImages);

  //   const newPages = [...pageBuffers];
  //   const affectedPages: number[] = [];
  //   newPages.splice(pageIndex, 1);
  //   newPages.forEach((newPage) => {
  //     for (let i = 0; i < width * height; i++) {
  //       if (newPage.readUInt8(i * ROW_SIZE) === 1) {
  //         const oldValuePrimary = newPage.readInt16LE(i * ROW_SIZE + 1);
  //         const oldValueSecondary = newPage.readInt16LE(i * ROW_SIZE + 9);
  //         if (oldValuePrimary >= pageIndex) {
  //           affectedPages.push(pageIndex);
  //           newPage.writeInt16LE(oldValuePrimary - 1, i * ROW_SIZE + 1);
  //         }
  //         if (oldValueSecondary >= pageIndex) {
  //           affectedPages.push(pageIndex);
  //           newPage.writeInt16LE(oldValueSecondary - 1, i * ROW_SIZE + 9);
  //         }
  //       }
  //     }
  //   });
  //   setAffectedPages(affectedPages);
  //   setPageBuffers(newPages);
  // };

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

  // const addPage = (previousPageIndex: number) => {
  //   setPageBuffers([
  //     ...pageBuffers,
  //     defaultRowBuffer(width, height, previousPageIndex),
  //   ]);
  //   if (pageBuffers.length !== 0) {
  //     const blankImages: Buffer[] = Array(width * height - 1).fill(
  //       new Buffer(1024)
  //     );
  //     setImageBuffers([...imageBuffers, BACK_IMAGE, ...blankImages]);
  //   } else {
  //     const blankImages: Buffer[] = Array(width * height).fill(
  //       new Buffer(1024)
  //     );
  //     setImageBuffers([...imageBuffers, ...blankImages]);
  //   }
  //   return pageBuffers.length;
  // };

  return (
    <Main>
      <Header id="header">
        <HeadLine>
          <HeadLineThin>Free{originalImages.length}</HeadLineThin>
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
        {actionPages.map((actionPage, pageIndex) => (
          <Page
            height={height}
            width={width}
            // affected={affectedPages?.includes(index) ?? false}
            pageIndex={pageIndex}
            convertedImages={convertedImagesForPage(pageIndex)}
            actionPage={actionPage}
            imagePage={imagePages[pageIndex]}
            key={pageIndex}
            setOriginalImage={setOriginalImage}
            deletePage={deletePage}
            pageCount={actionPages.length}
            addPage={() => addPage(pageIndex)}
            setActionPage={setActionPage}
            setImagePage={setImagePage}
            // switchDisplays={switchDisplays}
          />
        ))}
      </Content>
    </Main>
  );
}

export default App;
