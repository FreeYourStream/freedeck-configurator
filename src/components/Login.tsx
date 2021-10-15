import React from "react";
import styled from "styled-components";

import { FDButton, Icon } from "../lib/components/Button";
import { Row } from "../lib/components/Misc";
import { Modal, ModalBody } from "../lib/components/Modal";

export const Activator = styled.div<{ visible: boolean }>`
  display: ${(p) => (p.visible ? "flex" : "none")};
  flex-direction: column;
`;
export const Login: React.FC<{
  setClose: () => void;
  visible: boolean;
  onClose?: () => void;
}> = ({ visible, setClose, onClose }) => {
  return (
    <Modal
      visible={visible}
      setClose={() => {
        if (onClose) onClose();
        setClose();
      }}
      // minWidth={650}
      // minHeight={720}
      title="Login"
    >
      <ModalBody>
        <Row padding={5}>
          <FDButton
            prefix={<Icon icon="gr/GrGoogle" color="#fff" />}
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
            }
          >
            Google
          </FDButton>
          <FDButton
            prefix={<Icon icon="ai/AiFillGithub" color="#fff" />}
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`)
            }
          >
            Github
          </FDButton>
          <FDButton
            prefix={<Icon icon="fa/FaDiscord" color="#fff" />}
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/discord`)
            }
          >
            Discord
          </FDButton>
        </Row>
      </ModalBody>
    </Modal>
  );
};
