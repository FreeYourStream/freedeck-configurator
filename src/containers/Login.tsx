import React, { useContext } from "react";
import { FDButton } from "../lib/components/Button";
import { Window } from "../lib/components/Window";
import { AppDispatchContext, AppStateContext } from "../states/appState";

export const Login: React.FC<{}> = () => {
  const { setShowLogin } = useContext(AppDispatchContext);
  const { showLogin } = useContext(AppStateContext);
  return (
    <Window
      visible={showLogin}
      setClose={() => setShowLogin(false)}
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
