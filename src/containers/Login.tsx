import React from "react";
import { FDButton } from "../lib/components/Button";
import { Window } from "../lib/components/Window";

export const Login: React.FC<{
  setClose: () => void;
  visible: boolean;
  onClose?: () => void;
}> = ({ visible, setClose, onClose }) => {
  return (
    <Window
      visible={visible}
      setClose={() => {
        if (onClose) onClose();
        setClose();
      }}
      title="Login"
    >
      <div className="p-8 flex justify-between gap-4">
        <FDButton
          onClick={() =>
            (window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`)
          }
        >
          Google
        </FDButton>
        <FDButton
          onClick={() =>
            (window.location.href = `${process.env.REACT_APP_API_URL}/auth/github`)
          }
        >
          Github
        </FDButton>
        <FDButton
          onClick={() =>
            (window.location.href = `${process.env.REACT_APP_API_URL}/auth/discord`)
          }
        >
          Discord
        </FDButton>
      </div>
    </Window>
  );
};
