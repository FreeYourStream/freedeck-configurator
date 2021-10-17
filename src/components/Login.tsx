import React from "react";
import { FDButton, Icon } from "../lib/components/Button";
import { Modal } from "../lib/components/Modal";

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
      title="Login"
    >
      <div className="p-8 flex justify-between gap-4">
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
      </div>
    </Modal>
  );
};
