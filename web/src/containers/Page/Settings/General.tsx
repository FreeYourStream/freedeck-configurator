import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { TextInput } from "../../../lib/components/TextInput";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const PageGeneralSettings: React.FC<{ pageId: string }> = ({
  pageId,
}) => {
  const configState = useContext(ConfigStateContext);
  const { renamePage } = useContext(ConfigDispatchContext);
  const page = configState.pages.byId[pageId];

  return (
    <div className="p-8 w-full">
      <Row>
        <Label>Name</Label>
        <TextInput
          placeholder="Enter page name"
          value={page.name}
          onChange={(name) => renamePage({ pageId, name })}
        />
      </Row>
    </div>
  );
};
