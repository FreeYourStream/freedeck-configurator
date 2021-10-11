import React, { useContext } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";
import { FaTrashAlt } from "react-icons/fa";
import styled from "styled-components";
import { colors } from "../definitions/colors";
import { DispatchContext, StateContext } from "../state";
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
  background-color: red;
  border-radius: 50%;
  height: 30px;
  width: 30px;
  top: -15px;
  right: -15px;
  visibility: hidden;
  position: absolute;
  border-style: none;
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
    visibility: visible;
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
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  return (
    <Wrapper id={`page_${pageIndex}`}>
      <Header>
        <PageIndicator>{pageIndex}</PageIndicator>
        <DeletePage
          onClick={() => {
            const deleteConfirmed = window.confirm(
              "Do you really want to delete this page forever?"
            );
            if (deleteConfirmed) dispatch.deletePage(pageIndex);
          }}
        >
          <FaTrashAlt size={18} color="white" />
        </DeletePage>
      </Header>
      <Grid height={state.height} width={state.width}>
        <DndProvider backend={Backend}>
          {state.displaySettingsPages[pageIndex].map(
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
