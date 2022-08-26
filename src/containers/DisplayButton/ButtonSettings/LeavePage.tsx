import React from "react";

import { ButtonSetting, Pages } from "../../../generated";
import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSelect } from "../../../lib/components/SelectInput";
import { FDSwitch } from "../../../lib/components/Switch";
import { getPageName } from "../../../lib/misc/util";

export const LeavePage: React.FC<{
  value: ButtonSetting["leavePage"];
  pages: Pages;
  primary: boolean;
  setValue: (value: ButtonSetting["leavePage"]) => void;
}> = ({ value, pages, setValue, primary }) => {
  const startPage = pages.sorted[0];
  return (
    <>
      {pages.sorted.length ? (
        <>
          <Row>
            <Label>Change Page after press</Label>
            <FDSwitch
              value={value.enabled}
              onChange={(enabled) =>
                setValue({ enabled, pageId: value.pageId })
              }
            />
          </Row>
          {value.enabled && (
            <Row>
              <Label>Page</Label>
              <FDSelect
                className="w-48"
                value={value.pageId || startPage}
                onChange={(value) => setValue({ enabled: true, pageId: value })}
                options={[
                  { text: "Select Page", value: "" },
                  ...pages.sorted.map((id) => {
                    const page = pages.byId[id];
                    return {
                      value: id,
                      text: `Go to ${getPageName(id, page)}`,
                    };
                  }),
                ]}
              />
            </Row>
          )}
        </>
      ) : null}
    </>
  );
};
