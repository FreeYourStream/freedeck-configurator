import { LogoutIcon, PlusCircleIcon } from "@heroicons/react/outline";
import React from "react";
import { IButtonSetting } from "../../interfaces";
import { FDButton } from "../../lib/components/Button";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
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
        <Row>
          <Label>Page</Label>
          <StyledSelect
            className="w-32"
            value={action.values[0]}
            onChange={(e) => setGoTo(parseInt(e.target.value))}
          >
            <option value={-1}>Select Page</option>
            {pages.map((pageNumber) => {
              return (
                <option key={pageNumber} value={pageNumber}>
                  Go to {pageNumber + 1}
                </option>
              );
            })}
          </StyledSelect>
        </Row>
      ) : null}
      <div className="flex justify-center my-2">
        {action.values[0] === undefined ? (
          <FDButton
            prefix={<PlusCircleIcon className="h-5 w-5" />}
            size={1}
            onClick={async () => await addPage()}
          >
            Add Page
          </FDButton>
        ) : (
          <FDButton
            prefix={<LogoutIcon className="h-5 w-5" />}
            size={1}
            onClick={() => scrollToPage(action.values[0])}
          >
            Scroll To {(action.values[0] + 1).toString()}
          </FDButton>
        )}
      </div>
    </>
  );
};
