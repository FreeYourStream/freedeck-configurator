import React from "react";
import { IButtonSetting } from "../../interfaces";
import { FDButton } from "../../lib/components/Button";
import { StyledSelect } from "../../lib/components/SelectInput";
import { scrollToPage } from "../../lib/scrollToPage";

export const ChangePage: React.FC<{
  action: IButtonSetting;
  setGoTo: (page: number) => void;
  addPage: () => void;
  pages: number[];
}> = ({ action, setGoTo, addPage, pages }) => {
  return (
    <>
      {pages.length ? (
        <StyledSelect
          value={action.values[0]}
          onChange={(e) => setGoTo(parseInt(e.target.value))}
        >
          <option value={-1}>Select Page</option>
          {pages.map((pageNumber) => (
            <option key={pageNumber} value={pageNumber}>
              Go to {pageNumber}
            </option>
          ))}
        </StyledSelect>
      ) : null}
      {!action.values?.length || action.values[0] === -1 ? (
        <FDButton size={1} onClick={async () => await addPage()}>
          Add Page +
        </FDButton>
      ) : (
        <FDButton size={1} onClick={() => scrollToPage(action.values[0])}>
          Scroll To {action.values[0].toString()}
        </FDButton>
      )}
    </>
  );
};
