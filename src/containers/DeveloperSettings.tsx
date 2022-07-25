import React, { useContext } from "react";

import { FDButton } from "../lib/components/Button";
import { Label } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { TextInput } from "../lib/components/TextInput";
import { TitleBox } from "../lib/components/Title";
import { createToast } from "../lib/createToast";
import { AppDispatchContext, AppStateContext } from "../states/appState";

export const DeveloperSettings: React.FC = () => {
  const { serialApi } = useContext(AppStateContext);
  const appDispatch = useContext(AppDispatchContext);
  return (
    <div className="flex flex-col w-full">
      <TitleBox title="FreeDeck Developer Settings">
        <Row>
          <Label>Send text to screen:</Label>
          <TextInput onChange={(val) => serialApi?.writeToScreen(val)} />
        </Row>
        <Row>
          <Label>Get current page:</Label>
          <FDButton
            onClick={() =>
              serialApi?.getCurrentPage().then((a) =>
                appDispatch.openAlert({
                  text: a.toString(),
                  title: "Debug message",
                })
              )
            }
          >
            get
          </FDButton>
        </Row>
        <Row>
          <Label>Make toast:</Label>
          <FDButton
            onClick={() => createToast({ title: "Title", text: "Text" })}
          >
            Toast!
          </FDButton>
        </Row>
      </TitleBox>
    </div>
  );
};
