import React from "react";
import { useNavigate } from "react-router";

import { FDButton } from "../lib/components/Button";
import { FDWindow } from "../lib/components/Window";

export const LoginModal: React.FC<{}> = () => {
  const nav = useNavigate();
  return (
    <FDWindow visible={true} setClose={() => nav("/")} title="Login">
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
    </FDWindow>
  );
};
