import {
  ArrowLeftOnRectangleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
import React, { useContext } from "react";

import { EAction } from "../../../definitions/modes";
import { ButtonSetting, Pages } from "../../../generated";
import { FDButton } from "../../../lib/components/Button";
import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSelect } from "../../../lib/components/SelectInput";
import { scrollToPage } from "../../../lib/misc/scrollToPage";
import { getPageName } from "../../../lib/misc/util";
import { ConfigDispatchContext } from "../../../states/configState";

export const ChangePage: React.FC<{
  secondary: boolean;
  values: ButtonSetting["values"];
  previousPage: string;
  pages: Pages;
  previousDisplay: number;
  setValues: (values: ButtonSetting["values"]) => void;
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
          <FDSelect
            className="w-48"
            value={values[EAction.changePage] ?? ""}
            onChange={(value) =>
              setValues({ ...values, [EAction.changePage]: value })
            }
            options={[
              { text: "Select Page", value: "" },
              ...pages.sorted.map((id) => {
                const page = pages.byId[id];
                return { value: id, text: `Go to ${getPageName(id, page)}` };
              }),
            ]}
          />
        </Row>
      ) : null}
      <div className="flex justify-center my-2">
        {["", undefined].includes(values[EAction.changePage]) ? (
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
            prefix={<ArrowLeftOnRectangleIcon className="h-5 w-5" />}
            size={2}
            onClick={() => scrollToPage(values[EAction.changePage]!)}
          >
            Scroll To{" "}
            {getPageName(
              values[EAction.changePage]!,
              pages.byId[values[EAction.changePage]!]
            )}
          </FDButton>
        )}
      </div>
    </>
  );
};
