import { useContext } from "react";

import { Alert } from "./lib/components/Alert";
import { AppDispatchContext, AppStateContext } from "./states/appState";

export const CustomAlert = () => {
  const appState = useContext(AppStateContext);
  const { closeAlert, openAlert } = useContext(AppDispatchContext);
  window.advancedAlert = (title: string, text: string) =>
    openAlert({ title, text });

  return (
    <Alert
      isOpen={appState.alert.isOpen}
      text={appState.alert.text}
      title={appState.alert.title}
      onClose={() => closeAlert(undefined)}
    />
  );
};
