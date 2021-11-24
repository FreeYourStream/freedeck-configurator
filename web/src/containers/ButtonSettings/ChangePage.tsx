import { LogoutIcon, PlusCircleIcon } from "@heroicons/react/outline";
import React from "react";

import { IButtonSetting, IPage, IPages } from "../../interfaces";
import { FDButton } from "../../lib/components/Button";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { scrollToPage } from "../../lib/scrollToPage";

export const ChangePage: React.FC<{
  action: IButtonSetting;
  setGoTo: (pageId: string) => void;
  addPage: () => void;
  pages: IPages;
}> = ({ action, setGoTo, addPage, pages }) => {
  return (
    <>
      {pages.byId.length ? (
        <Row>
          <Label>Page</Label>
          <StyledSelect
            className="w-40"
            value={action.values.changePage ?? ""}
            onChange={(value) => setGoTo(value)}
            options={[
              { text: "Select Page", value: "" },
              ...Object.entries(pages.byId).map(([id, page]) => ({
                value: page,
                text: `Go to ${page.name ?? page.id.slice(0, 4)}`,
              })),
            ]}
          />
        </Row>
      ) : null}
      <div className="flex justify-center my-2">
        {action.values.changePage === "" ? (
          <FDButton
            prefix={<PlusCircleIcon className="h-5 w-5" />}
            size={2}
            onClick={async () => await addPage()}
          >
            Add Page
          </FDButton>
        ) : (
          <FDButton
            prefix={<LogoutIcon className="h-5 w-5" />}
            size={2}
            onClick={() => scrollToPage(action.values.changePage)}
          >
            Scroll To {(action.values.changePage + 1).toString()}
          </FDButton>
        )}
      </div>
    </>
  );
};
