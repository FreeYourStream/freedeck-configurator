import { useEffect } from "react";
import { toast } from "react-toastify";
import { IAppDispatch } from "../states/appState";

export const AddEventListeners = ({
  appDispatchContext,
}: {
  appDispatchContext: IAppDispatch;
}) => {
  const { setCtrl } = appDispatchContext;
  return useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      if (!localStorage.getItem("closedPWACTA"))
        toast(
          "You can install the configurator to have it offline! Click here to install",
          {
            autoClose: false,
            position: "bottom-right",
            onClose: () => localStorage.setItem("closedPWACTA", "true"),
            onClick: () => (e as any).prompt(),
          }
        );
    });
    const onKeyUpDown = (event: KeyboardEvent) => {
      setCtrl(event.ctrlKey);
    };
    document.addEventListener("keydown", onKeyUpDown);
    document.addEventListener("keyup", onKeyUpDown);
    // eslint-disable-next-line
  }, []); // only execute on page load
};
