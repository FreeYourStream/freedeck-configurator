import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { TextInput } from "../../../lib/components/TextInput";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const AutoPageSwitcherSettings: React.FC<{ collectionId: string }> = ({
  collectionId,
}) => {
  const configState = useContext(ConfigStateContext);
  const { changeCollectionWindowName } = useContext(ConfigDispatchContext);
  const collection = configState.collections.byId[collectionId];

  return (
    <div className="p-8 w-full">
      <Row>
        <Label>Window Name</Label>
        <TextInput
          className="w-44"
          placeholder="Enter window name..."
          value={collection.windowName ?? ""}
          onChange={(windowName) =>
            changeCollectionWindowName({ collectionId, windowName })
          }
        />
      </Row>
    </div>
  );
};
