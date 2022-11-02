import preval from "preval.macro";
import React from "react";

import packageJson from "../../package.json";
import { Label, Value } from "../lib/components/LabelValue";
import { Row } from "../lib/components/Row";
import { ScrollListContainer } from "../lib/components/ScrollListContainer";
import { TitleBox } from "../lib/components/Title";

export const About: React.FC = () => {
  return (
    <ScrollListContainer>
      <TitleBox title="FreeDeck Configurator">
        <Row>
          <Label>Version:</Label>
          <Value>{packageJson.version}</Value>
        </Row>
        <Row>
          <Label>Build:</Label>
          <Value>{preval`module.exports = new Date().getTime()`}</Value>
        </Row>
        <Row>
          <Label>Commit:</Label>
          <Value>{preval`module.exports = require('child_process').execSync("git rev-parse --short HEAD").toString()`}</Value>
        </Row>
      </TitleBox>
    </ScrollListContainer>
  );
};
