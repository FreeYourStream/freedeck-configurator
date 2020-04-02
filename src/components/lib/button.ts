import styled from "styled-components";

export const Button = styled.button<{ bgcolor?: string }>`
  border-radius: 2px;
  letter-spacing: 1px;
  font-size: 16px;
  padding: 8px;
  border-style: none;
  color: black;
  background-color: ${p => p.bgcolor ?? "fuchsia"};
  font-weight: bold;
  cursor: pointer;
`;
