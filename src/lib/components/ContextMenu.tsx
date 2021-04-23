import React, { ReactNode, ReactNodeArray } from "react";
import { ContextMenuWrapper } from "react-context-menu-wrapper";
import styled from "styled-components";

import { colors } from "../../definitions/colors";
import { Spacer } from "./Button";
import { Icons } from "./Icons";
import { Label } from "./Misc";

const isReactNodeArray = (
  children: ReactNode | ReactNodeArray
): children is ReactNodeArray => {
  return !!(children as ReactNodeArray).length;
};

const ItemWrapper = styled.div<{ dangerous: boolean }>`
  min-width: 200px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  cursor: pointer;
  ${(p) => (p.dangerous ? `background-color: red` : "")};
`;
const EmptyIcon = styled.div<{ size: number }>`
  width: ${(p) => p.size}px;
  margin-right: 4px;
`;

export const ContextMenuItem: React.FC<{
  icon?: string;
  text: string;
  dangerous?: boolean;
  onClick: () => void;
}> = ({ icon, dangerous, text, onClick }) => {
  const Icon =
    //@ts-ignore
    icon && Icons[icon.split("/")[0]][icon.split("/")[1]];
  return (
    <ItemWrapper dangerous={dangerous ?? false} onClick={() => onClick()}>
      {icon && Icon ? (
        <Spacer mr={4}>
          <Icon color={dangerous ? "white" : colors.gray} size={18} />
        </Spacer>
      ) : (
        <EmptyIcon size={18} />
      )}
      <Label color={dangerous ? "white" : colors.gray}>{text}</Label>
    </ItemWrapper>
  );
};

const Wrapper = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.black};
`;
const Divider = styled.div`
  border-bottom: 1px solid ${colors.black};
`;

export const ContextMenu: React.FC<{
  children: ReactNode | ReactNodeArray;
  menuId: string;
}> = ({ children, menuId }) => {
  const childrenArray = isReactNodeArray(children) ? children : [children];
  const childrenWithDividers = childrenArray.reduce(
    (acc: ReactNodeArray, child, index) => {
      if (!acc.length) return [child];
      acc.push(<Divider key={index} />);
      acc.push(child);
      return acc;
    },
    []
  );
  return (
    <ContextMenuWrapper id={menuId}>
      <Wrapper>{childrenWithDividers}</Wrapper>
    </ContextMenuWrapper>
  );
};
