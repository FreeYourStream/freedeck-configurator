import React, { useCallback } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import styled from "styled-components";

import { IActionDisplay, IActionPage, IImageDisplay, IImagePage } from "../App";
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

const DeletePage = styled.img`
  cursor: pointer;
  background-color: white;
  border-radius: 50%;
  height: 22px;
  width: 22px;
  top: -8px;
  right: -8px;
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
  pageIndex: number;
  // affected: boolean;
  width: number;
  height: number;
  actionPage: IActionPage;
  imagePage: IImagePage;
  convertedImages: { _revision: number; image: Buffer }[];
  setOriginalImage: (
    pageIndex: number,
    displayIndex: number,
    image: Buffer
  ) => void;
  deletePage: (pageIndex: number) => void;
  addPage: () => number;
  pageCount: number;
  setActionPage: (pageIndex: number, newPageAction: IActionPage) => void;
  setImagePage: (
    pageIndex: number,
    displayIndex: number,
    newPageImage: IImagePage
  ) => void;
  // switchDisplays: (aIndex: number, bIndex: number) => undefined;
}

const PageComponent: React.FC<IProps> = ({
  pageIndex,
  // affected,
  width,
  height,
  convertedImages,
  setOriginalImage: a,
  actionPage,
  imagePage,
  deletePage,
  addPage,
  setActionPage: b,
  setImagePage: c,
  pageCount,
  // switchDisplays,
}) => {
  const setOriginalImage = useCallback(
    (displayIndex: number, image: Buffer) => {
      a(pageIndex, displayIndex, image);
    },
    [a, pageIndex]
  );
  const setActionPage = useCallback(
    (pageIndex: number, newPageAction: IActionPage) => {
      b(pageIndex, newPageAction);
    },
    [b]
  );
  const setImagePage = useCallback(
    (displayIndex: number, newPageImage: IImagePage) => {
      c(pageIndex, displayIndex, newPageImage);
    },
    [c, pageIndex]
  );
  const setDisplayAction = useCallback(
    (displayIndex: number, newDisplay: IActionDisplay) => {
      const newDisplays = [...actionPage.displays];
      newDisplays[displayIndex] = {
        ...newDisplay,
        _revision: newDisplays[displayIndex]._revision + 1,
      };
      setActionPage(pageIndex, { ...actionPage, displays: newDisplays });
    },
    [actionPage, pageIndex, setActionPage]
  );
  const setDisplayImage = useCallback(
    (displayIndex: number, newDisplay: IImageDisplay) => {
      const newDisplays = [...imagePage.displays];
      newDisplays[displayIndex] = {
        ...newDisplay,
        _revision: newDisplays[displayIndex]._revision + 1,
      };
      setImagePage(displayIndex, { ...imagePage, displays: newDisplays });
    },
    [imagePage, setImagePage]
  );

  return (
    <Wrapper id={`page_${pageIndex}`}>
      <Header>
        <PageIndicator>{pageIndex}</PageIndicator>
        <DeletePage
          src="close.png"
          onClick={() => {
            const deleteConfirmed = window.confirm(
              "Do you really want to delete this page forever?"
            );
            if (deleteConfirmed) deletePage(pageIndex);
          }}
        />
      </Header>
      <Grid height={height} width={width}>
        <DndProvider backend={Backend}>
          {actionPage.displays.map((actionDisplay, actionDisplayIndex) => (
            <Display
              image={convertedImages[actionDisplayIndex]}
              setDisplayAction={setDisplayAction}
              setDisplayImage={setDisplayImage}
              actionDisplay={actionDisplay}
              imageDisplay={imagePage.displays[actionDisplayIndex]}
              key={actionDisplayIndex}
              displayIndex={actionDisplayIndex}
              imageIndex={pageIndex * width * height + actionDisplayIndex}
              setOriginalImage={setOriginalImage}
              pages={[...Array(pageCount).keys()].filter(
                (pageNumber) => pageNumber !== pageIndex
              )}
              addPage={addPage}
              // switchDisplays={switchDisplays}
            />
          ))}
        </DndProvider>
      </Grid>
    </Wrapper>
  );
};

export const Page = React.memo(PageComponent, (prev, next) => {
  if (prev.setActionPage !== next.setActionPage) return false;
  if (prev.setImagePage !== next.setImagePage) return false;
  if (prev.setOriginalImage !== next.setOriginalImage) return false;
  const prevRevisionImage = prev.convertedImages.reduce(
    (acc, image) => acc + image._revision,
    0
  );
  const nextRevisionImage = next.convertedImages.reduce(
    (acc, image) => acc + image._revision,
    0
  );
  if (prevRevisionImage !== nextRevisionImage) return false;

  const prevRevisionImagePage = prev.imagePage.displays.reduce(
    (acc, display) => acc + display._revision,
    0
  );
  const nextRevisionImagePage = next.imagePage.displays.reduce(
    (acc, display) => acc + display._revision,
    0
  );
  if (prevRevisionImagePage !== nextRevisionImagePage) return false;

  const prevRevisionActionPage = prev.actionPage.displays.reduce(
    (acc, display) => acc + display._revision,
    0
  );
  const nextRevisionActionPage = next.actionPage.displays.reduce(
    (acc, display) => acc + display._revision,
    0
  );
  if (prevRevisionActionPage !== nextRevisionActionPage) return false;

  return true;
});
