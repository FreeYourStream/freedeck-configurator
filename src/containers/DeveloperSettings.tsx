import { invoke } from "@tauri-apps/api";
import React, { useContext } from "react";

import { FDButton } from "../lib/components/Button";
import { Label } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { TextInput } from "../lib/components/TextInput";
import { Title } from "../lib/components/Title";
import { AppStateContext } from "../states/appState";

export const DeveloperSettings: React.FC = () => {
  const { serialApi } = useContext(AppStateContext);
  return (
    <div className="flex flex-col w-full">
      <Title>FreeDeck Developer Settings</Title>
      <Row>
        <Label>Send text to screen:</Label>
        <TextInput onChange={(val) => serialApi?.writeToScreen(val)} />
      </Row>
      <Row>
        <Label>Get current page:</Label>
        <FDButton
          onClick={() =>
            serialApi?.getCurrentPage().then((a) => console.log(a))
          }
        >
          get
        </FDButton>
      </Row>
    </div>
  );
};
