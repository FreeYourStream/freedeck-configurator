import { LogoutIcon, PlusCircleIcon } from "@heroicons/react/outline";
import React, { useContext } from "react";

import { IButtonSetting, IPage, IPages } from "../../interfaces";
import { FDButton } from "../../lib/components/Button";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { StyledSelect } from "../../lib/components/SelectInput";
import { scrollToPage } from "../../lib/scrollToPage";
import { ConfigDispatchContext } from "../../states/configState";

export const ChangePage: React.FC<{
  secondary: boolean;
  values: IButtonSetting["values"];
  previousPage: string;
  pages: IPages;
  previousDisplay: number;
  setValues: (values: IButtonSetting["values"]) => void;
}> = ({
  values,
  previousPage,
  pages,
  previousDisplay,
  setValues,
  secondary,
}) => {
  const configDispatch = useContext(ConfigDispatchContext);
  return (
    <>
      {pages.sorted.length ? (
        <Row>
          <Label>Page</Label>
          <StyledSelect
            className="w-40"
            value={values.changePage ?? ""}
            onChange={(value) => setValues({ ...values, changePage: value })}
            options={[
              { text: "Select Page", value: "" },
              ...Object.entries(pages.byId).map(([id, page]) => ({
                value: id,
                text: `Go to ${page.name.length ? page.name : id.slice(-4)}`,
              })),
            ]}
          />
        </Row>
      ) : null}
      <div className="flex justify-center my-2">
        {values.changePage === "" ? (
          <FDButton
            prefix={<PlusCircleIcon className="h-5 w-5" />}
            size={2}
            onClick={async () =>
              await configDispatch.addPage({
                previousPage,
                previousDisplay,
                secondary,
              })
            }
          >
            Add Page
          </FDButton>
        ) : (
          <FDButton
            prefix={<LogoutIcon className="h-5 w-5" />}
            size={2}
            onClick={() => scrollToPage(values.changePage)}
          >
            Scroll To {values.changePage.slice(-4)}
          </FDButton>
        )}
      </div>
    </>
  );
};
