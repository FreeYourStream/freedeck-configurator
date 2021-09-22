import React from "react";

import { IButtonSettings } from "../../interfaces";
import { FDButton } from "../../lib/components/Button";
import { SelectWrapper, StyledSelect } from "../../lib/components/Misc";
import { scrollToPage } from "../../lib/scrollToPage";

export const ChangePage: React.FC<{
  action: IButtonSettings;
  setGoTo: (page: number) => void;
  addPage: () => Promise<number>;
  pages: number[];
}> = ({ action, setGoTo, addPage, pages }) => {
  return (
    <>
      {pages.length ? (
        <SelectWrapper>
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
        </SelectWrapper>
      ) : null}
      {!action.values?.length || action.values[0] === -1 ? (
        <FDButton mt={8} size={1} onClick={async () => await addPage()}>
          Add Page +
        </FDButton>
      ) : (
        <FDButton
          mt={8}
          size={1}
          onClick={() => scrollToPage(action.values[0])}
        >
          Scroll To {action.values[0].toString()}
        </FDButton>
      )}
    </>
  );
};
