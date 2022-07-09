import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSwitch } from "../../../lib/components/Switch";
import { TextInput } from "../../../lib/components/TextInput";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const AutoPageSwitcherSettings: React.FC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const configState = useContext(ConfigStateContext);
  const { setUseCollectionName } = useContext(ConfigDispatchContext);
  const { changeCollectionWindowName } = useContext(ConfigDispatchContext);
  const collection = configState.collections.byId[collectionId];

  return (
    <div className="p-8 w-full">
      <Row className="h-8">
        <Label>Use Page name</Label>
        <FDSwitch
          onChange={(value) => setUseCollectionName({ collectionId, value })}
          value={collection.usePageNameAsWindowName}
        />
      </Row>
      <Row className="h-8">
        <Label>Window Name</Label>
        <TextInput
          className="w-44"
          placeholder="Enter window name..."
          disabled={collection.usePageNameAsWindowName}
          value={collection.windowName ?? ""}
          onChange={(windowName) =>
            changeCollectionWindowName({ collectionId, windowName })
          }
        />
      </Row>
    </div>
  );
};
