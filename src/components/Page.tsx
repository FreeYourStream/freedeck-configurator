import React from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";

import { IButton, IButtonPage, IDisplay, IDisplayPage } from "../App";
import { colors } from "../definitions/colors";
import { Display } from "./Display";

const Wrapper = styled.div`
  position: relative;
  margin: 24px;
  padding: 18px;
  /* border: 1px solid ${colors.white}; */
  border-radius: 21px;
  background: ${colors.gray};
  box-shadow: 13px 13px 21px #11161d, -13px -13px 21px #2d3a49;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PageIndicator = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: sans-serif;
  border-radius: 50%;
  border: 1px solid #555;
  text-align: center;
  vertical-align: middle;
  line-height: 38px;
  width: 40px;
  height: 40px;
  color: ${colors.white};
  position: absolute;
  top: -20px;
  left: -20px;
  background-color: ${colors.black};
`;

const DeletePage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: red;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  top: -15px;
  right: -15px;
  position: absolute;
  border-style: none;
`;

const Grid = styled.div<{ width: number; height: number }>`
  display: grid;
  grid-template-columns: ${(p) => {
    let fr = "128px";
    for (var i = 0; i < p.width - 1; i++) {
      fr += " 128px";
    }
    return `${fr};`;
  }};
  grid-template-rows: ${(p) => {
    let fr = "64px";
    for (var i = 0; i < p.height - 1; i++) {
      fr += " 64px";
    }
    return `${fr};`;
  }};
  margin: 20px;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

interface IProps {
  deleteImage: (displayIndex: number) => void;
  makeDefaultBackImage: (displayIndex: number) => void;
  pageIndex: number;
  hasOriginalImage: (displayIndex: number) => boolean;
  width: number;
  height: number;
  buttonSettingsPages: IButtonPage;
  displaySettingsPages: IDisplayPage;
  convertedImages: Buffer[];
  setOriginalImage: (displayIndex: number, image: Buffer) => void;
  deletePage: (pageIndex: number) => void;
  addPage: (displayIndex: number, primary: boolean) => Promise<number>;
  pageCount: number;
  setButtonSettings: (displayIndex: number, newDisplay: IButton) => void;
  setDisplaySettings: (displayIndex: number, newDisplay: IDisplay) => void;
  switchDisplays: (
    aPageIndex: number,
    bPageIndex: number,
    aDisplayIndex: number,
    bDisplayIndex: number
  ) => void;
}

const PageComponent: React.FC<IProps> = ({
  pageIndex,
  deleteImage,
  makeDefaultBackImage,
  hasOriginalImage,
  width,
  height,
  convertedImages,
  setOriginalImage,
  buttonSettingsPages,
  displaySettingsPages,
  deletePage,
  addPage,
  setButtonSettings,
  setDisplaySettings,
  pageCount,
  switchDisplays,
}) => {
  return (
    <Wrapper id={`page_${pageIndex}`}>
      <Header>
        <PageIndicator>{pageIndex}</PageIndicator>
        <DeletePage
          onClick={() => {
            const deleteConfirmed = window.confirm(
              "Do you really want to delete this page forever?"
            );
            if (deleteConfirmed) deletePage(pageIndex);
          }}
        >
          <FaTrashAlt size={18} color="white" />
        </DeletePage>
      </Header>
      <Grid height={height} width={width}>
        <DndProvider backend={Backend}>
          {displaySettingsPages.map((imageDisplay, displayIndex) => (
            <Display
              deleteImage={() => deleteImage(displayIndex)}
              makeDefaultBackImage={() => makeDefaultBackImage(displayIndex)}
              convertedImage={convertedImages[displayIndex]}
              setButtonSettings={(displayAction) =>
                setButtonSettings(displayIndex, displayAction)
              }
              setDisplaySettings={(displayImage) =>
                setDisplaySettings(displayIndex, displayImage)
              }
              actionDisplay={buttonSettingsPages[displayIndex]}
              imageDisplay={displaySettingsPages[displayIndex]}
              key={displayIndex}
              displayIndex={displayIndex}
              pageIndex={pageIndex}
              setOriginalImage={(image) =>
                setOriginalImage(displayIndex, image)
              }
              pages={[...Array(pageCount).keys()].filter(
                (pageNumber) => pageNumber !== pageIndex
              )}
              addPage={(primary: boolean) => addPage(displayIndex, primary)}
              hasOriginalImage={hasOriginalImage(displayIndex)}
              switchDisplays={switchDisplays}
            />
          ))}
        </DndProvider>
      </Grid>
    </Wrapper>
  );
};

export const Page = React.memo(PageComponent, (prev, next) => {
  return false;
  // if (prev.setActionPage !== next.setActionPage) return false;
  // if (prev.setImagePage !== next.setImagePage) return false;
  // if (prev.setOriginalImage !== next.setOriginalImage) return false;
  // const prevRevisionImage = prev.convertedImages.reduce(
  //   (acc, image) => acc + image._revision,
  //   0
  // );
  // const nextRevisionImage = next.convertedImages.reduce(
  //   (acc, image) => acc + image._revision,
  //   0
  // );
  // if (prevRevisionImage !== nextRevisionImage) return false;

  // const prevRevisionImagePage = prev.imagePage.displays.reduce(
  //   (acc, display) => acc + display._revision,
  //   0
  // );
  // const nextRevisionImagePage = next.imagePage.displays.reduce(
  //   (acc, display) => acc + display._revision,
  //   0
  // );
  // if (prevRevisionImagePage !== nextRevisionImagePage) return false;

  // const prevRevisionActionPage = prev.actionPage.displays.reduce(
  //   (acc, display) => acc + display._revision,
  //   0
  // );
  // const nextRevisionActionPage = next.actionPage.displays.reduce(
  //   (acc, display) => acc + display._revision,
  //   0
  // );
  // if (prevRevisionActionPage !== nextRevisionActionPage) return false;

  // return true;
});
