import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { Switch } from "../../../lib/components/Switch";
import { TextInput } from "../../../lib/components/TextInput";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const AutoPageSwitcherSettings: React.FC<{ pageId: string }> = ({
  pageId,
}) => {
  const configState = useContext(ConfigStateContext);
  const { setUsePageName } = useContext(ConfigDispatchContext);
  const { changePageWindowName } = useContext(ConfigDispatchContext);
  const page = configState.pages.byId[pageId];

  return (
    <div className="p-8 w-full">
      <Row className="h-8">
        <Label>Use Page name</Label>
        <Switch
          onChange={(value) => setUsePageName({ pageId, value })}
          value={page.usePageNameAsWindowName}
        />
      </Row>
      <Row className="h-8">
        <Label>Window Name</Label>
        <TextInput
          className="w-44"
          placeholder="Enter window name..."
          disabled={page.usePageNameAsWindowName}
          value={page.windowName}
          onChange={(windowName) =>
            changePageWindowName({ pageId, windowName })
          }
        />
      </Row>
      <div className="mt-4">
        This will be ignored if this page is in a collection
      </div>
    </div>
  );
};
