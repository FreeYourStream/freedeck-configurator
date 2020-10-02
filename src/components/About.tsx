import preval from "preval.macro";
import React from "react";

import packageJson from "../../package.json";
import { Label, Row, Title, Value } from "../lib/components/Misc";

export const About: React.FC = () => {
  return (
    <>
      <Title>FreeDeck Configurator</Title>
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
    </>
  );
};
