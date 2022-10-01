import React, { useContext } from "react";

import { Label } from "../../../lib/components/LabelValue";
import { Row } from "../../../lib/components/Row";
import { ScrollListContainer } from "../../../lib/components/ScrollListContainer";
import { FDSwitch } from "../../../lib/components/Switch";
import { TextArea } from "../../../lib/components/TextArea";
import { TitleBox } from "../../../lib/components/Title";
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
    <ScrollListContainer>
      <TitleBox title="Auto page-switcher">
        <Row className="h-8">
          <Label hint="This will be ignored if this page is in a collection">
            Use Page name as window name
          </Label>
          <FDSwitch
            onChange={(value) => setUsePageName({ pageId, value })}
            value={page.usePageNameAsWindowName}
          />
        </Row>
        <Row mode="top">
          <Label hint="One window name per line or comma seperated">
            Window name
          </Label>
          <TextArea
            className="w-64 h-64"
            placeholder={
              page.usePageNameAsWindowName ? page.name : "Enter window name..."
            }
            disabled={page.usePageNameAsWindowName}
            value={page.windowName}
            onChange={(windowName) =>
              changePageWindowName({ pageId, windowName })
            }
          />
        </Row>
      </TitleBox>
    </ScrollListContainer>
  );
};
