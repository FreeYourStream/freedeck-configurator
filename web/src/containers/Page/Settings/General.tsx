import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { FDSelect } from "../../../lib/components/SelectInput";
import { TextInput } from "../../../lib/components/TextInput";
import { getCollectionName } from "../../../lib/util";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../../states/configState";

export const PageGeneralSettings: React.FC<{ pageId: string }> = ({
  pageId,
}) => {
  const configState = useContext(ConfigStateContext);
  const { collections } = configState;
  const { renamePage, setPageCollection } = useContext(ConfigDispatchContext);
  const page = configState.pages.byId[pageId];

  return (
    <div className="p-8 w-full">
      <Row>
        <Label>Name</Label>
        <TextInput
          disabled={page.isStartPage}
          className="w-44"
          placeholder="Enter page name"
          value={page.name}
          onChange={(name) => renamePage({ pageId, name })}
        />
      </Row>
      <Row>
        <Label>Collection</Label>
        <FDSelect
          disabled={page.isStartPage}
          className="w-44"
          value={page.isInCollection}
          onChange={(collectionId) =>
            setPageCollection({ pageId, collectionId })
          }
          options={[
            { text: "no collection", value: undefined },
            ...collections.sorted.map((colId) => ({
              text: getCollectionName(colId, collections.byId[colId]),
              value: colId,
            })),
          ]}
        />
      </Row>
      {!!page.isStartPage &&
        "You can't change the name and collection of the start page"}
    </div>
  );
};
