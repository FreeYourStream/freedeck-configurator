import React from "react";
import styled from "styled-components";

import { FDIconButton } from "../lib/components/Button";
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
          <FDIconButton
            ml={5}
            icon="gr/GrGoogle"
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
            }
          >
            Google
          </FDIconButton>
          <FDIconButton
            ml={5}
            icon="ai/AiFillGithub"
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`)
            }
          >
            Github
          </FDIconButton>
          <FDIconButton
            ml={5}
            icon="fa/FaDiscord"
            onClick={() =>
              (window.location.href = `${process.env.REACT_APP_API_URL}/auth/discord`)
            }
          >
            Discord
          </FDIconButton>
        </Row>
      </ModalBody>
    </Modal>
  );
};
