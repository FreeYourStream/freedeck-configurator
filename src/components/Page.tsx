import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import { colors } from "../definitions/colors";
import { AppStateContext } from "../states/appState";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../states/configState";
import { Display } from "./DisplayButton";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PageIndicator = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: sans-serif;
  border-radius: 21px 0px 21px 0px;
  text-align: center;
  vertical-align: middle;
  line-height: 38px;
  width: 38px;
  height: 38px;
  color: ${colors.white};
  position: absolute;
  top: 0px;
  left: 0px;
  background-color: ${colors.black};
`;

const DeletePage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${colors.red};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  top: -15px;
  right: -15px;
  opacity: 0;
  position: absolute;
  border-style: none;
  transition: opacity 100ms ease-in-out;
`;

const Wrapper = styled.div`
  position: relative;
  margin: 24px;
  padding: 24px;
  /* border: 1px solid ${colors.white}; */
  border-radius: 21px;
  background: ${colors.gray};
  box-shadow: 13px 13px 21px #11161d, -13px -13px 21px #2d3a49;
  &:hover ${DeletePage} {
    opacity: 1;
  }
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
}

export const Page: React.FC<IProps> = ({ pageIndex }) => {
  const configState = useContext(ConfigStateContext);
  const appState = useContext(AppStateContext);
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <Wrapper id={`page_${pageIndex}`}>
      <Header>
        <PageIndicator>{pageIndex}</PageIndicator>
        <DeletePage
          onClick={() => {
            const deleteConfirmed =
              appState.ctrlDown ||
              window.confirm("Do you really want to delete this page forever?");
            console.log("deleteConfirmed", deleteConfirmed);
            if (deleteConfirmed) configDispatch.deletePage(pageIndex);
          }}
        >
          <FaTrashAlt size={18} color="white" />
        </DeletePage>
      </Header>
      <Grid height={configState.height} width={configState.width}>
        <DndProvider backend={Backend}>
          {configState.displaySettingsPages[pageIndex].map(
            (imageDisplay, displayIndex) => (
              <Display
                key={displayIndex}
                displayIndex={displayIndex}
                pageIndex={pageIndex}
              />
            )
          )}
        </DndProvider>
      </Grid>
    </Wrapper>
  );
};
