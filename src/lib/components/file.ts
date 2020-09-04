import styled from "styled-components";

export const File = styled.input.attrs({ type: "file" })<{ bgcolor?: string }>`
  border-radius: 2px;
  letter-spacing: 1px;
  font-size: 16px;
  padding: 8px;
  margin: 16px;
  border-style: none;
  color: white;
  background-color: ${p => p.bgcolor ?? "fuchsia"};
  font-weight: bold;
  cursor: pointer;
`;
