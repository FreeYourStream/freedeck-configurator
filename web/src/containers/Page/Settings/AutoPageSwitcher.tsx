import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { TextInput } from "../../../lib/components/TextInput";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const AutoPageSwitcherSettings: React.FC<{ pageId: string }> = ({
  pageId,
}) => {
  const configState = useContext(ConfigStateContext);
  const { changePageWindowName } = useContext(ConfigDispatchContext);
  const page = configState.pages.byId[pageId];

  return (
    <div className="p-8 w-full">
      <Row>
        <Label>Window Name</Label>
        <TextInput
          placeholder="Enter window name..."
          value={page.windowName ?? ""}
          onChange={(windowName) =>
            changePageWindowName({ pageId, windowName })
          }
        />
      </Row>
    </div>
  );
};
