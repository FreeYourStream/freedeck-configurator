import React, { Component, ReactNode, useState } from "react";
import styled from "styled-components";

import { colors } from "../../definitions/colors";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const Tabs = styled.div`
  display: flex;
  background-color: #000000a1;
`;
const Tab = styled.div<{ active: boolean }>`
  display: flex;
  padding: 8px 12px;
  background-color: ${(p) => (p.active ? colors.white : colors.black)};
  /* border: 1px solid ${(p) => (p.active ? colors.black : colors.white)}; */
  color: ${(p) => (p.active ? colors.black : colors.white)};
  font-family: "barlow";
  font-size: 20px;
  user-select: none;
  cursor: pointer;
`;
export const TabView: React.FC<{
  tabs: string[];
  renderTab: (tabName: string) => ReactNode;
}> = ({ tabs, renderTab }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Wrapper>
      <Tabs>
        {tabs.map((tab, index) => (
          <Tab
            onClick={() => setActiveTabIndex(index)}
            active={activeTabIndex === index}
            key={index}
          >
            {tab}
          </Tab>
        ))}
      </Tabs>
      {renderTab(tabs[activeTabIndex])}
    </Wrapper>
  );
};
