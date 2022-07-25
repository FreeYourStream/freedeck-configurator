import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSwitch } from "../../../lib/components/Switch";
import { TextArea } from "../../../lib/components/TextArea";
import { TitleBox } from "../../../lib/components/Title";
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
    <div className="w-full">
      <TitleBox title="Auto page-switcher">
        <Row className="h-8">
          <Label>Use Page name as window name</Label>
          <FDSwitch
            onChange={(value) => setUseCollectionName({ collectionId, value })}
            value={collection.useCollectionNameAsWindowName}
          />
        </Row>
        <Row mode="top">
          <Label hint="One window name per line or comma seperated">
            Window name
          </Label>
          <TextArea
            className="w-64 h-64"
            placeholder={
              collection.useCollectionNameAsWindowName
                ? collection.name
                : "Enter window name..."
            }
            disabled={collection.useCollectionNameAsWindowName}
            value={collection.windowName}
            onChange={(windowName) =>
              changeCollectionWindowName({ collectionId, windowName })
            }
          />
        </Row>
      </TitleBox>
    </div>
  );
};
