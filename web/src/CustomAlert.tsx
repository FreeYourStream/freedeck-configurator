import { useContext } from "react";

import { Alert } from "./lib/components/Alert";
import { Confirm } from "./lib/components/Confirm";
import { AppDispatchContext, AppStateContext } from "./states/appState";

export const CustomAlert = () => {
  const appState = useContext(AppStateContext);
  const { closeAlert, openAlert, closeConfirm, openConfirm } =
    useContext(AppDispatchContext);
  window.advancedAlert = (title, text) => openAlert({ title, text });
  window.advancedConfirm = (title, text, onAccept) =>
    openConfirm({ title, text, onAccept });

  return (
    <>
      <Alert
        isOpen={appState.alert.isOpen}
        text={appState.alert.text}
        title={appState.alert.title}
        onClose={() => closeAlert(undefined)}
      />
      <Confirm
        isOpen={appState.confirm.isOpen}
        text={appState.confirm.text}
        title={appState.confirm.title}
        onClose={(value) => closeConfirm({ value })}
      />
    </>
  );
};
